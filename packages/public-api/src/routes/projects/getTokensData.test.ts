import type {
  AmountFormula,
  Project,
  TvsToken,
  TvsTokenAddress,
} from '@l2beat/config'
import type { Database, TokenValueRecord } from '@l2beat/database'
import {
  EthereumAddress,
  ProjectId,
  TokenId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { getTokensData, toTokens } from './getTokensData'

// Why: /v1/project/:projectId/tokens replaces the website's
// /api/scaling/tvs/:slug/breakdown, so each token must carry the same
// numbers and addresses the website's TVS breakdown table shows.
// How: feed toTokens a project config and DB token values built by hand and
// compare the whole output, so a dropped or renamed field fails too.
describe(toTokens.name, () => {
  const TIMESTAMP = UnixTime(1_700_000_000)

  it('maps a token read from one contract to one address with its chain', () => {
    const address = EthereumAddress.random()
    const project = mockProject([mockToken('ETH')], {
      ETH: [{ address, chain: 'ethereum' }],
    })

    const result = toTokens(project, [
      mockValue('ETH', { amount: 2, priceUsd: 3000, valueForProject: 6000 }),
    ])

    expect(result).toEqual([
      {
        tokenId: 'ETH',
        symbol: 'ETH',
        source: 'canonical',
        category: 'ether',
        priceUsd: 3000,
        valueUsd: 6000,
        name: 'ETH name',
        amount: 2,
        addresses: [{ address, chain: 'ethereum' }],
        isGasToken: true,
        isAssociated: false,
        bridgedUsing: null,
        timestamp: TIMESTAMP,
      },
    ])
  })

  // The website shows "Multiple" here; the API lists every contract instead
  // of picking one.
  it('lists every contract of a token summed across several contracts', () => {
    const first = EthereumAddress.random()
    const second = EthereumAddress.random()
    const project = mockProject([mockToken('USDC')], {
      USDC: [
        { address: first, chain: 'base' },
        { address: second, chain: 'base' },
      ],
    })

    const [token] = toTokens(project, [mockValue('USDC')])

    expect(token?.addresses).toEqual([
      { address: first, chain: 'base' },
      { address: second, chain: 'base' },
    ])
    expect(token?.isGasToken).toEqual(false)
  })

  // A token with no synced value has no amount at all. Reporting 0 would
  // claim the project secures none of it, so it is left out, as on the website.
  it('leaves out a token with no synced value instead of reporting 0', () => {
    const project = mockProject([mockToken('ETH'), mockToken('DAI')])

    const result = toTokens(project, [mockValue('ETH')])

    expect(result.map((x) => x.tokenId)).toEqual(['ETH'])
    expect(result[0]?.addresses).toEqual([])
  })

  // Configs write gas tokens as the symbol is spelled (USDe, reETH), so an
  // exact comparison against an upper-cased symbol misses them.
  it('recognizes a gas token whose symbol has mixed case', () => {
    const project = mockProject([mockToken('USDe')])

    const [token] = toTokens(project, [mockValue('USDe')])

    expect(token?.isGasToken).toEqual(true)
  })

  function mockValue(
    tokenId: string,
    values: Partial<TokenValueRecord> = {},
  ): TokenValueRecord {
    return {
      timestamp: TIMESTAMP,
      configurationId: 'config',
      projectId: 'project',
      tokenId,
      amount: 1,
      value: 1,
      valueForProject: 1,
      valueForSummary: 1,
      priceUsd: 1,
      ...values,
    }
  }
})

// Why: the website reads each token at or before the hour the backend syncs
// towards, not at a clock-based hour; reading another hour would show other
// numbers. How: stub that hour and check it is the one queried.
describe(getTokensData.name, () => {
  it('reads token values at the hour the backend syncs TVS towards', async () => {
    const syncedHour = UnixTime(1_700_003_600)
    const getByProjectAtOrBefore = mockFn().resolvesTo([])
    const db = mockObject<Database>({
      syncMetadata: mockObject<Database['syncMetadata']>({
        getMaxTargetForFeature: mockFn().resolvesTo(syncedHour),
      }),
      tvsTokenValue: mockObject<Database['tvsTokenValue']>({
        getByProjectAtOrBefore,
      }),
    })

    await getTokensData(db, mockProject([]))

    expect(getByProjectAtOrBefore).toHaveBeenOnlyCalledWith(
      ProjectId('project'),
      syncedHour,
    )
  })
})

type TokensProject = Project<
  never,
  'tvsConfig' | 'tvsTokenAddresses' | 'chainConfig'
>

// `addresses` is what config builds from the tokens' amount formulas. A token
// without an entry reads no contract.
function mockProject(
  tokens: TvsToken[],
  addresses: Record<string, TvsTokenAddress[]> = {},
): TokensProject {
  return mockObject<TokensProject>({
    id: ProjectId('project'),
    tvsConfig: tokens,
    tvsTokenAddresses: addresses,
    chainConfig: mockObject<NonNullable<Project<'chainConfig'>['chainConfig']>>(
      {
        gasTokens: ['ETH', 'USDe'],
      },
    ),
  })
}

function mockToken(symbol: string): TvsToken {
  return {
    mode: 'auto',
    id: TokenId(symbol),
    priceId: symbol.toLowerCase(),
    symbol,
    name: `${symbol} name`,
    amount: mockObject<AmountFormula>({ type: 'const' }),
    category: symbol === 'ETH' ? 'ether' : 'stablecoin',
    source: 'canonical',
    isAssociated: false,
  }
}
