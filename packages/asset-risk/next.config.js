import './src/env.js'

import createBundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.coingecko.com'],
  },
  experimental: {
    typedRoutes: true,
  },
  webpack: (config) => {
    // Fix for issues with WalletConnect-related import issues
    // See: https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  eslint: {
    // We're using biome for linting
    ignoreDuringBuilds: true,
  },
}

// biome-ignore lint/style/noDefaultExport: this is a config file
export default withBundleAnalyzer(nextConfig)
