import { openPanelPlugin } from '@l2beat/shared-pure'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
// biome-ignore lint/style/noDefaultExport: Vite requires default export
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
  return {
    plugins: [
      react(),
      tailwindcss(),
      openPanelPlugin(env.VITE_OPENPANEL_CLIENT_ID),
    ],
    build: {
      outDir: 'build',
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name(id) {
                  // Monaco stays out of the groups: a group also captures
                  // what its modules import, like the dynamic import helper
                  // the app shares, which would make Monaco load eagerly.
                  if (id.includes('node_modules/monaco-editor')) {
                    return null
                  }
                  if (id.includes('node_modules')) {
                    return 'vendor'
                  }
                  return null
                },
              },
            ],
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:2021/',
          changeOrigin: true,
          timeout: 99999999,
        },
      },
    },
  }
})
