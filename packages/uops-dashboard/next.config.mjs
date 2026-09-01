/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@l2beat/shared',
    '@l2beat/shared-pure',
    '@l2beat/validate',
    '@l2beat/backend-tools',
  ],
  experimental: {
    esmExternals: 'loose',
  },
}

export default nextConfig
