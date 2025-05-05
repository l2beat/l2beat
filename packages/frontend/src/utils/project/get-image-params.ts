import { readFileSync } from 'fs'
import path from 'path'
import imageSize from 'image-size'
import { env } from '~/env'
import { getManifest } from '~/utils/Manifest'

export interface ImageParams {
  width: number
  height: number
  src: string
}

export function getImageParams(filePath: string): ImageParams | undefined {
  if (env.NEXT_PUBLIC_REWRITE) {
    const manifest = getManifest(
      env.NODE_ENV === 'production',
      path.join(process.cwd(), 'rewrite'),
    )
    return manifest.getImage(filePath)
  }
  try {
    const base = path.join(process.cwd(), 'public')
    const imgPath = path.join(base, filePath)
    if (!imgPath.startsWith(base)) {
      throw new Error(`Invalid image path: ${filePath}`)
    }
    const imgBuffer = readFileSync(imgPath)

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
