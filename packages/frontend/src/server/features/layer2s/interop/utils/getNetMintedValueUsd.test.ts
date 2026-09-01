import { expect } from 'earl'
import { getNetMintedValueUsd } from './getNetMintedValueUsd'

describe(getNetMintedValueUsd.name, () => {
  it('returns undefined when both sides are missing', () => {
    expect(
      getNetMintedValueUsd({
        mintedValueUsd: undefined,
        burnedValueUsd: undefined,
      }),
    ).toEqual(undefined)
  })

  it('treats a missing side as zero when the other is present', () => {
    expect(
      getNetMintedValueUsd({ mintedValueUsd: 100, burnedValueUsd: undefined }),
    ).toEqual(100)
    expect(
      getNetMintedValueUsd({ mintedValueUsd: undefined, burnedValueUsd: 40 }),
    ).toEqual(-40)
  })

  it('subtracts when both are present', () => {
    expect(
      getNetMintedValueUsd({ mintedValueUsd: 100, burnedValueUsd: 25 }),
    ).toEqual(75)
  })

  it('allows both sides to be zero', () => {
    expect(
      getNetMintedValueUsd({ mintedValueUsd: 0, burnedValueUsd: 0 }),
    ).toEqual(0)
  })
})
