/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: `https://l2beat-production.vercel.app/:path*`,
        },
      ],
    }
  },
}

export default nextConfig
