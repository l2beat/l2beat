import { CROP_KEYS } from '@l2beat/config'
import { expect } from 'earl'
import { CROP_COLUMNS } from './crops'

describe('CROP_COLUMNS', () => {
  it('names every crop once, in the order config serves them, checked key by key', () => {
    expect(CROP_COLUMNS.map((x) => x.key)).toEqual([...CROP_KEYS])
  })
})
