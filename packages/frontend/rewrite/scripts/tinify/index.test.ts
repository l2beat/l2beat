import { readFileSync } from 'fs'
import path from 'path'
import { assert } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getImageDimensions } from '~/utils/project/get-image-params'
import { getAllStaticPngs } from './utils/getAllStaticPngs'
import { hashPng } from './utils/hashPng'
import { getMetadata } from './utils/metadata'

describe('tinify', () => {
  const pngs = getAllStaticPngs(path.join(process.cwd(), 'rewrite/static'))

  it('got every image tinified', () => {
    const metadata = getMetadata()

    const missing = pngs.filter((png) => {
      const hash = metadata[path.relative(process.cwd(), png)]
      const buffer = readFileSync(png)
      return hash !== hashPng(buffer)
    })

    expect(missing).toEqual([])
  })

  it('made sure every logo has proper dimensions and size', () => {
    const metadata = getMetadata()
    const icons = pngs.filter((p) =>
      p.startsWith(path.join(process.cwd(), 'rewrite/static/icons')),
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
        throw new Error(`${icon} not in metadata, run pnpm rewrite:tinify`)
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
