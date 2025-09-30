import { NextConfig } from "next";

export default {
  typedRoutes: true,
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
    reactCompiler: true,
  },
  turbopack: {
    resolveAlias: {
      "@/*": "./src/*",
    },
  },
} as const satisfies NextConfig;
