import react from '@vitejs/plugin-react-swc'
import { defineConfig, type Plugin } from 'vite'

// The API runs inside Vite's dev server: one process, `pnpm dev`, and the server has the CLI at hand.
function apiPlugin(): Plugin {
  return {
    name: 'queryable-facts-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next()
        // ssrLoadModule gives us TypeScript and hot reload for the server code too.
        server
          .ssrLoadModule('/server/api.ts')
          .then((mod) =>
            (
              mod as { handleApi: typeof import('./server/api').handleApi }
            ).handleApi(req, res, next),
          )
          .catch((error: unknown) => {
            res.statusCode = 500
            res.setHeader('content-type', 'application/json')
            res.end(
              JSON.stringify({
                error: error instanceof Error ? error.stack : String(error),
              }),
            )
          })
      })
    },
  }
}

// biome-ignore lint/style/noDefaultExport: Vite requires default export
export default defineConfig({
  root: __dirname,
  plugins: [react(), apiPlugin()],
  server: { port: 5178, strictPort: false, open: false },
  build: { outDir: 'dist' },
})
