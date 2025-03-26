export type Manifest = Record<string, string>

let manifest: Manifest | undefined

export function initManifest(value: Manifest) {
  manifest = value
}

export function staticUrl(url: string) {
  return manifest?.[url] ?? url
}
