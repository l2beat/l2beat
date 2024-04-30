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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config
  },
}

export default withBundleAnalyzer(nextConfig)
