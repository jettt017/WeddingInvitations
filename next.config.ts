import type { NextConfig } from "next";

const buildDistDir = process.env.NEXT_BUILD_DIST_DIR?.trim();

const nextConfig: NextConfig = {
  ...(buildDistDir ? { distDir: buildDistDir } : {}),
};

export default nextConfig;
