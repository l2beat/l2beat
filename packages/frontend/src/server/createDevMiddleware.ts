import type express from 'express'
import type { ViteDevServer } from 'vite'

export async function createDevMiddleware(
  app: express.Express,
): Promise<ViteDevServer> {
  const { createServer } = await import('vite')
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })
  app.use(vite.middlewares)
  return vite
}
