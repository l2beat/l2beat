import { NUGGETS } from '@l2beat/config'
import { expect } from 'earljs'
import { readdirSync } from 'fs-extra'

import { getThumbnail, THUMBNAILS_FOLDER } from './getThumbnail'

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

  it('thumbnail paths resolve to existing files', () => {
    const thumbnail = Object.values(NUGGETS.THUMBNAILS)
    const files = readdirSync('src/static/' + THUMBNAILS_FOLDER)

    thumbnail.forEach((thumbnail) => {
      expect(files).toBeAnArrayWith(thumbnail)
    })
  })
})
