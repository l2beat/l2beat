import path from 'path'
import { getManifest } from 'rewrite/src/common/Manifest'
import { env } from '~/env'

const manifest = getManifest(
  env.NODE_ENV === 'production',
  path.join(process.cwd(), 'rewrite'),
)
export function getProjectIcon(slug: string) {
  if (env.REWRITE) {
    const image = manifest.getUrl(`/icons/${slug}.png`)
    return image
  }

  return `/icons/${slug}.png`
}
