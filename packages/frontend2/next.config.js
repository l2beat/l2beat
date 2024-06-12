import createVercelToolbarPlugin from '@vercel/toolbar/plugins/next'
import { withPlausibleProxy as createPlausibleProxyPlugin } from 'next-plausible'
import './src/env.js'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.coingecko.com'],
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
        source: '/scaling/detailedTvl',
        destination: '/scaling/tvl',
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
          has: [{ type: 'host', value: '.*l2beat-staging.*' }],
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
          has: [{ type: 'host', value: '.*l2beat-staging.*' }],
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
          source: '/api/tvl2/token',
          has: [{ type: 'host', value: '.*l2beat-staging.*' }],
          destination: 'https://staging.l2beat.com/api/tvl2/token',
        },
        {
          source: '/api/tvl2/token',
          destination: 'https://api.l2beat.com/api/tvl2/token',
        },
        {
          source: '/api/tvl2/aggregate',
          has: [{ type: 'host', value: '.*l2beat-staging.*' }],
          destination: 'https://staging.l2beat.com/api/tvl2/aggregate',
        },
        {
          source: '/api/tvl2/aggregate',
          destination: 'https://api.l2beat.com/api/tvl2/aggregate',
        },
        {
          source: '/api/tvl/aggregate',
          has: [{ type: 'host', value: '.*l2beat-staging.*' }],
          destination: 'https://staging.l2beat.com/api/tvl/aggregate',
        },
        {
          source: '/api/tvl/aggregate',
          destination: 'https://api.l2beat.com/api/tvl/aggregate',
        },
        {
          source: '/api/activity/aggregate',
          has: [{ type: 'host', value: '.*l2beat-staging.*' }],
          destination: 'https://staging.l2beat.com/api/activity/aggregate',
        },
        {
          source: '/api/activity/aggregate',
          destination: 'https://api.l2beat.com/api/activity/aggregate',
        },
      ],
      afterFiles: [],
      // TODO: Remove once we fully migrate to Next.js frontend.
      // When doing so, remove trailingSlash: false from root vercel.json.
      fallback: [
        {
          source: '/:path*',
          has: [{ type: 'host', value: '.*localhost.*' }],
          destination: 'http://127.0.0.1:8080/:path*',
        },
        {
          source: '/:path*',
          has: [{ type: 'host', value: '.*staging.*' }],
          destination: 'https://l2beat-staging.vercel.app/:path*',
        },
        {
          source: '/:path*',
          destination: `https://l2beat-production.vercel.app/:path*`,
        },
      ],
    }
  },
  // Webpack config for svgr
  webpack(
    /**
     * This type is *very* incomplete.
     * @type {{
     *   module: {
     *     rules: {
     *       test: RegExp
     *       issuer: unknown,
     *       resourceQuery: RegExp | { not: RegExp[] }
     *       exclude?: RegExp,
     *       use: string[]
     *     }[]
     *   }
     * }}
     */ config,
  ) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )

    if (!fileLoaderRule) {
      throw new Error('Could not find svg fileLoaderRule')
    }

    const existingResourceQueryNot =
      'not' in fileLoaderRule.resourceQuery
        ? fileLoaderRule.resourceQuery.not
        : []

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...existingResourceQueryNot, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
}

function createNextConfig() {
  const plugins = [createPlausibleProxyPlugin(), createVercelToolbarPlugin()]

  return plugins.reduce((config, plugin) => plugin(config), nextConfig)
}

// biome-ignore lint/style/noDefaultExport: config file
export default createNextConfig
