import { expect } from 'earl'
import { getMissingTokenAction } from './utils'

describe(getMissingTokenAction.name, () => {
  it('does not offer manual addition after ingestion confirms no CoinGecko listing', () => {
    const action = getMissingTokenAction({
      chain: 'ethereum',
      address: '0x0000000000000000000000000000000000000001',
      tokenDbStatus: 'missing',
      ingestionStatus: 'no-coingecko',
    })

    expect(action).toEqual(undefined)
  })
})
