import { openPanelPlugin } from '@l2beat/shared-pure'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const EDITOR_PACKAGES = [
  '@codemirror/',
  '@lezer/',
  '@marijn/find-cluster-break',
  '@vscode/l10n',
  'crelt',
  'jsonc-parser',
  'style-mod',
  'vscode-json-languageservice',
  'vscode-languageserver-textdocument',
  'vscode-languageserver-types',
  'vscode-uri',
  'w3c-keyname',
]

function isEditorPackage(id: string): boolean {
  return EDITOR_PACKAGES.some((name) => id.includes(`node_modules/${name}`))
}

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
                  // Editor packages stay out of the groups: a group also
                  // captures what its modules import, like the dynamic import
                  // helper the app shares, which would make them load eagerly.
                  if (isEditorPackage(id)) {
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
