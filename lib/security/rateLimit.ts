type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

const buckets = new Map<string, number[]>();

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return (
    forwardedFor ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function checkRateLimit(
  request: Request,
  namespace: string,
  { limit, windowMs }: RateLimitOptions,
) {
  const now = Date.now();
  const key = `${namespace}:${getClientIp(request)}`;
  const recentHits = (buckets.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);

  if (recentHits.length >= limit) {
    buckets.set(key, recentHits);
    return false;
  }

  recentHits.push(now);
  buckets.set(key, recentHits);

  return true;
}
