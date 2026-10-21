function looksLikeImageUrl(value: string) {
  const trimmed = value.trim();
  return (
    /^https?:\/\//i.test(trimmed) ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("data:image") ||
    trimmed.startsWith("blob:")
  );
}

function urlFromText(value: string) {
  const match = value.match(/https?:\/\/[^\s"'<>]+/i);
  return match?.[0] ?? null;
}

export function extractImageUrl(value: unknown): string | null {
  if (value == null) return null;

  if (Array.isArray(value)) {
    return extractImageUrl(value[0]);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "[object Object]") return null;
    if (trimmed.startsWith("//") && trimmed.includes(".")) {
      return `https:${trimmed}`;
    }
    if (looksLikeImageUrl(trimmed)) return trimmed;
    const embedded = urlFromText(trimmed);
    if (embedded) return embedded;
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        return extractImageUrl(JSON.parse(trimmed));
      } catch {
        return null;
      }
    }
    return null;
  }

  if (value instanceof URL) {
    return value.toString();
  }

  if (typeof value === "object") {
    const record = value as {
      url?: unknown;
      href?: unknown;
      composedImageUrl?: unknown;
      output?: unknown;
      image?: unknown;
      toString?: () => string;
    };

    const recordWithUrls = value as { urls?: { get?: unknown } };
    const nested = [
      record.composedImageUrl,
      record.output,
      record.image,
      record.href,
      recordWithUrls.urls?.get,
    ];
    for (const candidate of nested) {
      const found = extractImageUrl(candidate);
      if (found) return found;
    }

    if (typeof record.url === "string") {
      return extractImageUrl(record.url);
    }
    if (typeof record.url === "function") {
      try {
        const result = record.url();
        if (result && typeof result === "object" && "then" in result) {
          return null;
        }
        return extractImageUrl(result);
      } catch {
        return null;
      }
    }

    if (typeof record.toString === "function") {
      const asString = record.toString();
      if (asString && asString !== "[object Object]" && looksLikeImageUrl(asString)) {
        return asString;
      }
    }
  }

  return null;
}

export async function extractImageUrlAsync(value: unknown): Promise<string | null> {
  const immediate = extractImageUrl(value);
  if (immediate) return immediate;

  if (value && typeof value === "object") {
    const record = value as { url?: unknown };
    if (typeof record.url === "function") {
      try {
        const result = await Promise.resolve(record.url());
        return extractImageUrl(result);
      } catch {
        return null;
      }
    }
  }

  if (Array.isArray(value)) {
    return extractImageUrlAsync(value[0]);
  }

  return null;
}
