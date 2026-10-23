import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { extractImageUrlAsync } from "@/lib/ai-render/extractImageUrl";
import { resolveFurnitureSet, toRenderProduct } from "@/lib/ai-render/furnitureSets";
import { checkedChecklistSlots } from "@/lib/ai-render/furniturePieces";
import { partnerProducts, type RoomKind } from "@/lib/partner-store/catalog";

function getReplicateToken() {
  return (
    process.env.REPLICATE_API_TOKEN ||
    process.env.REPLICATE_API_KEY ||
    process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN ||
    ""
  );
}

const CONTROLNET_MODELS = {
  depth: "black-forest-labs/flux-depth-dev",
  interior:
    "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
} as const;

function normalizeRoomType(value?: string): RoomKind {
  const raw = (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
  if (
    raw.includes("office") ||
    raw.includes("birou") ||
    raw.includes("home office") ||
    raw.includes("study")
  ) {
    return "office";
  }
  if (raw.includes("kitchen") || raw.includes("bucat") || raw.includes("dining")) {
    return "kitchen";
  }
  if (raw.includes("baie") || raw.includes("bath")) {
    return "bathroom";
  }
  if (raw.includes("teras") || raw.includes("terrace") || raw.includes("outdoor")) {
    return "terrace";
  }
  if (raw.includes("living") || raw.includes("lounge") || raw.includes("sufrager")) {
    return "living";
  }
  if (raw.includes("bed") || raw.includes("dorm")) return "bedroom";
  return "living";
}

function isDormitorRoom(selectedRoom?: string, roomType?: string) {
  const raw = `${selectedRoom ?? ""} ${roomType ?? ""}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
  if (
    raw.includes("birou") ||
    raw.includes("living") ||
    raw.includes("sufrager") ||
    raw.includes("bucat") ||
    raw.includes("dining") ||
    raw.includes("baie") ||
    raw.includes("bath") ||
    raw.includes("teras") ||
    raw.includes("office") ||
    raw.includes("kitchen") ||
    raw.includes("terrace")
  ) {
    return false;
  }
  return (
    selectedRoom === "Dormitor" ||
    roomType === "bedroom" ||
    raw === "dormitor" ||
    raw.includes("dormitor")
  );
}

function buildNegativePrompt(selectedRoom?: string, roomType?: string) {
  const artifacts =
    "visual artifacts, jpeg artifacts, compression artifacts, noise, grain, glitches, banding, chromatic aberration, lens flare, motion blur, pixelation, low resolution, oversharpening, halos, ghosting, melted geometry, warped walls, deformed furniture, distorted perspective, extra limbs, extra fingers, duplicate objects, broken edges, CGI look, 3d render, plastic surfaces, fake lighting, oversaturated HDR, muddy textures, watermark, text overlay, logo";
  if (!isDormitorRoom(selectedRoom, roomType)) {
    return `bed, bedroom, nightstand, headboard, duvet, pillows, bedsheets, mattress, ${artifacts}`;
  }
  return artifacts;
}

async function outputUrl(output: unknown): Promise<string | null> {
  return extractImageUrlAsync(Array.isArray(output) ? output[0] : output);
}

function readPngSize(bytes: Buffer) {
  if (bytes.length < 24 || bytes[0] !== 0x89 || bytes[1] !== 0x50) return null;
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

function readJpegSize(bytes: Buffer) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) break;
    const marker = bytes[offset + 1];
    const length = bytes.readUInt16BE(offset + 2);
    const isSof =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isSof) {
      return {
        height: bytes.readUInt16BE(offset + 5),
        width: bytes.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + length;
  }
  return null;
}

function imageSizeFromDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  const bytes = Buffer.from(match[2], "base64");
  return readPngSize(bytes) || readJpegSize(bytes);
}

function closestAspectRatio(width: number, height: number) {
  const ratio = width / Math.max(height, 1);
  const options = [
    { label: "16:9", value: 16 / 9 },
    { label: "4:3", value: 4 / 3 },
    { label: "3:2", value: 3 / 2 },
    { label: "1:1", value: 1 },
    { label: "2:3", value: 2 / 3 },
    { label: "3:4", value: 3 / 4 },
    { label: "9:16", value: 9 / 16 },
  ];
  return [...options].sort(
    (left, right) => Math.abs(left.value - ratio) - Math.abs(right.value - ratio),
  )[0].label;
}

function scaledOutputSize(width: number, height: number) {
  const maxEdge = 1024;
  const scale = Math.min(maxEdge / width, maxEdge / height, 1);
  const round = (value: number) => Math.max(512, Math.round((value * scale) / 8) * 8);
  return {
    width: round(width),
    height: round(height),
  };
}

function toDataUrlFromBytes(bytes: Buffer, mime: string) {
  const type = mime || "image/jpeg";
  return `data:${type};base64,${bytes.toString("base64")}`;
}

async function freshUserImage(imageUrl: string) {
  const dataUrl = await toDataUrl(imageUrl);
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return dataUrl;
  const bytes = Buffer.from(match[2], "base64");
  return toDataUrlFromBytes(bytes, match[1]);
}

async function toDataUrl(imageUrl: string) {
  if (imageUrl.startsWith("data:")) {
    const match = imageUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) {
      throw new Error("Formatul imaginii nu este un data URI valid.");
    }
    return imageUrl;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Nu am putut descărca imaginea camerei.");
    }
    const mime =
      response.headers.get("content-type")?.split(";")[0] || "image/jpeg";
    const bytes = Buffer.from(await response.arrayBuffer());
    return toDataUrlFromBytes(bytes, mime);
  }

  if (imageUrl.startsWith("/") && !imageUrl.startsWith("//")) {
    const relative = imageUrl.replace(/^\/+/, "");
    const filePath = path.join(process.cwd(), "public", relative);
    const bytes = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mime =
      ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
    return toDataUrlFromBytes(bytes, mime);
  }

  throw new Error(
    "Imaginea trebuie să fie un URL http(s), un fișier din /public sau un data URI.",
  );
}

function errorText(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isCreditOrRateLimit(error: unknown) {
  return /429|Too Many Requests|rate.?limit|insufficient.?credit|out of credit|quota|throttl|402/i.test(
    errorText(error),
  );
}

function isAuthError(error: unknown) {
  return /401|unauthoriz|unauthenticated|invalid.?token|invalid.?api.?key|Unauthenticated/i.test(
    errorText(error),
  );
}

function isUnavailable(error: unknown) {
  const message = errorText(error);
  if (isCreditOrRateLimit(error) || isAuthError(error)) return false;
  return /422|404|not permitted|Invalid version|does not exist|Forbidden|\/v1\/files/i.test(
    message,
  );
}

function friendlyApiError(error: unknown) {
  const token = getReplicateToken();
  if (!token || errorText(error) === "MISSING_REPLICATE_TOKEN") {
    return "Cheia Replicate nu a fost configurată corect în Environment Variables.";
  }
  if (isAuthError(error)) {
    return "Cheia Replicate nu a fost configurată corect în Environment Variables.";
  }
  if (isCreditOrRateLimit(error)) {
    return "Serviciul de randare este ocupat momentan. Încearcă din nou în câteva minute.";
  }
  return "Nu am putut genera randarea acum. Încearcă din nou peste puțin timp.";
}

async function runControlNet(
  replicate: Replicate,
  dataUrl: string,
  prompt: string,
  negativePrompt: string,
  keepStructure: boolean,
  isBedroom: boolean,
  frame?: { width?: number; height?: number; seed?: number },
) {
  const imageStrength = isBedroom ? (keepStructure ? 0.58 : 0.7) : 0.35;
  const controlScale = isBedroom ? imageStrength : 0.3;
  const measured = imageSizeFromDataUrl(dataUrl);
  const width = frame?.width || measured?.width;
  const height = frame?.height || measured?.height;
  const aspect =
    width && height ? closestAspectRatio(width, height) : undefined;
  const size = width && height ? scaledOutputSize(width, height) : undefined;
  const seed = frame?.seed ?? Date.now() % 2147483647;
  const frameInput = {
    ...(aspect ? { aspect_ratio: aspect } : {}),
    ...(size ? { width: size.width, height: size.height } : {}),
    seed,
  };
  try {
    const output = await replicate.run(CONTROLNET_MODELS.interior, {
      input: {
        image: dataUrl,
        prompt,
        negative_prompt: negativePrompt,
        guidance_scale: 15,
        prompt_strength: imageStrength,
        image_strength: imageStrength,
        controlnet_conditioning_scale: controlScale,
        num_inference_steps: 40,
        ...frameInput,
      },
    });
    const url = await outputUrl(output);
    if (!url) throw new Error("ControlNet interior nu a returnat nicio imagine.");
    return url;
  } catch (error) {
    if (isAuthError(error) || isCreditOrRateLimit(error)) throw error;
    if (!isUnavailable(error)) throw error;
    console.warn(
      "Pipeline-ul interior ControlNet indisponibil, folosim Flux Depth pe fotografia utilizatorului.",
      error instanceof Error ? error.message : error,
    );
  }

  const output = await replicate.run(CONTROLNET_MODELS.depth, {
    input: {
      prompt: `${prompt} Avoid: ${negativePrompt}.`,
      image: dataUrl,
      control_image: dataUrl,
      image_strength: imageStrength,
      controlnet_conditioning_scale: controlScale,
      guidance: 8,
      num_inference_steps: 32,
      output_format: "jpg",
      output_quality: 90,
      ...frameInput,
    },
  });
  const url = await outputUrl(output);
  if (!url) throw new Error("Flux Depth nu a returnat nicio imagine.");
  return url;
}

export async function POST(request: Request) {
  try {
    const apiToken =
      process.env.REPLICATE_API_TOKEN ||
      process.env.REPLICATE_API_KEY ||
      process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN;
    if (!apiToken) {
      console.error(
        "Cheia Replicate nu a fost configurată corect în Environment Variables.",
      );
      return NextResponse.json(
        {
          error:
            "Cheia Replicate nu a fost configurată corect în Environment Variables.",
        },
        { status: 200 },
      );
    }

    const replicate = new Replicate({
      auth: apiToken,
    });
    const body = await request.json();
    const {
      userImage,
      imageUrl: bodyImageUrl,
      image,
      roomType,
      selectedRoom,
      style,
      selectedStyle,
      selectedBrand,
      selectedBrands,
      keepStructure,
      vendorId,
      imageWidth,
      imageHeight,
      selectedSlots,
      selectedPieces,
    } = body as {
      userImage?: string;
      imageUrl?: string;
      image?: string;
      roomType?: string;
      selectedRoom?: string;
      style?: string;
      selectedStyle?: string;
      selectedBrand?: string;
      selectedBrands?: string[];
      keepStructure?: boolean;
      vendorId?: string;
      imageWidth?: number;
      imageHeight?: number;
      selectedSlots?: string[];
      selectedPieces?: string[];
    };

    const imageUrl = [userImage, bodyImageUrl, image].find(
      (value): value is string => typeof value === "string" && value.length > 0,
    );

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Lipsește imaginea camerei." },
        { status: 400 },
      );
    }

    const dataUrl = await freshUserImage(imageUrl);
    const roomName = (selectedRoom || "").trim();
    const styleName = (selectedStyle || style || "").trim();
    const selectedPiecesList = (selectedPieces ?? [])
      .map((piece) => String(piece).trim())
      .filter(Boolean);
    const isBedroom = isDormitorRoom(roomName || selectedRoom, roomType);
    const prompt = isBedroom
      ? `A photorealistic render of a ${roomName} in ${styleName} style, containing strictly: ${selectedPiecesList.join(", ")}.`
      : `A photorealistic render of a ${roomName} in ${styleName} style, containing strictly: ${selectedPiecesList.join(", ")}. Completely remove any beds or bedroom furniture.`;
    const room = normalizeRoomType(selectedRoom || roomType);
    const negativePrompt = buildNegativePrompt(roomName || selectedRoom, roomType || room);
    const brandIds = [
      ...(Array.isArray(selectedBrands) ? selectedBrands : []),
      vendorId,
      selectedBrand,
    ].filter((id): id is string => Boolean(id) && id !== "mix");
    const checkedSlots = checkedChecklistSlots(
      selectedSlots,
      selectedPieces,
      room,
    );
    const selectedSet = resolveFurnitureSet(
      room,
      style || styleName,
      brandIds,
      partnerProducts,
      checkedSlots,
      selectedPieces,
    ).slice(0, checkedSlots.length);
    const generatedImageUrl = await runControlNet(
      replicate,
      dataUrl,
      prompt,
      negativePrompt,
      Boolean(keepStructure),
      isBedroom,
      {
        width: Number(imageWidth) || undefined,
        height: Number(imageHeight) || undefined,
        seed: Date.now() % 2147483647,
      },
    );

    if (!generatedImageUrl) {
      return NextResponse.json(
        { error: "Replicate nu a returnat nicio imagine." },
        { status: 502 },
      );
    }

    const productsPayload = selectedSet
      .slice(0, checkedSlots.length)
      .map(toRenderProduct);
    return NextResponse.json({
      renderUrl: generatedImageUrl,
      imageUrl: generatedImageUrl,
      composedImageUrl: generatedImageUrl,
      output: generatedImageUrl,
      products: productsPayload,
      prompt,
      generatedAt: Date.now(),
    });
  } catch (error: unknown) {
    console.error("Eroare la generarea cu Replicate:", errorText(error));
    return NextResponse.json(
      { error: friendlyApiError(error) },
      { status: 200 },
    );
  }
}
