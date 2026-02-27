/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    typedRoutes: true
  },
  ...(isGithubPages
    ? {
        basePath: "/bunkus",
        assetPrefix: "/bunkus/"
      }
    : {})
};

export default nextConfig;
