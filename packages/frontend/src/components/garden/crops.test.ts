import { expect } from 'earl'
import { CROP_COLUMNS, type CropKey } from './crops'

describe('CROP_COLUMNS', () => {
  it('names every crop once, checked against a record the type system keeps complete', () => {
    const every: Record<CropKey, null> = {
      censorshipResistance: null,
      openSource: null,
      privacy: null,
      security: null,
    }
    expect(CROP_COLUMNS.map((x) => x.key as string).sort()).toEqual(
      Object.keys(every).sort(),
    )
  })
})
