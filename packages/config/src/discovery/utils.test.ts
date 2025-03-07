import { expect } from 'earl'
import { trimTrailingDots } from './utils'

describe(trimTrailingDots.name, () => {
  it('should remove trailing dots', () => {
    const description = 'Some description...'
    const trimmed = trimTrailingDots(description)
    expect(trimmed).toEqual('Some description')
  })

  it('should not remove trailing dots if there are no dots', () => {
    const description = 'Some description'
    const trimmed = trimTrailingDots(description)
    expect(trimmed).toEqual(description)
  })
})
