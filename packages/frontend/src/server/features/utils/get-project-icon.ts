import path from 'path'
import { getManifest } from 'rewrite/src/common/Manifest'
import { env } from '~/env'

const manifest = getManifest(
  env.NODE_ENV === 'production',
  path.join(process.cwd(), 'rewrite'),
)
export function getProjectIcon(slug: string) {
  return getStaticAsset(`/icons/${slug}.png`)
}

export function getStaticAsset(path: string) {
  if (env.REWRITE) {
    return manifest.getUrl(path)
  }

  return path
}
