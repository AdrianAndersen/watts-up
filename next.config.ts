import { NextConfig } from "next";

export default {
  typedRoutes: true,
  reactCompiler: true,
  cacheComponents: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  turbopack: {
    resolveAlias: {
      "@/*": "./src/*",
    },
  },
} as const satisfies NextConfig;
