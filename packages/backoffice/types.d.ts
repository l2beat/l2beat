/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KIBANA_URL?: string
}

// https://lucide.dev/guide/advanced/aliased-names
declare module 'lucide-react' {
  export * from 'lucide-react/dist/lucide-react.suffixed'
}
