import { assert } from '@l2beat/shared-pure'
import crypto from 'crypto'
import { expect } from 'earl'
import { readFileSync, readdirSync } from 'fs'
import path from 'path'
import { getImageDimensions } from '~/utils/project/get-image-params'

describe('tinified logos', () => {
  const icons = readdirSync(path.join(__dirname, `../../public/icons`), {
    withFileTypes: true,
  })
    .filter((x) => x.isFile() && x.name.endsWith('.png'))
    .map((x) => x.name.slice(0, -4))
    .sort()

  describe('every icon has proper dimensions, size and has been tinified ', () => {
    const tinifiedLogos = getTinifiedLogos()

    for (const slug of icons) {
      it(slug, () => {
        const buffer = readFileSync(
          path.join(__dirname, `../../public/icons/${slug}.png`),
        )
        const dimensions = getImageDimensions(buffer)
        assert(dimensions, `No dimensions for ${slug}`)
        const { width, height } = dimensions
        const size = buffer.length
        const hash = crypto.createHash('md5').update(buffer).digest('hex')

        expect(width).toEqual(128)
        expect(height).toEqual(128)
        expect(size).toBeLessThanOrEqual(14796)
        expect(tinifiedLogos[`${slug}.png`]).toEqual(hash)
      })
    }
  })
})

function getTinifiedLogos() {
  const tinifiedLogosFile = path.join(
    __dirname,
    '../../scripts/logos/tinifiedLogos.json',
  )

  const tinifiedLogos = readFileSync(tinifiedLogosFile, 'utf-8')
  return JSON.parse(tinifiedLogos) as Record<string, string>
}
