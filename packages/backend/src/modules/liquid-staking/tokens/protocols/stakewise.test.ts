import type { MulticallV3Response } from '@l2beat/shared'
import { Bytes, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { getLiquidStakingReads } from '../liquidStakingReads'

const OSETH = ChainSpecificAddress(
  'eth:0x1111111111111111111111111111111111111111',
)
const CONTROLLER = ChainSpecificAddress(
  'eth:0x2222222222222222222222222222222222222222',
)
const REDEEMER = ChainSpecificAddress(
  'eth:0x3333333333333333333333333333333333333333',
)
const PREVIOUS = ChainSpecificAddress(
  'eth:0x4444444444444444444444444444444444444444',
)
const POOL = ChainSpecificAddress(
  'eth:0x5555555555555555555555555555555555555555',
)
const ETH = 10n ** 18n
const TIMESTAMP = UnixTime.fromDate(new Date('2026-11-11T00:00:00Z'))
const RATE = (108n * ETH) / 100n
const FAILED: MulticallV3Response = { success: false, data: Bytes.EMPTY }

describe('getStakeWiseReads', () => {
  const stakewise = {
    contracts: {
      type: 'stakewise' as const,
      osETH: OSETH,
      vaultController: CONTROLLER,
      redeemer: REDEEMER,
      previousRedeemer: PREVIOUS,
    },
    marketQuotes: [{ type: 'fluid' as const, pool: POOL, swap0to1: false }],
  }

  it('reads only the rate before osETH had an exit queue', () => {
    const { calls, toState } = getLiquidStakingReads(stakewise, 25_000_000)
    expect(calls.length).toEqual(2)

    const state = toState([ok(RATE), FAILED], TIMESTAMP)
    expect(state.exchangeRate).toEqual(RATE)
    expect(state.lastRequestId).toEqual(null)
    expect(state.lastFinalizedRequestId).toEqual(null)
  })

  it('counts the first queue in thousandths of an osETH', () => {
    const { calls, toState } = getLiquidStakingReads(stakewise, 26_000_000)
    expect(calls.length).toEqual(5)
    expect(calls[1]?.to).toEqual(ChainSpecificAddress.address(PREVIOUS))

    const state = toState(
      [
        ok(RATE),
        queue((29_227n * ETH) / 1000n, (723_523n * ETH) / 1000n),
        ok(0n),
        ok(0n),
        FAILED,
      ],
      TIMESTAMP,
    )
    expect(state.lastRequestId).toEqual(752_750)
    expect(state.lastFinalizedRequestId).toEqual(723_523)
  })

  it('adds both queues after the swap, so the counters keep growing', () => {
    const { calls, toState } = getLiquidStakingReads(stakewise, 26_400_000)
    expect(calls.length).toEqual(8)
    expect(calls[4]?.to).toEqual(ChainSpecificAddress.address(REDEEMER))

    const state = toState(
      [
        ok(RATE),
        queue(29n * ETH, 723n * ETH),
        ok(0n),
        ok(0n),
        queue(5n * ETH, 10n * ETH),
        ok(0n),
        ok(0n),
        FAILED,
      ],
      TIMESTAMP,
    )
    expect(state.lastRequestId).toEqual(767_000)
    expect(state.lastFinalizedRequestId).toEqual(733_000)
  })

  it('finalizes redeemed and bought shares only at the next checkpoint', () => {
    const { toState } = getLiquidStakingReads(stakewise, 26_400_000)

    const state = toState(
      [
        ok(RATE),
        queue(29n * ETH, 723n * ETH),
        ok(0n),
        ok(0n),
        queue(5n * ETH, 10n * ETH),
        ok(3n * ETH),
        ok(2n * ETH),
        FAILED,
      ],
      TIMESTAMP,
    )
    expect(state.lastRequestId).toEqual(767_000)
    expect(state.lastFinalizedRequestId).toEqual(728_000)
  })
})

function ok(value: bigint): MulticallV3Response {
  return {
    success: true,
    data: Bytes.fromHex(utils.defaultAbiCoder.encode(['uint256'], [value])),
  }
}

function queue(queued: bigint, tickets: bigint): MulticallV3Response {
  return {
    success: true,
    data: Bytes.fromHex(
      utils.defaultAbiCoder.encode(
        ['uint256', 'uint256', 'uint256'],
        [queued, 0n, tickets],
      ),
    ),
  }
}
