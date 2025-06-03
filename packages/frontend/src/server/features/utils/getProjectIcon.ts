import { manifest } from '~/utils/Manifest'

export function getProjectIcon(slug: string) {
  return getStaticAsset(`/icons/${slug}.png`)
}

export function getStaticAsset(filePath: string) {
  return manifest.getUrl(filePath)
}
