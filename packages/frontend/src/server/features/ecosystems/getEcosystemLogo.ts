import { existsSync } from 'fs'
import path from 'path'
import { assert } from '@l2beat/shared-pure'
import { getImageParams } from '~/utils/project/getImageParams'

export function getEcosystemLogo(slug: string) {
  const light = getImageParams(`/partners/${slug}/logo.png`)
  assert(light, 'Ecosystem logo not found')
  const hasDark = existsSync(
    path.join(process.cwd(), 'static', `partners/${slug}/logo.dark.png`),
  )
  const dark = hasDark
    ? getImageParams(`/partners/${slug}/logo.dark.png`)
    : undefined
  if (dark?.width !== light.width || dark?.height !== light.height) {
    throw new Error('Ecosystem logo dimensions mismatch')
  }

  return {
    width: light.width,
    height: light.height,
    light: light.src,
    dark: dark?.src,
  }
}
