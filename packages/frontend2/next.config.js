import { env } from './src/env.js'
import { withPlausibleProxy } from 'next-plausible'

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

function createNextConfig() {
  const plugins = [withPlausibleProxy()]

  return plugins.reduce((config, plugin) => plugin(config), nextConfig)
}

// biome-ignore lint/style/noDefaultExport: config file
export default createNextConfig
