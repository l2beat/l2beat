import { expect } from 'earl'
import { getControls } from './getControls'

describe(getControls.name, () => {
  it('returns the fixed production environment control', () => {
    expect(getControls()).toEqual({
      filters: [{ match_phrase: { environment: 'production' } }],
      descriptions: ['environment: production'],
    })
  })
})
