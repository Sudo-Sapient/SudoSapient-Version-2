import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

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

  // GitHub Pages still needs a static export
  output: isGitHubPages ? "export" : undefined,

  // NO repository base path when using a custom domain
  trailingSlash: true,

  images: {
    unoptimized: isGitHubPages,
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
