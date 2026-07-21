import { expect } from 'earl'
import { getSelectedUpdateId } from './getSelectedUpdateId'

describe(getSelectedUpdateId.name, () => {
  it('returns the selected update', () => {
    expect(getSelectedUpdateId({ update: 'update-1700000000' })).toEqual(
      'update-1700000000',
    )
  })

  it('returns undefined when update is not a string', () => {
    expect(getSelectedUpdateId({ update: 123 })).toEqual(undefined)
    expect(getSelectedUpdateId(undefined)).toEqual(undefined)
  })
})
