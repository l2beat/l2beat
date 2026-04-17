// @ts-expect-error
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { getTrpcProxyTarget } from './src/react-query/trpcUrl'

// biome-ignore lint/style/noDefaultExport: Vite requires default export
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/trpc': {
          target: getTrpcProxyTarget(env.TRPC_URL),
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  }
})
