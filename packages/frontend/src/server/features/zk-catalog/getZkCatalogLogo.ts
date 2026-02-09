import { assert } from '@l2beat/shared-pure'
import { existsSync } from 'fs'
import path from 'path'
import { getImageParams } from '~/utils/project/getImageParams'

export function getZkCatalogLogo(slug: string) {
  const light = getImageParams(`/icons/${slug}.png`)
  assert(light, 'ZK catalog logo not found')

  const hasDark = existsSync(
    path.join(process.cwd(), 'static', `icons/${slug}.dark.png`),
  )
  const dark = hasDark ? getImageParams(`/icons/${slug}.dark.png`) : undefined

  if (dark?.width !== light.width || dark?.height !== light.height) {
    throw new Error('ZK catalog logo dimensions mismatch')
  }

  return {
    light: light.src,
    dark: dark?.src,
  }
}
