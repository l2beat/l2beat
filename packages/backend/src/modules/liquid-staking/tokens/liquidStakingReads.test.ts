import type { MulticallV3Response } from '@l2beat/shared'
import { Bytes, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { getLiquidStakingReads } from './liquidStakingReads'
import { MARKET_SALE } from './marketQuotes'

const A = ChainSpecificAddress('eth:0x1111111111111111111111111111111111111111')
const B = ChainSpecificAddress('eth:0x2222222222222222222222222222222222222222')
const ETH = 10n ** 18n
const TIMESTAMP = UnixTime.fromDate(new Date('2026-10-01T00:00:00Z'))
const RATE = (11n * ETH) / 10n
const FAILED: MulticallV3Response = { success: false, data: Bytes.EMPTY }

describe(getLiquidStakingReads.name, () => {
  const rocketpool = {
    contracts: { type: 'rocketpool' as const, rETH: A },
    marketQuotes: [
      { type: 'uniswapV3' as const, fee: 100 },
      { type: 'curve' as const, pool: B, i: 1, j: 0 },
    ],
  }

  it('keeps the best quote, against the sale at the protocol rate', () => {
    const { calls, toState } = getLiquidStakingReads(rocketpool, 0)
    expect(calls.length).toEqual(4)

    const state = toState(
      [ok(RATE), ok(0n), ok(109n * ETH), ok(110n * ETH)],
      TIMESTAMP,
    )
    expect(state.marketExitEth).toEqual(110n * ETH)
    expect(state.marketExitValueEth).toEqual((MARKET_SALE * RATE) / ETH)
  })

  it('stores no quote when no pool gives one', () => {
    const { toState } = getLiquidStakingReads(rocketpool, 0)

    const state = toState([ok(RATE), ok(0n), FAILED, FAILED], TIMESTAMP)
    expect(state.marketExitEth).toEqual(null)
    expect(state.marketExitValueEth).toEqual(null)
  })

  it('values Lido’s sale at one ETH per stETH', () => {
    const { toState } = getLiquidStakingReads(
      {
        contracts: { type: 'lido', stETH: A, withdrawalQueue: B },
        marketQuotes: [{ type: 'curve', pool: B, i: 1, j: 0 }],
      },
      0,
    )

    const state = toState(
      [ok((12n * ETH) / 10n), ok(1n), ok(1n), ok((9_995n * ETH) / 100n)],
      TIMESTAMP,
    )
    expect(state.marketExitValueEth).toEqual(MARKET_SALE)
  })

  for (const [name, failed] of [
    ['reverts', FAILED],
    // The multicall reports a call to an address without code as a success.
    ['hits an address without code', { success: true, data: Bytes.EMPTY }],
  ] as const) {
    it(`throws when a protocol read ${name}`, () => {
      const { toState } = getLiquidStakingReads(rocketpool, 0)

      expect(() =>
        toState([ok(RATE), failed, ok(1n), ok(1n)], TIMESTAMP),
      ).toThrow('Liquid staking call reverted')
    })
  }
})

function ok(value: bigint): MulticallV3Response {
  return {
    success: true,
    data: Bytes.fromHex(utils.defaultAbiCoder.encode(['uint256'], [value])),
  }
}
