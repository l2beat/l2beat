export type SupportedMimeType = 'image/png' | 'image/jpeg'

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff])

export function detectImageMimeType(
  data: Buffer,
): SupportedMimeType | undefined {
  if (data.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) return 'image/png'
  if (data.subarray(0, JPEG_MAGIC.length).equals(JPEG_MAGIC))
    return 'image/jpeg'
  return undefined
}
