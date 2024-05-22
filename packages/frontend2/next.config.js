import { env } from './src/env.js'

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
          destination: `${env.FALLBACK_REWRITE_DESTINATION}/:path*`,
        },
      ],
    }
  },
}

// biome-ignore lint/style/noDefaultExport: config file
export default nextConfig
