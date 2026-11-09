import { Bytes, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { getEtherFiReads } from './etherfi'

const ETH = 10n ** 18n
const TIMESTAMP = UnixTime.fromDate(new Date('2026-10-01T00:00:00Z'))
const CONTRACTS = {
  type: 'etherfi' as const,
  weETH: ChainSpecificAddress('eth:0x1111111111111111111111111111111111111111'),
  withdrawRequestNft: ChainSpecificAddress(
    'eth:0x2222222222222222222222222222222222222222',
  ),
  redemptionManager: ChainSpecificAddress(
    'eth:0x3333333333333333333333333333333333333333',
  ),
}
const QUEUE = {
  rate: words((105n * ETH) / 100n),
  nextRequest: words(101n),
  lastFinalized: words(90n),
}
// (limit: 4 words, fee split to treasury, exit fee, watermark)
const INFO = words(2_000n, 2_000n, 0n, 1n, 1_000n, 30n, 100n)

describe(getEtherFiReads.name, () => {
  it('reads the queue before the redemption manager, one past the newest request', () => {
    const { toState } = getEtherFiReads(CONTRACTS, 20_000_000)

    expect(toState(QUEUE, TIMESTAMP)).toEqual({
      exchangeRate: (105n * ETH) / 100n,
      lastRequestId: 100,
      lastFinalizedRequestId: 90,
      instantExitEth: null,
      instantExitFeeBps: null,
      lockTime: null,
    })
  })

  it('reads the first version, nothing redeemable while paused', () => {
    const { toState } = getEtherFiReads(CONTRACTS, 23_000_000)
    const open = {
      ...QUEUE,
      redeemable: words(1_000n * ETH),
      exitFee: words(30n),
      paused: words(0n),
    }

    expect(toState(open, TIMESTAMP)).toEqual(
      expect.subset({ instantExitEth: 1_000n * ETH, instantExitFeeBps: 30 }),
    )
    expect(
      toState({ ...open, paused: words(1n) }, TIMESTAMP).instantExitEth,
    ).toEqual(0n)
  })

  it('keeps the low watermark back, and reads the fee from the token info', () => {
    const { toState } = getEtherFiReads(CONTRACTS, 24_000_000)

    // 2,000 ETH redeemable by the rate limit, but only 500 ETH above the
    // watermark.
    const state = toState(
      {
        ...QUEUE,
        redeemable: words(2_000n * ETH),
        liquidity: words(3_500n * ETH),
        watermark: words(3_000n * ETH),
        info: INFO,
        paused: words(0n),
      },
      TIMESTAMP,
    )
    expect(state).toEqual(
      expect.subset({ instantExitEth: 500n * ETH, instantExitFeeBps: 30 }),
    )
  })

  it('counts a timed pause from its version on', () => {
    const { toState } = getEtherFiReads(CONTRACTS, 26_000_000)

    const state = toState(
      {
        ...QUEUE,
        redeemable: words(2_000n * ETH),
        liquidity: words(9_000n * ETH),
        watermark: words(3_000n * ETH),
        info: INFO,
        paused: words(0n),
        pausedUntil: words(BigInt(TIMESTAMP + UnixTime.HOUR)),
      },
      TIMESTAMP,
    )
    expect(state.instantExitEth).toEqual(0n)
  })
})

function words(...values: bigint[]): Bytes {
  return Bytes.fromHex(
    utils.defaultAbiCoder.encode(
      values.map(() => 'uint256'),
      values,
    ),
  )
}
