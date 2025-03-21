import { readFileSync } from 'fs'
import path from 'path'

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
    const width = imgBuffer.readUInt32BE(16)
    const height = imgBuffer.readUInt32BE(20)
    return { width, height }
  } catch {
    return undefined
  }
}
