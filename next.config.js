/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL("https://picsum.photos/seed/**/500/300")],
  },
};

module.exports = nextConfig;
