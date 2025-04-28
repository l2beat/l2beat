import path from 'path'
import { env } from '~/env'
import { getManifest } from '~/utils/Manifest'

export function getProjectIcon(slug: string) {
  return getStaticAsset(`/icons/${slug}.png`)
}

export function getStaticAsset(filePath: string) {
  if (env.REWRITE) {
    const manifest = getManifest(
      env.NODE_ENV === 'production',
      path.join(process.cwd(), 'rewrite'),
    )
    return manifest.getUrl(filePath)
  }

  return filePath
}
