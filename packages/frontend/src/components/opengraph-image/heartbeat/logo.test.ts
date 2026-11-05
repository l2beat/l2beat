import { readFileSync } from 'node:fs'
import path from 'node:path'
import { expect } from 'earl'
import { isLostOnDark } from './logo'

// Real icons, judged by eye on the OG images' dark ground. The visible ones
// are the near misses: the faintest wordmark (EVEDEX, about 3% white pixels),
// a white letter on black (HashKey), and a saturated blue too dark by
// luminance alone (Arbitrum).

describe(isLostOnDark.name, () => {
  for (const slug of ['forta', 'shape', 'immutablezkevm']) {
    it(`plates ${slug}, which is black on transparency`, () => {
      expect(isLostOnDark(icon(slug))).toEqual(true)
    })
  }

  for (const slug of ['evedex', 'hashkey', 'arbitrum']) {
    it(`leaves ${slug} as it is`, () => {
      expect(isLostOnDark(icon(slug))).toEqual(false)
    })
  }
})

function icon(slug: string) {
  const file = path.join(__dirname, '../../../../static/icons', `${slug}.png`)
  return `data:image/png;base64,${readFileSync(file).toString('base64')}`
}
