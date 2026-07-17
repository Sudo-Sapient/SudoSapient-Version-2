import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = "SudoSapient-Version-2";
const basePath = isGitHubPages ? `/${repositoryName}` : "";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const baseConfig: NextConfig = {
  reactStrictMode: true,
  output: isGitHubPages ? "export" : undefined,
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: isGitHubPages,
  images: {
    unoptimized: isGitHubPages,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

const nextConfig: NextConfig = isGitHubPages
  ? baseConfig
  : {
      ...baseConfig,
      async headers() {
        return [
          {
            source: "/(.*)",
            headers: securityHeaders,
          },
        ];
      },
    };

export default nextConfig;
