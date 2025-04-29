import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    minimumCacheTTL: 31536000,
    domains: ["lh3.googleusercontent.com"],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@gelatomega/core": path.resolve(
        __dirname,
        "../../packages/core/src/index.ts"
      ),
      "@gelatomega/react-dynamic": path.resolve(
        __dirname,
        "../../packages/react-dynamic/src/index.ts"
      ),
      "@gelatomega/react-privy": path.resolve(
        __dirname,
        "../../packages/react-privy/src/index.ts"
      ),
      "@gelatomega/react-sdk": path.resolve(
        __dirname,
        "../../packages/react-sdk/src/index.ts"
      ),
      "@gelatomega/core/oracle": path.resolve(
        __dirname,
        "../../packages/core/src/oracle/index.ts"
      ),
    };
    return config;
  },
};

export default nextConfig;
