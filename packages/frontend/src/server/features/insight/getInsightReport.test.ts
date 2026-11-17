import type {
  AbstractTokenRecord,
  DeployedTokenRecord,
  TokenRelationRoute,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { NATIVE_TOKEN } from './EthereumHolderRpc'
import {
  type BackingDescriber,
  buildReport,
  type HolderRpc,
} from './getInsightReport'
import type { InsightDataSource, KnownToken } from './InsightDataSource'

// Methodology: a fake RPC and data source with one token per outcome (held
// and priced, held without a price, held with an unreliable price, emptied,
// unreadable, ignored, unknown, in token-db but never touched), so every
// counter and the ordering are checked against tokens whose fate is known.
// The calls made are checked too: only touched tokens are read, and each
// holding is described from its own routes only.
describe(buildReport.name, () => {
  const holder = `0x${'f'.repeat(40)}`
  const now = UnixTime(1_800_000_123)
  const address = (digit: string) => `0x${digit.repeat(40)}`
  const NO_BACKING = {
    mintedAgainst: [],
    burnAndMint: [],
    lockedFor: [],
    unknownRole: [],
  }

  it('values, counts and orders holdings', async () => {
    const tokens: KnownToken[] = [
      known(NATIVE_TOKEN, 'ETH', 18, { coingeckoId: 'ethereum' }),
      known(address('1'), 'USDC', 6, { coingeckoId: 'usd-coin' }),
      known(address('2'), 'NOPRICE', 18, { coingeckoId: null }),
      known(address('3'), 'SHAKY', 18, {
        coingeckoId: 'shaky',
        isPriceUnreliable: true,
      }),
      known(address('4'), 'EMPTY', 18, { coingeckoId: 'empty' }),
      known(address('5'), 'BROKEN', 18, { coingeckoId: 'broken' }),
      known(address('6'), 'SPAM', 18, {}, { ignored: true }),
      // In token-db, but the holder never touched it.
      known(address('8'), 'UNTOUCHED', 18, { coingeckoId: 'untouched' }),
    ]
    const balanceByAddress = new Map<string, bigint | undefined>([
      [NATIVE_TOKEN, 2n * 10n ** 18n],
      [address('1'), 5_000_000n],
      [address('2'), 10n ** 18n],
      [address('3'), 10n ** 18n],
      [address('4'), 0n],
      [address('5'), undefined],
    ])
    const rpc = mockObject<HolderRpc>({
      getHeldTokens: mockFn().resolvesTo(
        // '7' is a candidate token-db does not know; '1' is listed twice.
        ['1', '1', '2', '3', '4', '5', '6', '7'].map(address),
      ),
      getBlockNumber: mockFn().resolvesTo(21_000_000),
      getBalances: mockFn(async (_holder: string, addresses: string[]) =>
        addresses.map((a) => balanceByAddress.get(a)),
      ),
    })
    const usdcRoute = route(address('1'), address('9'))
    const otherRoute = route(address('9'), address('a'))
    const data = mockObject<InsightDataSource>({
      getDeployedTokens: mockFn().resolvesTo(
        new Map(tokens.map((token) => [token.deployedToken.address, token])),
      ),
      getRoutesForTokens: mockFn().resolvesTo([usdcRoute, otherRoute]),
      getPrices: mockFn().resolvesTo(
        new Map([
          ['ethereum', 3000],
          ['usd-coin', 1],
          ['shaky', 1_000_000],
        ]),
      ),
    })
    const describe = mockFn<
      Parameters<BackingDescriber>,
      ReturnType<BackingDescriber>
    >().returns(NO_BACKING)

    const report = await buildReport({ rpc, data, describe }, holder, now)

    expect(report.holdings.map((h) => [h.symbol, h.valueUsd])).toEqual([
      ['ETH', 6000],
      ['USDC', 5],
      ['NOPRICE', null],
      ['SHAKY', null],
    ])
    expect(report.totalValueUsd).toEqual(6005)
    expect(report.blockNumber).toEqual(21_000_000)
    expect(report.priceTimestamp).toEqual(UnixTime.toStartOf(now, 'hour'))
    expect(report.emptyTrackedTokenCount).toEqual(1)
    expect(report.unreadableTokenCount).toEqual(1)
    // '6' is ignored and '7' unknown; ETH is never a candidate.
    expect(report.untrackedTokenCount).toEqual(2)

    const touched = [NATIVE_TOKEN, ...['1', '2', '3', '4', '5'].map(address)]
    expect(rpc.getBalances).toHaveBeenOnlyCalledWith(
      holder,
      touched,
      21_000_000,
    )
    expect(data.getDeployedTokens).toHaveBeenOnlyCalledWith('ethereum')
    // Prices and routes load alongside the balances, so they are asked for
    // every touched known token, emptied and unreadable ones included.
    // Unreliable prices are never asked for.
    expect(data.getPrices).toHaveBeenOnlyCalledWith(
      ['ethereum', 'usd-coin', 'empty', 'broken'],
      UnixTime.toStartOf(now, 'hour'),
    )
    expect(data.getRoutesForTokens).toHaveBeenOnlyCalledWith(
      tokens.slice(0, 6).map((token) => token.deployedToken),
    )
    expect(describe).toHaveBeenCalledTimes(4)
    const routesBySymbol = new Map(
      describe.calls.map((call) => [call.args[0].symbol, call.args[1]]),
    )
    expect(routesBySymbol.get('USDC')).toEqual([usdcRoute])
    expect(routesBySymbol.get('ETH')).toEqual([])
  })

  it('rejects a holder that was not parsed', async () => {
    const rpc = {} as HolderRpc
    const data = {} as InsightDataSource
    await expect(
      buildReport({ rpc, data, describe: () => NO_BACKING }, 'Vitalik', now),
    ).toBeRejectedWith('Holder must be parsed')
  })
})

function known(
  address: string,
  symbol: string,
  decimals: number,
  abstract: Partial<AbstractTokenRecord>,
  deployed: Partial<DeployedTokenRecord> = {},
): KnownToken {
  const deployedToken: DeployedTokenRecord = {
    chain: 'ethereum',
    address,
    symbol,
    decimals,
    abstractTokenId: `${symbol}000000`.slice(0, 6),
    deploymentTimestamp: UnixTime(0),
    comment: null,
    ignored: false,
    metadata: null,
    ...deployed,
  }
  const abstractToken: AbstractTokenRecord = {
    id: deployedToken.abstractTokenId ?? '',
    symbol,
    issuer: null,
    category: null,
    iconUrl: null,
    coingeckoId: null,
    coingeckoListingTimestamp: null,
    additionalCoingeckoEntries: null,
    comment: null,
    reviewed: false,
    isPriceUnreliable: false,
    ...abstract,
  }
  return { deployedToken, abstractToken }
}

function route(addressA: string, addressB: string): TokenRelationRoute {
  return {
    tokenAChain: 'ethereum',
    tokenAAddress: addressA,
    tokenBChain: 'arbitrum',
    tokenBAddress: addressB,
    plugin: 'canonicalbridge',
    bridgeType: 'lockAndMint',
    lockedToken: 'A',
  }
}
