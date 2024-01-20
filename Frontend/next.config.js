/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  webpack(config, { dev }) {
    if (dev) {
      // This configuration is specific to the development server
      config.devServer = {
        overlay: {
          warnings: false,
          errors: false,
        },
      };
    }

    // Add any other custom Webpack configurations as needed

    return config;
  },
};

module.exports = nextConfig;
