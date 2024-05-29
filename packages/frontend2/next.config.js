import createNextIntlPlugin from 'next-intl/plugin'
import { withPlausibleProxy as createPlausibleProxyPlugin } from 'next-plausible'
import { env } from './src/env.js'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // biome-ignore lint/suspicious/useAwait: rewrites must be async
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
}

function createNextConfig() {
  const plugins = [
    createPlausibleProxyPlugin(),
    createNextIntlPlugin('./src/i18n.tsx'),
  ]

  return plugins.reduce((config, plugin) => plugin(config), nextConfig)
}

// biome-ignore lint/style/noDefaultExport: config file
export default createNextConfig
