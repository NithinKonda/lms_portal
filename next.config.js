/** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: { unoptimized: true },
// };

// module.exports = nextConfig;


const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    // Add this to ignore `canvas` as an external dependency
    config.externals = config.externals || [];
    config.externals.push({
      canvas: "commonjs canvas",
    });

    return config;
  },
};

module.exports = nextConfig;
