import { isIP } from "node:net";

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type RateLimitBucket = {
  expiresAt: number;
  hits: number[];
};

const buckets = new Map<string, RateLimitBucket>();
const cleanupIntervalMs = 60_000;
const maxBuckets = 10_000;
let lastCleanupAt = 0;

function normalizeIp(value: string | null) {
  const candidate = value?.split(",")[0]?.trim();

  if (!candidate) {
    return null;
  }

  const withoutBrackets = candidate.replace(/^\[([^\]]+)\](?::\d+)?$/, "$1");
  const withoutIpv4Port = withoutBrackets.replace(/^(\d+\.\d+\.\d+\.\d+):\d+$/, "$1");

  return isIP(withoutIpv4Port) ? withoutIpv4Port : null;
}

function getClientIdentifier(request: Request) {
  const trustedIpHeader = process.env.RATE_LIMIT_IP_HEADER
    ?.trim()
    .toLowerCase();

  if (!trustedIpHeader || !/^[a-z0-9-]+$/.test(trustedIpHeader)) {
    return "shared";
  }

  return normalizeIp(request.headers.get(trustedIpHeader)) ?? "shared";
}

function cleanupBuckets(now: number) {
  if (now - lastCleanupAt < cleanupIntervalMs) {
    return;
  }

  lastCleanupAt = now;

  for (const [key, bucket] of buckets) {
    if (bucket.expiresAt <= now) {
      buckets.delete(key);
    }
  }

  if (buckets.size <= maxBuckets) {
    return;
  }

  const oldestKeys = [...buckets.entries()]
    .sort((first, second) => first[1].expiresAt - second[1].expiresAt)
    .slice(0, buckets.size - maxBuckets)
    .map(([key]) => key);

  for (const key of oldestKeys) {
    buckets.delete(key);
  }
}

export function checkRateLimit(
  request: Request,
  namespace: string,
  { limit, windowMs }: RateLimitOptions,
) {
  const now = Date.now();
  cleanupBuckets(now);

  const key = `${namespace}:${getClientIdentifier(request)}`;
  const isNewBucket = !buckets.has(key);
  const recentHits = (buckets.get(key)?.hits ?? []).filter(
    (timestamp) => now - timestamp < windowMs,
  );

  if (isNewBucket && buckets.size >= maxBuckets) {
    const oldestKey = buckets.keys().next().value;

    if (oldestKey) {
      buckets.delete(oldestKey);
    }
  }

  if (recentHits.length >= limit) {
    buckets.set(key, {
      expiresAt: now + windowMs,
      hits: recentHits,
    });
    return false;
  }

  recentHits.push(now);
  buckets.set(key, {
    expiresAt: now + windowMs,
    hits: recentHits,
  });

  return true;
}
