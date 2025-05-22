/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL("https://picsum.photos/seed/**/**/**")],
  },
};

module.exports = nextConfig;
