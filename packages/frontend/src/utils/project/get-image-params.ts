import { readFileSync } from 'fs'
import path from 'path'
import imageSize from 'image-size'

export function getImageParams(filePath: string) {
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
