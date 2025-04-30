import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    minimumCacheTTL: 31536000,
    domains: ["lh3.googleusercontent.com"],
  },
  transpilePackages: [
    "@gelatomega/core",
    "@gelatomega/react-sdk",
    "@gelatomega/react-types",
    "@gelatomega/react-privy",
    "@gelatomega/react-dynamic"
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@gelatomega/core": path.resolve(__dirname, "./packages/core/src"),
      "@gelatomega/react-dynamic": path.resolve(__dirname, "./packages/react-dynamic/src"),
      "@gelatomega/react-privy": path.resolve(__dirname, "./packages/react-privy/src"),
      "@gelatomega/react-sdk": path.resolve(__dirname, "./packages/react-sdk/src"),
      "@gelatomega/react-types": path.resolve(__dirname, "./packages/react-types/src"),
    };
    return config;
  },
};

export default nextConfig;
