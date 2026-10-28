import type { ProjectLiquidStakingConfig } from '@l2beat/config'
import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import {
  decodeUint,
  getLiquidStakingReads,
  type LiquidStakingState,
} from './liquidStakingReads'

const A = ChainSpecificAddress('eth:0x1111111111111111111111111111111111111111')
const B = ChainSpecificAddress('eth:0x2222222222222222222222222222222222222222')

describe(getLiquidStakingReads.name, () => {
  const cases: [ProjectLiquidStakingConfig, bigint[], LiquidStakingState][] = [
    [
      { type: 'lido', stETH: A, withdrawalQueue: B },
      [1_200_000_000_000_000_000n, 100n, 90n],
      {
        exchangeRate: 1_200_000_000_000_000_000n,
        lastRequestId: 100,
        lastFinalizedRequestId: 90,
        instantExitEth: null,
        lockTime: null,
      },
    ],
    [
      { type: 'rocketpool', rETH: A },
      [1_100_000_000_000_000_000n, 5_000_000_000_000_000_000n],
      {
        exchangeRate: 1_100_000_000_000_000_000n,
        lastRequestId: null,
        lastFinalizedRequestId: null,
        instantExitEth: 5_000_000_000_000_000_000n,
        lockTime: null,
      },
    ],
    [
      // nextRequestId is one past the newest request.
      { type: 'etherfi', weETH: A, withdrawRequestNft: B },
      [1_050_000_000_000_000_000n, 101n, 90n],
      {
        exchangeRate: 1_050_000_000_000_000_000n,
        lastRequestId: 100,
        lastFinalizedRequestId: 90,
        instantExitEth: null,
        lockTime: null,
      },
    ],
    [
      { type: 'wbeth', wBETH: A, unwrapToken: B },
      [1_070_000_000_000_000_000n, 3_456_000n],
      {
        exchangeRate: 1_070_000_000_000_000_000n,
        lastRequestId: null,
        lastFinalizedRequestId: null,
        instantExitEth: null,
        lockTime: 3_456_000,
      },
    ],
  ]

  for (const [config, values, expected] of cases) {
    it(`maps the ${config.type} call results`, () => {
      const { calls, toState } = getLiquidStakingReads(config)
      expect(calls.length).toEqual(values.length)

      const results = values.map((value) =>
        decodeUint(
          Bytes.fromHex(utils.defaultAbiCoder.encode(['uint256'], [value])),
        ),
      )
      expect(toState(results)).toEqual(expected)
    })
  }

  it('encodes the Lido rate as the ETH value of one share', () => {
    const [rateCall] = getLiquidStakingReads({
      type: 'lido',
      stETH: A,
      withdrawalQueue: B,
    }).calls
    expect(rateCall?.input.toString()).toEqual(
      new utils.Interface([
        'function getPooledEthByShares(uint256) view returns (uint256)',
      ]).encodeFunctionData('getPooledEthByShares', [10n ** 18n]),
    )
  })
})
