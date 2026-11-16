import path from 'node:path'
import * as esbuild from 'esbuild'

// In dev mode, .tsx files should be handled by Vite (HMR), not bundled
// by esbuild (which would cause full server restarts on change).
// In production, .tsx files are expected because the server does SSR directly.
const tsxBoundaryPlugin: esbuild.Plugin = {
  name: 'tsx-boundary-check',
  setup(build) {
    build.onLoad({ filter: /\.tsx$/ }, (args) => {
      const relative = path.relative(process.cwd(), args.path)
      // Satori OG image templates are rendered by the server, not Vite
      if (relative.startsWith('src/components/opengraph-image/')) {
        return undefined
      }
      return {
        errors: [
          {
            text: `"${relative}" is a React component (.tsx) and must not be bundled into the server. This will cause full server restarts instead of HMR. Move shared code to a .ts file.`,
          },
        ],
      }
    })
  },
}

// The server bundle is CommonJS and loads packages with require(), but
// @tanstack/charts is ESM-only (its exports have only an `import` condition),
// so it is bundled, with its own dependencies, while every other package
// stays external. Only bundled packages have importers in node_modules.
// React stays external even there: a second copy breaks hooks.
const BUNDLED_PACKAGES = /^@tanstack\/charts(\/|$)/
const SHARED_PACKAGES = /^react(-dom)?(\/|$)/
const externalPackagesPlugin: esbuild.Plugin = {
  name: 'external-packages',
  setup(build) {
    build.onResolve({ filter: /^[^./]/ }, (args) => {
      if (
        args.path.startsWith('~/') ||
        BUNDLED_PACKAGES.test(args.path) ||
        (args.importer.includes('/node_modules/') &&
          !SHARED_PACKAGES.test(args.path))
      ) {
        return undefined
      }
      return { path: args.path, external: true }
    })
  },
}

async function main() {
  const args = process.argv.slice(2)
  const watch = args.includes('--watch')
  const prod = args.includes('--prod')

  const options: esbuild.BuildOptions = {
    entryPoints: [prod ? 'src/index.ts' : 'src/index.dev.ts'],
    bundle: true,
    platform: 'node',
    jsx: 'automatic',
    outfile: 'dist/server/index.js',
    minify: prod,
    plugins: prod
      ? [externalPackagesPlugin]
      : [externalPackagesPlugin, tsxBoundaryPlugin],
    // Lets esbuild drop development-only branches (e.g. dev pages in
    // pageLoaders) instead of bundling code that only works under Vite.
    define: prod ? { 'process.env.NODE_ENV': '"production"' } : {},
  }

  if (watch) {
    const ctx = await esbuild.context(options)
    await ctx.watch()
  } else {
    await esbuild.build(options)
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
