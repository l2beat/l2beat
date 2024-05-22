/** @type {import('next').NextConfig} */
const nextConfig = {
  // biome-ignore lint/suspicious/useAwait: rewrites must be
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: '/:path*',
          destination: `https://l2beat-production.vercel.app/:path*`,
        },
      ],
    }
  },
}

// biome-ignore lint/style/noDefaultExport: config file
export default nextConfig
