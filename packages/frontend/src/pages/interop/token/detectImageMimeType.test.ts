import { expect } from 'earl'
import { detectImageMimeType } from './detectImageMimeType'

const PNG_HEADER = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
const JPEG_HEADER = [0xff, 0xd8, 0xff, 0xe0]

describe(detectImageMimeType.name, () => {
  it('detects a png', () => {
    const result = detectImageMimeType(Buffer.from([...PNG_HEADER, 0x00, 0x01]))

    expect(result).toEqual('image/png')
  })

  it('detects a jpeg', () => {
    const result = detectImageMimeType(Buffer.from([...JPEG_HEADER, 0x00]))

    expect(result).toEqual('image/jpeg')
  })

  it('rejects a format satori cannot decode', () => {
    const webp = Buffer.from('RIFF____WEBPVP8 ')

    expect(detectImageMimeType(webp)).toEqual(undefined)
  })

  it('rejects a non-image response body', () => {
    const errorPage = Buffer.from('<!DOCTYPE html><title>404</title>')

    expect(detectImageMimeType(errorPage)).toEqual(undefined)
  })

  it('rejects a truncated header', () => {
    const result = detectImageMimeType(Buffer.from(PNG_HEADER.slice(0, 4)))

    expect(result).toEqual(undefined)
  })

  it('rejects an empty body', () => {
    expect(detectImageMimeType(Buffer.alloc(0))).toEqual(undefined)
  })
})
