import type { NextConfig } from "next";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const isDev = process.env.NODE_ENV === "development";

function getDeploymentId() {
  const explicitId =
    process.env.NEXT_DEPLOYMENT_ID ??
    process.env.DEPLOYMENT_VERSION ??
    process.env.GIT_SHA;

  if (explicitId) {
    return explicitId;
  }

  try {
    return execSync("git rev-parse --short=12 HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    const packageLock = readFileSync("package-lock.json");
    return createHash("sha256").update(packageLock).digest("hex").slice(0, 12);
  }
}

const deploymentId = getDeploymentId();

const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://api-maps.yandex.ru https://yastatic.net https://*.yandex.ru https://*.yandex.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://*.yandex.ru https://*.yandex.net https://*.maps.yandex.net;
  font-src 'self' data:;
  connect-src 'self' https://api-maps.yandex.ru https://*.yandex.ru https://*.yandex.net https://*.maps.yandex.net;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  frame-src 'none';
  ${isDev ? "" : "upgrade-insecure-requests;"}
`;

const nextConfig: NextConfig = {
  deploymentId,
  generateBuildId: async () => deploymentId,
  async headers() {
    return [
      {
        source: "/admin/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
      {
        source: "/api/admin/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          ...(isDev
            ? []
            : [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]),
        ],
      },
    ];
  },
};

export default nextConfig;
