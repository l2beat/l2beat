import { manifest } from '~/utils/Manifest'

export function getProjectIcon(slug: string) {
  return manifest.getUrl(`/icons/${slug}.png`)
}
