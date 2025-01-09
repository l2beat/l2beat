import { withPlausibleProxy as createPlausibleProxyPlugin } from 'next-plausible'
import './src/env.js'
import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      // Do not put @l2beat/backend or @l2beat/config here!
      '@l2beat/database',
      '@l2beat/discovery',
      '@l2beat/discovery-types',
      '@l2beat/shared-pure',
      '@l2beat/shared',
    ],
  },
  images: {
    domains: [
      'assets.coingecko.com',
      'coin-images.coingecko.com',
      'token-repository.dappradar.com',
      'l2beat.com',
    ],
  },
  async headers() {
    return [
      {
        source: '/api/scaling/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
  // biome-ignore lint/suspicious/useAwait: rewrites must be async
  async redirects() {
    return [
      // Basic page redirects
      {
        source: '/',
        destination: '/scaling/summary',
        permanent: false,
      },
      {
        source: '/scaling',
        destination: '/scaling/summary',
        permanent: false,
      },
      {
        source: '/bridges/tvl',
        destination: '/bridges/summary',
        permanent: false,
      },
      {
        source: '/bridges',
        destination: '/bridges/summary',
        permanent: false,
      },
      {
        source: '/data-availability',
        destination: '/data-availability/summary',
        permanent: false,
      },
      {
        source: '/jobs',
        destination:
          'https://l2beat.notion.site/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f',
        permanent: false,
      },
      // Renamed projects
      // TODO: Move once we migrate detail pages to Next.js
      {
        source: '/scaling/projects/zksync',
        destination: '/scaling/projects/zksync-lite',
        permanent: true,
      },
      {
        source: '/scaling/projects/zksync2',
        destination: '/scaling/projects/zksync-era',
        permanent: true,
      },
      // Legacy pathnames
      {
        source: '/project/:name',
        destination: '/scaling/projects/:name',
        permanent: true,
      },
      {
        source: '/projects/:name',
        destination: '/scaling/projects/:name',
        permanent: true,
      },
      {
        source: '/scaling/tvl',
        destination: '/scaling/tvs',
        permanent: true,
      },
      {
        source: '/scaling/detailedTvl',
        destination: '/scaling/tvs',
        permanent: true,
      },
      {
        source: '/project/layer2.finance',
        destination: '/scaling/projects/layer2finance',
        permanent: true,
      },
      {
        source: '/project/leverj',
        destination: '/scaling/projects/gluon',
        permanent: true,
      },
      {
        source: '/projects/leverj',
        destination: '/scaling/projects/gluon',
        permanent: true,
      },
      {
        source: '/projects/fuel',
        destination: '/scaling/projects/fuelv1',
        permanent: true,
      },
      {
        source: '/projects/zkswapv2',
        destination: '/scaling/projects/zkspace',
        permanent: true,
      },
      {
        source: '/projects/deversifi',
        destination: '/scaling/projects/rhinofi',
        permanent: true,
      },
    ]
  },
  // biome-ignore lint/suspicious/useAwait: rewrites must be async
  async rewrites() {
    return {
      // TODO: Remove when both frontends stop using the backend (indexer) API
      // When doing so, remove also the same rewrites in root vercel.json.
      beforeFiles: [
        {
          source: '/api/projects/:project/tvl/assets/:asset',
          has: [{ type: 'host', value: '.*staging.*' }],
          destination:
            'https://staging.l2beat.com/api/projects/:project/tvl/assets/:asset',
        },
        {
          source: '/api/projects/:project/tvl/assets/:asset',
          destination:
            'https://api.l2beat.com/api/projects/:project/tvl/assets/:asset',
        },
        {
          source:
            '/api/projects/:project/tvl/chains/:chain/assets/:asset/types/:type',
          has: [{ type: 'host', value: '.*staging.*' }],
          destination:
            'https://staging.l2beat.com/api/projects/:project/tvl/chains/:chain/assets/:asset/types/:type',
        },
        {
          source:
            '/api/projects/:project/tvl/chains/:chain/assets/:asset/types/:type',
          destination:
            'https://api.l2beat.com/api/projects/:project/tvl/chains/:chain/assets/:asset/types/:type',
        },
        {
          source: '/api/tvl/token',
          has: [{ type: 'host', value: '.*staging.*' }],
          destination: 'https://staging.l2beat.com/api/tvl/token',
        },
        {
          source: '/api/tvl/token',
          destination: 'https://api.l2beat.com/api/tvl/token',
        },
        {
          source: '/api/tvl/aggregate',
          has: [{ type: 'host', value: '.*staging.*' }],
          destination: 'https://staging.l2beat.com/api/tvl/aggregate',
        },
        {
          source: '/api/tvl/aggregate',
          destination: 'https://api.l2beat.com/api/tvl/aggregate',
        },
        {
          source: '/api/tvl/aggregate',
          has: [{ type: 'host', value: '.*staging.*' }],
          destination: 'https://staging.l2beat.com/api/tvl/aggregate',
        },
        {
          source: '/api/tvl/aggregate',
          destination: 'https://api.l2beat.com/api/tvl/aggregate',
        },
        {
          source: '/api/activity/aggregate',
          has: [{ type: 'host', value: '.*staging.*' }],
          destination: 'https://staging.l2beat.com/api/activity/aggregate',
        },
        {
          source: '/api/activity/aggregate',
          destination: 'https://api.l2beat.com/api/activity/aggregate',
        },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
}

function createNextConfig() {
  const plausibleConfig = createPlausibleProxyPlugin()(nextConfig)
  if (process.env.NODE_ENV === 'production') {
    return withSentryConfig(plausibleConfig, {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options

      org: 'l2beat-9de9804ec',
      project: 'frontend',

      // Only print logs for uploading source maps in CI
      silent: !process.env.CI,

      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Automatically annotate React components to show their full name in breadcrumbs and session replay
      reactComponentAnnotation: {
        enabled: true,
      },

      // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
      // This can increase your server load as well as your hosting bill.
      // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
      // side errors will fail.
      tunnelRoute: '/monitoring',

      // Hides source maps from generated client bundles
      hideSourceMaps: true,

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,

      // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
      // See the following for more information:
      // https://docs.sentry.io/product/crons/
      // https://vercel.com/docs/cron-jobs
      automaticVercelMonitors: true,
    })
  }

  return plausibleConfig
}

// biome-ignore lint/style/noDefaultExport: config file
export default createNextConfig
