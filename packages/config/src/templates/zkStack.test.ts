import { expect } from 'earl'
import { usesChainAddressForDaTracking } from './zkStack'

describe(usesChainAddressForDaTracking.name, () => {
  it('uses a chain id before v29', () => {
    expect(usesChainAddressForDaTracking([0, 28, 0])).toEqual(false)
  })

  it('uses a chain address in v29', () => {
    expect(usesChainAddressForDaTracking([0, 29, 4])).toEqual(true)
  })

  it('fails closed for an unsupported version', () => {
    expect(() => usesChainAddressForDaTracking([0, 30, 0])).toThrow(
      /Unsupported zkStack protocol version/,
    )
  })
})
