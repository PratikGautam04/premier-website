/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/about", destination: "/" },
      { source: "/catalog", destination: "/" },
      { source: "/catalogue", destination: "/" },
      { source: "/contact", destination: "/" },
      { source: "/collection-:id", destination: "/" },
    ];
  },
};

module.exports = nextConfig;
