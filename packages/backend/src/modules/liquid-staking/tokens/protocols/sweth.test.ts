import { Bytes, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { getSwethReads } from './sweth'

describe(getSwethReads.name, () => {
  const contracts = {
    type: 'sweth' as const,
    swETH: ChainSpecificAddress(
      'eth:0x1111111111111111111111111111111111111111',
    ),
    exitQueue: ChainSpecificAddress(
      'eth:0x2222222222222222222222222222222222222222',
    ),
  }
  const timestamp = UnixTime.fromDate(new Date('2026-11-01T00:00:00Z'))

  it('takes exit requests as a queue, processed in order', () => {
    const { toState } = getSwethReads(contracts, 26_000_000)

    const state = toState(
      {
        rate: uint256(1_134_926_259_436_975_958n),
        created: uint256(32_925n),
        processed: uint256(32_907n),
      },
      timestamp,
    )
    expect(state).toEqual(
      expect.subset({
        exchangeRate: 1_134_926_259_436_975_958n,
        lastRequestId: 32_925,
        lastFinalizedRequestId: 32_907,
        instantExitEth: null,
      }),
    )
  })

  it('reads only the rate before the exit queue was deployed', () => {
    const { calls, toState } = getSwethReads(contracts, 19_000_000)

    expect(Object.keys(calls)).toEqual(['rate'])
    expect(toState({ rate: uint256(107n) }, timestamp)).toEqual(
      expect.subset({
        exchangeRate: 107n,
        lastRequestId: null,
        lastFinalizedRequestId: null,
      }),
    )
  })
})

function uint256(value: bigint): Bytes {
  return Bytes.fromHex(utils.defaultAbiCoder.encode(['uint256'], [value]))
}
