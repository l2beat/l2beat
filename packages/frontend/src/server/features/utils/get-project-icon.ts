import { env } from '~/env'
import { manifest } from '~/utils/Manifest'

export function getProjectIcon(slug: string) {
  return getStaticAsset(`/icons/${slug}.png`)
}

export function getStaticAsset(filePath: string) {
  if (env.NEXT_PUBLIC_REWRITE) {
    return manifest.getUrl(filePath)
  }

  return filePath
}
