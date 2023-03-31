import { expect } from 'earl'
import { readFileSync } from 'fs'
import { readdirSync } from 'fs-extra'

import {
  DEFAULT_THUMBNAIL,
  getThumbnail,
  THUMBNAILS_FOLDER,
} from './getThumbnail'

describe('getThumbnail', () => {
  it('returns the default thumbnail if no thumbnail is specified', () => {
    const nugget = {
      title: 'Understand StarkWare #1',
      url: 'https://twitter.com/bkiepuszewski/status/1480473352213041152',
    }
    const result = getThumbnail(nugget)
    expect(result).toEqual('/images/thumbnails/default.jpg')
  })

  it('returns the thumbnail if one is specified', () => {
    const nugget = {
      title: 'Understand StarkWare #1',
      url: 'https://twitter.com/bkiepuszewski/status/1480473352213041152',
      thumbnail: 'starkware-01.jpg',
    }
    const result = getThumbnail(nugget)
    expect(result).toEqual('/images/thumbnails/starkware-01.jpg')
  })

  it('thumbnail folder path resolves to existing folder', () => {
    expect(() => readdirSync('src/static/' + THUMBNAILS_FOLDER)).not.toThrow()
  })

  it('default thumbnail exists', () => {
    expect(() => readFileSync('src/static/' + DEFAULT_THUMBNAIL)).not.toThrow()
  })
})
