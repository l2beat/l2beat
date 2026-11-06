import { Bytes, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { getWbethReads } from './wbeth'

describe(getWbethReads.name, () => {
  it('takes unwrap requests as a queue, allocated ETH in order', () => {
    const { toState } = getWbethReads({
      type: 'wbeth',
      wBETH: ChainSpecificAddress(
        'eth:0x1111111111111111111111111111111111111111',
      ),
      unwrapToken: ChainSpecificAddress(
        'eth:0x2222222222222222222222222222222222222222',
      ),
    })

    const state = toState(
      {
        rate: uint256(107n),
        lockTime: uint256(3_456_000n),
        nextIndex: uint256(140n),
        startAllocated: uint256(138n),
      },
      UnixTime.fromDate(new Date('2026-10-01T00:00:00Z')),
    )
    expect(state).toEqual(
      expect.subset({
        lockTime: 3_456_000,
        lastRequestId: 139,
        lastFinalizedRequestId: 137,
      }),
    )
  })
})

function uint256(value: bigint): Bytes {
  return Bytes.fromHex(utils.defaultAbiCoder.encode(['uint256'], [value]))
}
