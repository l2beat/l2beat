// Minimal typing for the bundled solc-js (wasm) build, used only as the offline dev backend.
declare module 'solc' {
  export function version(): string
  export function compile(input: string): string
}
