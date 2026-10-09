import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  const n = Number.parseInt(value, 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

export function useSafeMaterialTexture(accentColor: string) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return new CanvasTexture(canvas);
    }

    const { r, g, b } = hexToRgb(accentColor);
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 1400; i += 1) {
      const shade = (Math.random() - 0.45) * 28;
      ctx.fillStyle = `rgba(${Math.min(255, Math.max(0, r + shade))}, ${Math.min(255, Math.max(0, g + shade))}, ${Math.min(255, Math.max(0, b + shade))}, 0.22)`;
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 3, 18);
    }

    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    map.needsUpdate = true;
    return map;
  }, [accentColor]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return texture;
}
