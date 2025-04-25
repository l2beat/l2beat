import { readFileSync } from 'fs'
import path from 'path'
import imageSize from 'image-size'
import { getManifest } from 'rewrite/src/common/Manifest'
import { env } from '~/env'

const manifest = getManifest(
  env.NODE_ENV === 'production',
  path.join(process.cwd(), 'rewrite'),
)

export interface ImageParams {
  width: number
  height: number
  src: string
}

export function getImageParams(filePath: string): ImageParams | undefined {
  if (env.REWRITE) {
    return manifest.getImage(filePath)
  }
  try {
    const imgBuffer = readFileSync(
      path.join(process.cwd(), './public', filePath),
    )
    const dimensions = getImageDimensions(imgBuffer)
    if (!dimensions) return undefined
    return { ...dimensions, src: filePath }
  } catch {
    return undefined
  }
}

export function getImageDimensions(imgBuffer: Buffer) {
  try {
    const dimensions = imageSize(imgBuffer)
    return { width: dimensions.width, height: dimensions.height }
  } catch {
    return undefined
  }
}
