import { expect } from 'earl'
import { deriveMarketAddress } from './fetchMorphoData'

describe(deriveMarketAddress.name, () => {
  const id =
    '0x08e15c7f520c931cd414fa00d2b8611ce94fdee93272126dac46baf0f4082a67'

  it('derives a deterministic eth ChainSpecificAddress for a market id', () => {
    // Golden value: must stay stable so previously derived synthetic market
    // node addresses keep resolving across re-fetches.
    expect(deriveMarketAddress(id)).toEqual(
      'eth:0xc0Db600b82cEbdD38D03702b809959BD814aa2E7',
    )
  })

  it('is a pure function of the id', () => {
    expect(deriveMarketAddress(id)).toEqual(deriveMarketAddress(id))
  })

  it('maps different ids to different addresses', () => {
    const other =
      '0xc9633699b614a492cf4f36de2ae7a2d26673d86c0573749fd3fde927b15294bf'
    expect(deriveMarketAddress(id)).not.toEqual(deriveMarketAddress(other))
  })
})
