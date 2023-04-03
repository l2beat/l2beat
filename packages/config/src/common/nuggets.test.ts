import { expect } from 'earl'
import { readdirSync } from 'fs'

import { NUGGETS } from './nuggets'

const THUMBNAILS_FOLDER = '../frontend/src/static/images/thumbnails/'

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
