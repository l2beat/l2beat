/// <reference types="vite/client" />

// biome-ignore lint/correctness/noUnusedVariables: Vite needs this
interface ImportMeta {
  readonly env: {
    readonly VITE_TOKEN_BACKEND_READONLY_AUTH_TOKEN?: string
  }
}
