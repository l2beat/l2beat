import { expect } from 'earl'
import { getLogger } from './index'

describe(getLogger.name, () => {
  it('returns the same logger on every call', () => {
    expect(getLogger()).toExactlyEqual(getLogger())
  })
})
