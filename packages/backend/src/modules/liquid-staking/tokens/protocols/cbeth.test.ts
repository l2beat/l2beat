import { Bytes, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { getCbethReads } from './cbeth'

describe(getCbethReads.name, () => {
  it('reads the rate and reports no onchain exit', () => {
    const { calls, toState } = getCbethReads({
      type: 'cbeth',
      cbETH: ChainSpecificAddress(
        'eth:0x1111111111111111111111111111111111111111',
      ),
    })

    expect(Object.keys(calls)).toEqual(['rate'])
    expect(
      toState(
        { rate: uint256(1_143_741_657_481_477_622n) },
        UnixTime.fromDate(new Date('2026-11-01T00:00:00Z')),
      ),
    ).toEqual({
      exchangeRate: 1_143_741_657_481_477_622n,
      lastRequestId: null,
      lastFinalizedRequestId: null,
      instantExitEth: null,
      instantExitFeeBps: null,
      lockTime: null,
    })
  })
})

function uint256(value: bigint): Bytes {
  return Bytes.fromHex(utils.defaultAbiCoder.encode(['uint256'], [value]))
}
