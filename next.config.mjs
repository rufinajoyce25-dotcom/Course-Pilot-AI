/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // GitHub Pages project URL:
  // https://rufinajoyce25-dotcom.github.io/Course-Pilot-AI/
  basePath: '/Course-Pilot-AI',

  // Export Next.js as a static website
  output: 'export',

  // Required if the project uses next/image
  images: {
    unoptimized: true,
  },
};

export default nextConfig;