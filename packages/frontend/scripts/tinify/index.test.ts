import { assert } from '@l2beat/shared-pure'
import { readFileSync } from 'fs'
import path from 'path'
import { getImageDimensions } from '~/utils/project/getImageParams'
import { getAllStaticPngs } from './utils/getAllStaticPngs'
import { hashPng } from './utils/hashPng'
import { getTinifiyMetadata } from './utils/tinifyMetadata'

describe('tinify', () => {
  const pngs = getAllStaticPngs(path.join(process.cwd(), 'static'))

  it('got every image tinified', () => {
    const metadata = getTinifiyMetadata()

    const missing = pngs.filter((png) => {
      const hash = metadata[path.relative(process.cwd(), png)]
      const buffer = readFileSync(png)
      return hash !== hashPng(buffer)
    })

    if (missing.length > 0) {
      throw new Error(
        'Not all images were tinified. Run \`pnpm tinify\` to tinify them.',
      )
    }
  })

  it('made sure every logo has proper dimensions and size', () => {
    const metadata = getTinifiyMetadata()
    const icons = pngs.filter((p) =>
      p.startsWith(path.join(process.cwd(), 'static/icons')),
    )

    for (const icon of icons) {
      const buffer = readFileSync(icon)
      const dimensions = getImageDimensions(buffer)
      assert(dimensions, `No dimensions for ${icon}`)
      const { width, height } = dimensions
      const size = buffer.length
      const expectedHash = hashPng(buffer)
      const hash = metadata[path.relative(process.cwd(), icon)]

      if (!hash) {
        throw new Error(`${icon} not in metadata, run pnpm tinify`)
      }

      if (hash !== expectedHash) {
        throw new Error(`${icon} hash mismatch`)
      }

      if (width !== 128) {
        throw new Error(`${icon} must be 128 px wide`)
      }

      if (height !== 128) {
        throw new Error(`${icon} must be 128 px high`)
      }

      if (size > 14796) {
        throw new Error(`${icon} must be less than 14796 bytes`)
      }
    }
  })
})
