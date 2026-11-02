import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import type { MulticallV3Response } from '@l2beat/shared'
import { Bytes, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import {
  getLiquidStakingReads,
  type LiquidStakingState,
  MARKET_SALE,
} from './liquidStakingReads'

const A = ChainSpecificAddress('eth:0x1111111111111111111111111111111111111111')
const B = ChainSpecificAddress('eth:0x2222222222222222222222222222222222222222')
const C = ChainSpecificAddress('eth:0x3333333333333333333333333333333333333333')
const ETH = 10n ** 18n
const TIMESTAMP = UnixTime.fromDate(new Date('2026-10-01T00:00:00Z'))
/** Before ether.fi's redemption manager went live. */
const EARLY_BLOCK = 20_000_000
const LATEST_BLOCK = 26_000_000

const NO_EXIT = {
  lastRequestId: null,
  lastFinalizedRequestId: null,
  instantExitEth: null,
  instantExitFeeBps: null,
  lockTime: null,
  marketExitEth: null,
  marketExitValueEth: null,
}

describe(getLiquidStakingReads.name, () => {
  const cases: [
    ProjectLiquidStakingContracts,
    MulticallV3Response[],
    LiquidStakingState,
  ][] = [
    [
      { type: 'lido', stETH: A, withdrawalQueue: B, marketQuotes: [] },
      [ok((12n * ETH) / 10n), ok(100n), ok(90n)],
      {
        ...NO_EXIT,
        exchangeRate: (12n * ETH) / 10n,
        lastRequestId: 100,
        lastFinalizedRequestId: 90,
      },
    ],
    [
      { type: 'rocketpool', rETH: A, marketQuotes: [] },
      [ok((11n * ETH) / 10n), ok(5n * ETH)],
      {
        ...NO_EXIT,
        exchangeRate: (11n * ETH) / 10n,
        instantExitEth: 5n * ETH,
        instantExitFeeBps: 0,
      },
    ],
    [
      // nextRequestId is one past the newest request.
      {
        type: 'etherfi',
        weETH: A,
        withdrawRequestNft: B,
        redemptionManager: C,
        marketQuotes: [],
      },
      [ok((105n * ETH) / 100n), ok(101n), ok(90n)],
      {
        ...NO_EXIT,
        exchangeRate: (105n * ETH) / 100n,
        lastRequestId: 100,
        lastFinalizedRequestId: 90,
      },
    ],
    [
      // Unwrap requests are allocated ETH in order, like a queue.
      { type: 'wbeth', wBETH: A, unwrapToken: B, marketQuotes: [] },
      [ok((107n * ETH) / 100n), ok(3_456_000n), ok(140n), ok(138n)],
      {
        ...NO_EXIT,
        exchangeRate: (107n * ETH) / 100n,
        lockTime: 3_456_000,
        lastRequestId: 139,
        lastFinalizedRequestId: 137,
      },
    ],
  ]

  for (const [contracts, responses, expected] of cases) {
    it(`maps the ${contracts.type} call results`, () => {
      const { reads, toState } = getLiquidStakingReads(contracts, EARLY_BLOCK)
      expect(reads.length).toEqual(responses.length)
      expect(toState(responses, TIMESTAMP)).toEqual(expected)
    })
  }

  it('encodes the Lido rate as the ETH value of one share', () => {
    const [rate] = getLiquidStakingReads(
      { type: 'lido', stETH: A, withdrawalQueue: B, marketQuotes: [] },
      LATEST_BLOCK,
    ).reads
    expect(rate?.call.input.toString()).toEqual(
      new utils.Interface([
        'function getPooledEthByShares(uint256) view returns (uint256)',
      ]).encodeFunctionData('getPooledEthByShares', [ETH]),
    )
  })

  describe('ether.fi instant redemption', () => {
    const etherfi: ProjectLiquidStakingContracts = {
      type: 'etherfi',
      weETH: A,
      withdrawRequestNft: B,
      redemptionManager: C,
      marketQuotes: [],
    }
    const base = [ok(ETH), ok(1n), ok(0n)]

    it('reads the first version, nothing redeemable while paused', () => {
      const { reads, toState } = getLiquidStakingReads(etherfi, 23_000_000)
      expect(reads.length).toEqual(6)

      const open = [...base, ok(1_000n * ETH), ok(30n), ok(0n)]
      expect(toState(open, TIMESTAMP)).toEqual(
        expect.subset({ instantExitEth: 1_000n * ETH, instantExitFeeBps: 30 }),
      )
      const paused = [...base, ok(1_000n * ETH), ok(30n), ok(1n)]
      expect(toState(paused, TIMESTAMP).instantExitEth).toEqual(0n)
    })

    it('keeps the low watermark back, and reads the fee from the token info', () => {
      const { reads, toState } = getLiquidStakingReads(etherfi, 24_000_000)
      expect(reads.length).toEqual(8)

      // 2,000 ETH redeemable by the rate limit, but only 500 ETH above the
      // watermark.
      const responses = [
        ...base,
        ok(2_000n * ETH),
        ok(3_500n * ETH),
        ok(3_000n * ETH),
        words([2_000n, 2_000n, 0n, 1n, 1_000n, 30n, 100n]),
        ok(0n),
      ]
      expect(toState(responses, TIMESTAMP)).toEqual(
        expect.subset({ instantExitEth: 500n * ETH, instantExitFeeBps: 30 }),
      )
    })

    it('counts a timed pause from its version on', () => {
      const { reads, toState } = getLiquidStakingReads(etherfi, LATEST_BLOCK)
      expect(reads.length).toEqual(9)

      const responses = [
        ...base,
        ok(2_000n * ETH),
        ok(9_000n * ETH),
        ok(3_000n * ETH),
        words([2_000n, 2_000n, 0n, 1n, 1_000n, 30n, 100n]),
        ok(0n),
        ok(BigInt(TIMESTAMP + UnixTime.HOUR)),
      ]
      expect(toState(responses, TIMESTAMP).instantExitEth).toEqual(0n)
    })
  })

  describe('market quotes', () => {
    const rocketpool: ProjectLiquidStakingContracts = {
      type: 'rocketpool',
      rETH: A,
      marketQuotes: [
        { type: 'balancerV2', poolId: `0x${'11'.repeat(32)}` },
        { type: 'uniswapV3', fee: 100 },
        { type: 'curve', pool: B, i: 1, j: 0 },
        { type: 'fluid', pool: C, swap0to1: true },
      ],
    }
    const rate = (11n * ETH) / 10n

    it('keeps the best quote, against the sale at the protocol rate', () => {
      const { reads, toState } = getLiquidStakingReads(rocketpool, LATEST_BLOCK)
      expect(reads.slice(2).every((read) => read.optional)).toEqual(true)

      const state = toState(
        [
          ok(rate),
          ok(0n),
          ok(109n * ETH),
          // The quoter returns more words after the amount out.
          words([(10_950n * ETH) / 100n, 1n, 2n, 3n]),
          // A pool that doesn't exist yet returns nothing.
          { success: true, data: Bytes.EMPTY },
          // Fluid reverts with the result.
          {
            success: false,
            data: Bytes.fromHex(
              `0xb3bfda99${utils.defaultAbiCoder.encode(['uint256'], [(10_990n * ETH) / 100n]).slice(2)}`,
            ),
          },
        ],
        TIMESTAMP,
      )
      expect(state.marketExitEth).toEqual((10_990n * ETH) / 100n)
      expect(state.marketExitValueEth).toEqual((MARKET_SALE * rate) / ETH)
    })

    it('stores no quote when no pool gives one', () => {
      const { toState } = getLiquidStakingReads(rocketpool, LATEST_BLOCK)
      const failed = { success: false, data: Bytes.EMPTY }
      const state = toState(
        [ok(rate), ok(0n), failed, failed, failed, failed],
        TIMESTAMP,
      )
      expect(state.marketExitEth).toEqual(null)
      expect(state.marketExitValueEth).toEqual(null)
    })

    it('values Lido’s sale at one ETH per stETH', () => {
      const { toState } = getLiquidStakingReads(
        {
          type: 'lido',
          stETH: A,
          withdrawalQueue: B,
          marketQuotes: [{ type: 'curve', pool: C, i: 1, j: 0 }],
        },
        LATEST_BLOCK,
      )
      const state = toState(
        [ok((12n * ETH) / 10n), ok(1n), ok(1n), ok((9_995n * ETH) / 100n)],
        TIMESTAMP,
      )
      expect(state.marketExitValueEth).toEqual(MARKET_SALE)
    })
  })
})

function ok(value: bigint): MulticallV3Response {
  return words([value])
}

function words(values: bigint[]): MulticallV3Response {
  return {
    success: true,
    data: Bytes.fromHex(
      utils.defaultAbiCoder.encode(
        values.map(() => 'uint256'),
        values,
      ),
    ),
  }
}
