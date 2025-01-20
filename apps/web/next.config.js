/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,  // ✅ Helps detect issues but can slow down dev mode
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
    ],
  },

  swcMinify: true, // ✅ Uses SWC compiler for faster builds

  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // ✅ Removes console logs in production
  },

  experimental: {
    appDir: false, // ✅ Disables unnecessary experimental app directory
    workerThreads: false, // ✅ Prevents high CPU usage
    cpus: 1, // ✅ Limits CPU to 1 core to reduce load
    turboMode: true, // ✅ Enables Next.js Turbo Mode for faster builds
  },
};

module.exports = nextConfig;