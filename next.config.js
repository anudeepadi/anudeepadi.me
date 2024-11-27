/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      { hostname: "icons.duckduckgo.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "www.google.com" },
      { hostname: "images.unsplash.com" },
    ],
  },
  typescript: {
    // Set this to false if you want production builds to abort if there are type errors
    ignoreBuildErrors: process.env.VERCEL_ENV === 'production',
  },
  eslint: {
    // Set this to false if you want production builds to abort if there are lint errors
    ignoreDuringBuilds: process.env.VERCEL_ENV === 'production',
  },
};

module.exports = nextConfig;