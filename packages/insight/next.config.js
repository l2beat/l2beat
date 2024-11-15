import './src/env.js'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'assets.coingecko.com',
      'coin-images.coingecko.com',
      'token-repository.dappradar.com',
      'l2beat.com',
    ],
  },
}

function createNextConfig() {
  return nextConfig
}

// biome-ignore lint/style/noDefaultExport: config file
export default createNextConfig
