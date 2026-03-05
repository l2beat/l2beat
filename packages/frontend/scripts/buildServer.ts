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

async function main() {
  const args = process.argv.slice(2)
  const watch = args.includes('--watch')
  const prod = args.includes('--prod')

  const options: esbuild.BuildOptions = {
    entryPoints: [prod ? 'src/index.ts' : 'src/index.dev.ts'],
    bundle: true,
    platform: 'node',
    packages: 'external',
    jsx: 'automatic',
    outfile: 'dist/server/index.js',
    minify: prod,
    plugins: prod ? [] : [tsxBoundaryPlugin],
  }

  if (watch) {
    const ctx = await esbuild.context(options)
    await ctx.watch()
  } else {
    await esbuild.build(options)
  }
}

main()
