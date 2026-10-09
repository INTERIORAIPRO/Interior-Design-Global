import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const CONTROLNET_MODELS = {
  depth:
    "black-forest-labs/flux-depth-dev",
  interior:
    "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
} as const;

const roomBriefs = {
  living:
    "a living room / lounge with sofa seating and a coffee table, clearly not a bedroom",
  bedroom:
    "a bedroom with a bed as the main piece, nightstands and calm sleeping layout, clearly not a living room or lounge",
  office:
    "a home office with a desk and work seating, clearly not a bedroom or living room",
  kitchen:
    "a kitchen or dining room with cooking and dining furniture, clearly not a living room",
} as const;

const styleBriefs = {
  scandinavian:
    "Scandinavian interior style: light oak, white walls, airy textiles, simple Nordic forms, no dark luxury glamour",
  modern:
    "modern contemporary interior style: clean architectural lines, current furnishings, uncluttered surfaces",
  contemporary:
    "contemporary interior style: current designer furnishings, calm architecture, uncluttered surfaces",
  classic:
    "classic interior style: refined millwork, tailored upholstery, traditional European elegance",
  industrial:
    "industrial interior style: metal, wood, loft materials, raw but habitable",
  minimal:
    "minimal interior style: sparse furniture, quiet palette, generous empty space",
  minimalist:
    "minimalist interior style: sparse furniture, quiet palette, generous empty space",
  midcentury:
    "mid-century modern interior style: tapered wood legs, organic curves, warm vintage designer pieces",
  japandi:
    "Japandi interior style: Japanese-Scandinavian calm, low furniture, natural wood, restrained ceramics",
  boho:
    "bohemian interior style: layered textiles, organic ceramics, warm collected decor",
} as const;

type RoomKey = keyof typeof roomBriefs;
type StyleKey = keyof typeof styleBriefs;

type PromptProduct = {
  name?: string;
  category?: string;
  promptHint?: string;
};

const styleMaterials: Record<string, string> = {
  scandinavian:
    "pale white-oak grain, oatmeal and ivory linen, matte off-white ceramics, slender tapered wooden legs, airy daylight, no dark mahogany, no baroque gold",
  modern:
    "smooth light oak, graphite and matte-black metal, crisp geometric silhouettes, quiet greige textiles, sharp contemporary lines",
  contemporary:
    "smooth light oak, graphite metal, crisp geometric silhouettes, calm greige textiles",
  classic:
    "refined oak millwork, tailored oatmeal upholstery, muted brass hardware",
  industrial:
    "blackened steel frames, raw oak, charcoal linen, matte iron lamps",
  minimal:
    "sparse pale oak, ivory linen, almost no ornament, generous empty floor",
  minimalist:
    "sparse pale oak, ivory linen, almost no ornament, generous empty floor",
  midcentury:
    "tapered teak-oak legs, warm walnut accents, organic curves, mustard or cream shades",
  japandi:
    "low pale oak, oatmeal linen, matte stoneware, quiet negative space",
  boho:
    "natural oak, terracotta and sand textiles, organic handmade ceramics",
};

const namedVisuals: Record<string, string> = {
  "Canapea 3 locuri Nordic Velvet":
    "a wide three-seat low Scandinavian sofa upholstered in plush oatmeal-sand velvet, deep seat cushions, slim rectangular back, four short tapered pale-oak legs, no tufting, no Chesterfield buttons",
  "Lampadar arcuit din alamă":
    "a tall arched floor lamp with a slender brushed-brass stem that curves over seating, round warm-linen drum shade, circular marble or pale-oak base, lit with warm 2700K glow",
  "Măsuță de cafea din lemn masiv":
    "a low rectangular solid pale-oak coffee table with visible straight wood grain, thick tabletops, simple square-block or hairpin-light legs, no glass, no marble luxury slab",
  "Covor pufos din lână naturală":
    "a large plush high-pile natural-wool rug in warm beige-sand, soft irregular texture covering the floor under the main furniture, not a small bath mat",
  "Vază ceramică design organic":
    "a medium matte stoneware vase with an irregular organic silhouette, sand and off-white glaze, sitting as a visible accent on a table or nightstand",
  "Pat tapițat Nordic":
    "a low Scandinavian upholstered bed as the hero piece: wide rectangular headboard in oatmeal linen with slim piping, pale-oak platform base, white linen duvet, two matching pillows, clearly a bed not a sofa",
  "Noptieră stejar deschis":
    "a compact square light-oak nightstand with a single drawer, slender tapered legs, pale Nordic grain, placed tight beside the bed",
  "Birou stejar scandinav":
    "a long Scandinavian writing desk in pale oak, slim rectangular top, tapered legs, clean uncluttered surface",
  "Masă dining stejar":
    "a solid pale-oak dining table with a thick rectangular top and simple Nordic legs, dining scale not a coffee table",
  "Lampadar minimal negru":
    "a slim matte-black tripod or stick floor lamp, thin stem, small drum or cone shade, contemporary silhouette",
  "Noptieră metal industrial":
    "a compact industrial bedside table with a black metal frame and oak top, open shelf, placed beside the bed",
  "Pătură textilă boho":
    "a folded layered throw in sand and terracotta weave draped on the bed or sofa edge",
  "Fotoliu lounge Nordic":
    "a sculptural Scandinavian lounge armchair in oatmeal boucle or light linen, rounded back, visible pale-oak legs, one-seat accent chair not a sofa",
  "Veioze ceramice scandinave":
    "a matching pair of ceramic bedside table lamps (veioze) with round matte off-white bases and linen drum shades, one on each nightstand, warm practical glow",
};

const categoryFallback: Record<string, string> = {
  sofas:
    "low Scandinavian seating with pale-oak legs and oatmeal textile upholstery",
  beds:
    "a low upholstered Nordic bed with a wide linen headboard and pale-oak base",
  lighting:
    "a slender contemporary lamp with warm shade and metal or ceramic base",
  tables:
    "pale-oak furniture with simple Nordic geometry and visible wood grain",
  rugs: "a large beige wool area rug under the main furniture",
  decor: "a matte ceramic decorative object in sand and off-white",
};

function styleLexicon(style: string) {
  return styleMaterials[style] ?? styleMaterials.scandinavian;
}

function productVisual(product: PromptProduct, style: string) {
  const name = product.name?.trim() || "The Home piece";
  const named = namedVisuals[name];
  const hint = product.promptHint?.trim();
  const fallback =
    (product.category && categoryFallback[product.category]) ||
    "catalog-quality Nordic furniture from The Home";
  const body = named || hint || fallback;
  return `(${name}:1.35), MUST be clearly visible in the photograph: ${body}. Materials locked to The Home ${style} look: ${styleLexicon(style)}. Correct real-world scale, grounded on the floor, photoreal product photography.`;
}

function buildProductBlock(products: PromptProduct[] | undefined, style: string) {
  const list = (products ?? []).filter((product) => product.name);
  if (!list.length) return "";
  const weighted = list.map((product) => `(${product.name}:1.4)`).join(", ");
  const lines = list.map(
    (product, index) =>
      `MANDATORY ${index + 1}: ${productVisual(product, style)} Do not omit this object. Do not replace it with a different typology.`,
  );
  return [
    `The Home catalog staging, every listed piece MUST appear: ${weighted}.`,
    "Force the diffusion model to render these exact furniture objects as the main staged pieces, occupying the room, sharp and recognizable:",
    ...lines,
    "Do not invent a generic living-room sofa unless a sofa is listed. Do not hide listed lamps, nightstands, armchairs or the bed. Keep each The Home piece fully in frame.",
  ].join(" ");
}

function buildPrompt(
  roomType: string | undefined,
  style: string | undefined,
  products?: PromptProduct[],
) {
  const room: RoomKey = roomType && roomType in roomBriefs ? (roomType as RoomKey) : "living";
  const chosenStyle: StyleKey =
    style && style in styleBriefs ? (style as StyleKey) : "scandinavian";
  const productBlock = buildProductBlock(products, chosenStyle);
  return [
    "VIRTUAL STAGING / INTERIOR REDESIGN of the user's own room photograph, photorealistic, 8k, magazine interior photography",
    "The uploaded photo is the structural reference: keep the SAME room shape, walls, windows, doors, ceiling, floor plane, architectural lines and camera angle. Do not invent a different floor plan.",
    "REMOVE the existing old furniture, clutter and previous staging. Replace it with the listed The Home catalog pieces only, correctly scaled and grounded on the original floor.",
    `This space is ${roomBriefs[room]}.`,
    `${styleBriefs[chosenStyle]}. Palette and materials: ${styleLexicon(chosenStyle)}.`,
    productBlock,
    "Natural window light matching the original photo, contact shadows, no collage, no floating objects.",
  ]
    .filter(Boolean)
    .join(" ");
}

function buildNegativePrompt(roomType: string | undefined) {
  const shared =
    "keep original old furniture, leftover previous sofa, unchanged existing clutter, empty unfinished room, generic unbranded lumps, cartoon, illustration, collage, floating furniture, wrong scale, different floor plan, moved walls, baroque gold, crystal chandelier, dark mahogany luxury, neon colors, blurry objects, watermark, text overlay, extra duplicate furniture";
  if (roomType === "bedroom") {
    return `${shared}, living room, lounge sofa as the hero, sectional couch instead of a bed, dining table as the focus, no bed, missing nightstands, missing bedside lamps`;
  }
  if (roomType === "office") {
    return `${shared}, bedroom, bed, living room sofa, kitchen`;
  }
  if (roomType === "kitchen") {
    return `${shared}, bedroom, bed, living room sofa`;
  }
  if (roomType === "living") {
    return `${shared}, bedroom, bed, mattress, kitchen appliances`;
  }
  return shared;
}

function outputUrl(output: unknown): string | null {
  if (!output) return null;
  if (typeof output === "string") return output;
  if (Array.isArray(output)) return outputUrl(output[0]);
  if (typeof output === "object" && output !== null) {
    const file = output as { url?: () => string; href?: string };
    if (typeof file.url === "function") return file.url();
    if (typeof file.href === "string") return file.href;
  }
  return null;
}

async function uploadToReplicate(bytes: Buffer, mime: string) {
  const blob = new Blob([new Uint8Array(bytes)], { type: mime || "image/jpeg" });
  const uploaded = (await replicate.files.create(blob)) as {
    urls?: { get?: string };
  };
  const url = uploaded.urls?.get;
  if (!url) {
    throw new Error("Replicate nu a putut stoca imaginea camerei.");
  }
  return url;
}

async function toPublicImageUri(imageUrl: string) {
  if (imageUrl.startsWith("data:")) {
    const match = imageUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) {
      throw new Error("Formatul imaginii nu este un data URI valid.");
    }
    return uploadToReplicate(Buffer.from(match[2], "base64"), match[1]);
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Nu am putut descărca imaginea camerei.");
    }
    const mime = response.headers.get("content-type")?.split(";")[0] || "image/jpeg";
    const bytes = Buffer.from(await response.arrayBuffer());
    return uploadToReplicate(bytes, mime);
  }

  if (imageUrl.startsWith("/") && !imageUrl.startsWith("//")) {
    const relative = imageUrl.replace(/^\/+/, "");
    const filePath = path.join(process.cwd(), "public", relative);
    const bytes = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mime =
      ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
    return uploadToReplicate(bytes, mime);
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

function isUnavailable(error: unknown) {
  const message = errorText(error);
  if (isCreditOrRateLimit(error)) return false;
  return /422|404|not permitted|Invalid version|does not exist|unauthenticated|Forbidden/i.test(
    message,
  );
}

async function runControlNet(
  controlImageUrl: string,
  prompt: string,
  negativePrompt: string,
) {
  try {
    const output = await replicate.run(CONTROLNET_MODELS.interior, {
      input: {
        image: controlImageUrl,
        prompt,
        negative_prompt: negativePrompt,
        guidance_scale: 15,
        prompt_strength: 0.74,
        num_inference_steps: 40,
      },
    });
    const url = outputUrl(output);
    if (!url) throw new Error("ControlNet interior nu a returnat nicio imagine.");
    return url;
  } catch (error) {
    if (!isUnavailable(error)) throw error;
    console.warn(
      "Pipeline-ul interior ControlNet indisponibil, folosim Flux Depth pe fotografia utilizatorului.",
      error instanceof Error ? error.message : error,
    );
  }

  const output = await replicate.run(CONTROLNET_MODELS.depth, {
    input: {
      prompt: `${prompt} Avoid: ${negativePrompt}.`,
      control_image: controlImageUrl,
      guidance: 8,
      num_inference_steps: 32,
      output_format: "jpg",
      output_quality: 90,
    },
  });
  const url = outputUrl(output);
  if (!url) throw new Error("Flux Depth nu a returnat nicio imagine.");
  return url;
}

const DEFAULT_FALLBACK_SCENE =
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=80";

function fallbackResponse(imageUrl: string) {
  return NextResponse.json({
    composedImageUrl: imageUrl,
    fallback: true,
  });
}

export async function POST(request: Request) {
  let fallbackImageUrl = DEFAULT_FALLBACK_SCENE;

  try {
    const body = await request.json();
    const { imageUrl, roomType, style, products, fallbackImageUrl: bodyFallback } =
      body as {
        imageUrl?: string;
        roomType?: string;
        style?: string;
        products?: PromptProduct[];
        fallbackImageUrl?: string;
      };

    if (typeof bodyFallback === "string" && bodyFallback.length > 0) {
      fallbackImageUrl = bodyFallback;
    }

    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json(
        { error: "Lipsește imaginea camerei." },
        { status: 400 },
      );
    }

    try {
      const publicImageUrl = await toPublicImageUri(imageUrl);
      const prompt = buildPrompt(roomType, style, products);
      const negativePrompt = buildNegativePrompt(roomType);
      const generatedImageUrl = await runControlNet(
        publicImageUrl,
        prompt,
        negativePrompt,
      );

      if (!generatedImageUrl) {
        return fallbackResponse(fallbackImageUrl);
      }

      return NextResponse.json({ composedImageUrl: generatedImageUrl });
    } catch (error: unknown) {
      console.warn(
        "Replicate indisponibil, folosim scena de catalog:",
        errorText(error),
      );
      return fallbackResponse(fallbackImageUrl);
    }
  } catch (error: unknown) {
    console.error("Eroare la generarea cu Replicate:", errorText(error));
    return fallbackResponse(fallbackImageUrl);
  }
}
