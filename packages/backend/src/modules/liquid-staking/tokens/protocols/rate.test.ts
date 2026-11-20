import { Bytes, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { getRateReads } from './rate'

const TOKEN = ChainSpecificAddress(
  'eth:0x1111111111111111111111111111111111111111',
)
const PROVIDER = ChainSpecificAddress(
  'eth:0x2222222222222222222222222222222222222222',
)

describe(getRateReads.name, () => {
  it('calls a view without arguments and reports no onchain exit', () => {
    const { calls, toState, token } = getRateReads({
      type: 'rate',
      token: TOKEN,
      symbol: 'xETH',
      rate: {
        address: PROVIDER,
        method: 'function getRate() view returns (uint256)',
      },
    })

    expect(calls.rate).toEqual({
      to: ChainSpecificAddress.address(PROVIDER),
      input: Bytes.fromHex(
        new utils.Interface([
          'function getRate() view returns (uint256)',
        ]).encodeFunctionData('getRate'),
      ),
    })
    expect(token).toEqual(TOKEN)
    expect(
      toState(
        { rate: uint256(1_050_000_000_000_000_000n) },
        UnixTime.fromDate(new Date('2026-11-01T00:00:00Z')),
      ),
    ).toEqual({
      exchangeRate: 1_050_000_000_000_000_000n,
      lastRequestId: null,
      lastFinalizedRequestId: null,
      retiredLastRequestId: null,
      retiredLastFinalizedRequestId: null,
      instantExitEth: null,
      instantExitFeeBps: null,
      lockTime: null,
    })
  })

  it('asks a view that takes an amount for one token', () => {
    const method = 'function convertToAssets(uint256) view returns (uint256)'
    const { calls } = getRateReads({
      type: 'rate',
      token: TOKEN,
      symbol: 'xETH',
      rate: { address: TOKEN, method },
    })

    expect(calls.rate.input).toEqual(
      Bytes.fromHex(
        new utils.Interface([method]).encodeFunctionData('convertToAssets', [
          10n ** 18n,
        ]),
      ),
    )
  })
})

function uint256(value: bigint): Bytes {
  return Bytes.fromHex(utils.defaultAbiCoder.encode(['uint256'], [value]))
}
