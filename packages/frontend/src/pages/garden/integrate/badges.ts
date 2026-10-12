import type { Manifest } from '~/utils/Manifest'

export type CropsBadgeKind = 'badge' | 'tag' | 'icon'
export type CropsBadgeStyle = 'light' | 'dark' | 'mono-black' | 'mono-white'

export interface CropsBadgeAsset {
  kind: CropsBadgeKind
  style: CropsBadgeStyle
  /** Hashed static URL, for the preview, the download and the copied markup. */
  url: string
  fileName: string
}

const KINDS: CropsBadgeKind[] = ['badge', 'tag', 'icon']
const STYLES: CropsBadgeStyle[] = ['light', 'dark', 'mono-black', 'mono-white']

/** The SVGs in `static/images/garden/badges`, exported from the CROPS Badges Figma file. */
export function getCropsBadgeAssets(manifest: Manifest): CropsBadgeAsset[] {
  return KINDS.flatMap((kind) =>
    STYLES.map((style) => {
      const fileName = `crops-${kind}-${style}.svg`
      return {
        kind,
        style,
        url: manifest.getUrl(`/images/garden/badges/${fileName}`),
        fileName,
      }
    }),
  )
}
