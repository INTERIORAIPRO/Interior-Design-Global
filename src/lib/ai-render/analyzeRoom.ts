export type RoomAnalysis = {
  widthM: number;
  depthM: number;
  heightM: number;
  horizonY: number;
  vanishingX: number;
  floorY: number;
  ceilingY: number;
  furnishedScore: number;
  perspective: "one-point" | "two-point";
  confidence: number;
  palette: [string, string, string];
  floorRgb: [number, number, number];
  floorLuma: number;
  lightAzimuth: number;
  imageWidth: number;
  imageHeight: number;
};

function luminance(r: number, g: number, b: number) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function toHex(r: number, g: number, b: number) {
  const h = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

export function loadHtmlImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read the room photo."));
    image.src = src;
  });
}

/**
 * Estimates room scale and perspective from pixels only.
 * Ceiling height uses a residential 2.6 m prior; width/depth follow the photo.
 */
export async function analyzeRoomImage(image: HTMLImageElement): Promise<RoomAnalysis> {
  const maxW = 480;
  const scale = Math.min(1, maxW / image.naturalWidth);
  const w = Math.max(32, Math.round(image.naturalWidth * scale));
  const h = Math.max(32, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Canvas is not available.");
  }
  ctx.drawImage(image, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  const rowGrad: number[] = new Array(h).fill(0);
  const colGrad: number[] = new Array(w).fill(0);
  let edgeSum = 0;

  for (let y = 1; y < h; y += 1) {
    for (let x = 1; x < w; x += 1) {
      const i = (y * w + x) * 4;
      const up = ((y - 1) * w + x) * 4;
      const left = (y * w + (x - 1)) * 4;
      const lum = luminance(data[i], data[i + 1], data[i + 2]);
      const lumUp = luminance(data[up], data[up + 1], data[up + 2]);
      const lumLeft = luminance(data[left], data[left + 1], data[left + 2]);
      const gy = Math.abs(lum - lumUp);
      const gx = Math.abs(lum - lumLeft);
      rowGrad[y] += gy;
      colGrad[x] += gx;
      edgeSum += gx + gy;
    }
  }

  const ceilingBand = rowGrad.slice(0, Math.floor(h * 0.45));
  const floorBandStart = Math.floor(h * 0.4);
  const floorBand = rowGrad.slice(floorBandStart);
  const ceilingY = (ceilingBand.indexOf(Math.max(...ceilingBand)) || 8) / h;
  const floorY = (floorBandStart + floorBand.indexOf(Math.max(...floorBand))) / h;

  let vanishX = 0.5;
  let best = 0;
  const midY = Math.floor(h * 0.45);
  for (let x = Math.floor(w * 0.2); x < w * 0.8; x += 1) {
    const i = (midY * w + x) * 4;
    const contrast = colGrad[x];
    if (contrast > best) {
      best = contrast;
      vanishX = x / w;
    }
    void i;
  }

  const wallPx = Math.max(24, (floorY - ceilingY) * h);
  const metersPerPx = 2.6 / wallPx;
  const widthM = Number((image.naturalWidth * metersPerPx * (0.72 + vanishX * 0.15)).toFixed(2));
  const depthM = Number(
    Math.max(2.4, (1 - floorY) * 9.5 + Math.abs(vanishX - 0.5) * 2.2).toFixed(2),
  );
  const heightM = 2.6;

  const lowerEdges =
    rowGrad.slice(Math.floor(h * 0.55)).reduce((a, b) => a + b, 0) /
    Math.max(1, h * 0.45 * w);
  const furnishedScore = Number(Math.max(0, Math.min(1, lowerEdges / 18)).toFixed(2));

  const samples = [
    [0.2, 0.25],
    [0.5, 0.2],
    [0.5, 0.75],
  ].map(([sx, sy]) => {
    const x = Math.floor(sx * w);
    const y = Math.floor(sy * h);
    const i = (y * w + x) * 4;
    return toHex(data[i], data[i + 1], data[i + 2]);
  }) as RoomAnalysis["palette"];

  const horizonY = Number(((ceilingY * 0.35 + floorY * 0.65)).toFixed(3));
  const twoPoint = Math.abs(vanishX - 0.5) > 0.12;
  const confidence = Number(
    Math.max(0.55, Math.min(0.93, 0.62 + (floorY - ceilingY) * 0.4 - furnishedScore * 0.08)).toFixed(2),
  );

  const floorRow = Math.min(h - 2, Math.max(1, Math.floor(floorY * h + (h - floorY * h) * 0.35)));
  const leftI = (floorRow * w + Math.floor(w * 0.2)) * 4;
  const midI = (floorRow * w + Math.floor(w * 0.5)) * 4;
  const rightI = (floorRow * w + Math.floor(w * 0.8)) * 4;
  const floorRgb: [number, number, number] = [
    Math.round((data[leftI] + data[midI] + data[rightI]) / 3),
    Math.round((data[leftI + 1] + data[midI + 1] + data[rightI + 1]) / 3),
    Math.round((data[leftI + 2] + data[midI + 2] + data[rightI + 2]) / 3),
  ];
  const floorLuma = luminance(floorRgb[0], floorRgb[1], floorRgb[2]);
  const leftWall = luminance(data[(Math.floor(h * 0.4) * w + 4) * 4], data[(Math.floor(h * 0.4) * w + 4) * 4 + 1], data[(Math.floor(h * 0.4) * w + 4) * 4 + 2]);
  const rightWall = luminance(
    data[(Math.floor(h * 0.4) * w + (w - 5)) * 4],
    data[(Math.floor(h * 0.4) * w + (w - 5)) * 4 + 1],
    data[(Math.floor(h * 0.4) * w + (w - 5)) * 4 + 2],
  );
  const lightAzimuth = rightWall > leftWall + 6 ? 1 : leftWall > rightWall + 6 ? -1 : 0;

  return {
    widthM: Math.max(2.6, Math.min(8.5, widthM)),
    depthM: Math.max(2.4, Math.min(9, depthM)),
    heightM,
    horizonY,
    vanishingX: Number(vanishX.toFixed(3)),
    floorY: Number(floorY.toFixed(3)),
    ceilingY: Number(ceilingY.toFixed(3)),
    furnishedScore,
    perspective: twoPoint ? "two-point" : "one-point",
    confidence,
    palette: samples,
    floorRgb,
    floorLuma,
    lightAzimuth,
    imageWidth: image.naturalWidth,
    imageHeight: image.naturalHeight,
  };
}

export function maskCoverage(mask: HTMLCanvasElement) {
  const ctx = mask.getContext("2d");
  if (!ctx) return 0;
  const { data } = ctx.getImageData(0, 0, mask.width, mask.height);
  let painted = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 24) painted += 1;
  }
  return painted / (mask.width * mask.height);
}
