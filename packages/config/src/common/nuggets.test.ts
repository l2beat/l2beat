import { readdirSync } from 'fs'
import { expect } from 'earl'

import { NUGGETS } from './nuggets'

const THUMBNAILS_FOLDER = '../frontend/public/images/thumbnails/'

describe('common/nuggets', () => {
  const thumbnails = Object.values(NUGGETS.THUMBNAILS)
  const files = readdirSync(THUMBNAILS_FOLDER)

  describe('thumbnail file exists', () => {
    thumbnails.forEach((thumbnail) => {
      it(thumbnail, () => {
        expect(files).toInclude(thumbnail)
      })
    })
  })
})
