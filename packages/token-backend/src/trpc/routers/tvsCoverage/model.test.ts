import type { TvsToken } from '@l2beat/config'
import type {
  AbstractTokenRecord,
  DeployedTokenRecord,
  InteropDeploymentStatsRecord,
  TokenRelationRoute,
} from '@l2beat/database'
import { EthereumAddress, TokenId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  aggregateInteropDeploymentStats,
  attachInteropRoles,
  buildCoverage,
  type CoverageRow,
  collectAmountDeployments,
  collectProjectTvsDeployments,
  type InteropDeployment,
  normalizeTokenAddress,
  type TvsProjectInput,
} from './model'

describe(normalizeTokenAddress.name, () => {
  it('crops Address32-padded EVM addresses and keeps native', () => {
    expect(
      normalizeTokenAddress(
        'base',
        '0x000000000000000000000000A0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      ),
    ).toEqual('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
    expect(normalizeTokenAddress('base', 'NATIVE')).toEqual('native')
  })

  it('preserves full-width non-EVM token addresses', () => {
    const starknetAddress =
      '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    const solanaAddress = 'AbCdEfGhijkLmnoPqrstUvwxyz123456789'

    expect(normalizeTokenAddress('starknet', starknetAddress)).toEqual(
      starknetAddress,
    )
    expect(normalizeTokenAddress('solana', solanaAddress)).toEqual(
      solanaAddress,
    )
  })
})

describe(collectAmountDeployments.name, () => {
  it('collects token deployments, including native, but not escrow holders', () => {
    const result = collectAmountDeployments({
      type: 'calculation',
      operator: 'sum',
      arguments: [
        {
          type: 'balanceOfEscrow',
          chain: 'ethereum',
          address: EthereumAddress(
            '0x1111111111111111111111111111111111111111',
          ),
          escrowAddress: EthereumAddress(
            '0x2222222222222222222222222222222222222222',
          ),
          decimals: 18,
          sinceTimestamp: UnixTime(1),
        },
        {
          type: 'balanceOfEscrow',
          chain: 'base',
          address: 'native',
          escrowAddress: EthereumAddress(
            '0x3333333333333333333333333333333333333333',
          ),
          decimals: 18,
          sinceTimestamp: UnixTime(1),
        },
        {
          type: 'const',
          value: '1',
          decimals: 0,
          sinceTimestamp: UnixTime(1),
        },
      ],
    })

    expect(result).toEqual([
      {
        chain: 'ethereum',
        address: EthereumAddress('0x1111111111111111111111111111111111111111'),
      },
      { chain: 'base', address: 'native' },
    ])
  })

  it('keeps only active formulas and requires both sides of a diff', () => {
    const active = {
      type: 'totalSupply' as const,
      chain: 'base',
      address: EthereumAddress('0x1111111111111111111111111111111111111111'),
      decimals: 18,
      sinceTimestamp: UnixTime(100),
      untilTimestamp: UnixTime(300),
    }
    const expired = {
      ...active,
      address: EthereumAddress('0x2222222222222222222222222222222222222222'),
      untilTimestamp: UnixTime(200),
    }
    const future = {
      ...active,
      address: EthereumAddress('0x3333333333333333333333333333333333333333'),
      sinceTimestamp: UnixTime(200),
    }

    expect(
      collectAmountDeployments(
        {
          type: 'calculation',
          operator: 'sum',
          arguments: [active, expired, future],
        },
        UnixTime(200),
      ),
    ).toEqual([{ chain: 'base', address: active.address }])
    expect(
      collectAmountDeployments(
        {
          type: 'calculation',
          operator: 'diff',
          arguments: [active, expired],
        },
        UnixTime(200),
      ),
    ).toEqual([])
  })
})

describe(collectProjectTvsDeployments.name, () => {
  it('keeps project scope and removes duplicate formula deployments', () => {
    const tokenAddress = EthereumAddress(
      '0x1111111111111111111111111111111111111111',
    )
    const projects = [
      project('arbitrum', [
        token('first', {
          type: 'totalSupply',
          chain: 'arbitrum',
          address: tokenAddress,
          decimals: 18,
          sinceTimestamp: UnixTime(1),
        }),
        token('second', {
          type: 'totalSupply',
          chain: 'arbitrum',
          address: tokenAddress,
          decimals: 18,
          sinceTimestamp: UnixTime(1),
        }),
      ]),
      project('an-arbitrum-l3', [
        token('escrowed', {
          type: 'balanceOfEscrow',
          chain: 'arbitrum',
          address: tokenAddress,
          escrowAddress: EthereumAddress(
            '0x2222222222222222222222222222222222222222',
          ),
          decimals: 18,
          sinceTimestamp: UnixTime(1),
        }),
      ]),
    ]

    expect(collectProjectTvsDeployments(projects)).toEqual([
      {
        projectChain: 'arbitrum',
        tokenChain: 'arbitrum',
        address: tokenAddress,
      },
      {
        projectChain: 'an-arbitrum-l3',
        tokenChain: 'arbitrum',
        address: tokenAddress,
      },
    ])
  })
})

describe(aggregateInteropDeploymentStats.name, () => {
  it('merges normalized deployment groups and resolves TokenDB identity', () => {
    const address = EthereumAddress(
      '0x1111111111111111111111111111111111111111',
    )
    const padded = `0x${'0'.repeat(24)}${address.slice(2)}`
    const stats: InteropDeploymentStatsRecord[] = [
      deploymentStats({
        address,
        plugin: 'one',
        volumeUsd: 100,
        transferCount: 2,
        valuedTransferCount: 2,
      }),
      deploymentStats({
        address: padded,
        plugin: 'two',
        volumeUsd: 50,
        transferCount: 3,
        valuedTransferCount: 1,
      }),
    ]

    const result = aggregateInteropDeploymentStats(
      stats,
      [deployed('ethereum', address, 'TOKEN1', 'TKN')],
      [abstract('TOKEN1', 'TKN')],
    )

    expect(result).toHaveLength(1)
    expect(result[0]?.abstractTokenId).toEqual('TOKEN1')
    expect(result[0]?.symbol).toEqual('TKN')
    expect(result[0]?.volumeUsd).toEqual(150)
    expect(result[0]?.transferCount).toEqual(5)
    expect(result[0]?.unvaluedTransferCount).toEqual(2)
    expect(result[0]?.plugins).toEqual(['one', 'two'])
  })

  it('does not merge full-width Starknet addresses with the same suffix', () => {
    const suffix = 'a'.repeat(40)
    const first = `0x${'1'.repeat(24)}${suffix}`
    const second = `0x${'2'.repeat(24)}${suffix}`
    const stats = [
      deploymentStats({ chain: 'starknet', address: first }),
      deploymentStats({ chain: 'starknet', address: second }),
    ]

    const result = aggregateInteropDeploymentStats(stats, [], [])

    expect(result.map((row) => row.address)).toEqualUnsorted([first, second])
  })
})

describe(buildCoverage.name, () => {
  it('includes exact deployments and other deployments of the same asset', () => {
    const l1Address = EthereumAddress(
      '0x1111111111111111111111111111111111111111',
    )
    const exactAddress = EthereumAddress(
      '0x2222222222222222222222222222222222222222',
    )
    const sameAssetAddress = EthereumAddress(
      '0x3333333333333333333333333333333333333333',
    )
    const missingAddress = EthereumAddress(
      '0x4444444444444444444444444444444444444444',
    )
    const unknownAddress = EthereumAddress(
      '0x5555555555555555555555555555555555555555',
    )
    const projects: TvsProjectInput[] = [
      project('chain-exact', [
        token('exact-TKN', {
          type: 'totalSupply',
          chain: 'chain-exact',
          address: exactAddress,
          decimals: 18,
          sinceTimestamp: UnixTime(1),
        }),
      ]),
      project('chain-same', [
        token('canonical-TKN', {
          type: 'balanceOfEscrow',
          chain: 'ethereum',
          address: l1Address,
          escrowAddress: EthereumAddress(
            '0x6666666666666666666666666666666666666666',
          ),
          decimals: 18,
          sinceTimestamp: UnixTime(1),
        }),
      ]),
      project('chain-missing', []),
      project('chain-unknown', []),
      project('chain-no-config', undefined),
    ]
    const deployedTokens = [
      deployed('ethereum', l1Address, 'TOKEN1', 'TKN'),
      deployed('chain-exact', exactAddress, 'TOKEN1', 'TKN'),
      deployed('chain-same', sameAssetAddress, 'TOKEN1', 'TKN'),
      deployed('chain-missing', missingAddress, 'TOKEN1', 'TKN'),
      deployed('chain-unknown', unknownAddress, null, '???'),
    ]
    const deployments: InteropDeployment[] = [
      interopDeployment('chain-exact', exactAddress, 'TOKEN1'),
      interopDeployment('chain-same', sameAssetAddress, 'TOKEN1'),
      interopDeployment('chain-missing', missingAddress, 'TOKEN1'),
      interopDeployment('chain-unknown', unknownAddress, undefined),
      interopDeployment('chain-no-config', exactAddress, 'TOKEN1'),
    ]

    const result = buildCoverage(deployments, projects, deployedTokens)

    expect(
      Object.fromEntries(result.map((row) => [row.chain, row.included])),
    ).toEqual({
      'chain-exact': true,
      'chain-same': true,
      'chain-missing': false,
      'chain-unknown': false,
    })
    expect(result.some((row) => row.chain === 'chain-no-config')).toEqual(false)
  })

  it('does not count inactive TVS formulas as coverage', () => {
    const tokenAddress = EthereumAddress(
      '0x1111111111111111111111111111111111111111',
    )
    const projects = [
      project('base', [
        token('expired-TKN', {
          type: 'totalSupply',
          chain: 'base',
          address: tokenAddress,
          decimals: 18,
          sinceTimestamp: UnixTime(1),
          untilTimestamp: UnixTime(100),
        }),
      ]),
    ]
    const deployedTokens = [deployed('base', tokenAddress, 'TOKEN1', 'TKN')]
    const deployments = [interopDeployment('base', tokenAddress, 'TOKEN1')]

    const result = buildCoverage(
      deployments,
      projects,
      deployedTokens,
      UnixTime(200),
    )

    expect(result[0]?.included).toEqual(false)
    expect(collectProjectTvsDeployments(projects, UnixTime(200))).toEqual([])
  })
})

describe(attachInteropRoles.name, () => {
  it('derives factual roles from token relations', () => {
    const base = address(1)
    const polygon = address(2)
    const other = address(3)
    const unresolved = address(4)
    const nonMinting = address(5)
    const both = address(6)
    const rows = [
      coverageRow('base', base, ['layerzero-v2-ofts', 'cctp-v2']),
      coverageRow('polygonpos', polygon, ['layerzero-v2-ofts']),
      coverageRow('other', other, ['cctp-v2']),
      coverageRow('unknown', unresolved, ['layerzero-v2-ofts']),
      coverageRow('intent', nonMinting, ['across']),
      coverageRow('both', both, ['layerzero-v2-ofts']),
    ]
    const relations: TokenRelationRoute[] = [
      {
        tokenAChain: 'base',
        tokenAAddress: base,
        tokenBChain: 'polygonpos',
        tokenBAddress: polygon,
        plugin: 'layerzero-v2-ofts',
        bridgeType: 'lockAndMint',
        lockedToken: 'B',
      },
      {
        tokenAChain: 'base',
        tokenAAddress: base,
        tokenBChain: 'other',
        tokenBAddress: other,
        plugin: 'cctp-v2',
        bridgeType: 'burnAndMint',
        lockedToken: null,
      },
      {
        tokenAChain: 'unknown',
        tokenAAddress: unresolved,
        tokenBChain: 'other',
        tokenBAddress: other,
        plugin: 'layerzero-v2-ofts',
        bridgeType: 'lockAndMint',
        lockedToken: null,
      },
      {
        tokenAChain: 'intent',
        tokenAAddress: nonMinting,
        tokenBChain: 'other',
        tokenBAddress: other,
        plugin: 'across',
        bridgeType: 'nonMinting',
        lockedToken: null,
      },
      {
        tokenAChain: 'both',
        tokenAAddress: both,
        tokenBChain: 'locked-peer',
        tokenBAddress: address(7),
        plugin: 'layerzero-v2-ofts',
        bridgeType: 'lockAndMint',
        lockedToken: 'B',
      },
      {
        tokenAChain: 'both',
        tokenAAddress: both,
        tokenBChain: 'minted-peer',
        tokenBAddress: address(8),
        plugin: 'layerzero-v2-ofts',
        bridgeType: 'lockAndMint',
        lockedToken: 'A',
      },
    ]

    const result = attachInteropRoles(rows, relations)

    expect(
      Object.fromEntries(
        result.map((row) => [
          row.chain,
          { role: row.role, roles: row.pluginRoles },
        ]),
      ),
    ).toEqual({
      base: {
        role: 'minted',
        roles: [
          { plugin: 'layerzero-v2-ofts', roles: ['minted'] },
          { plugin: 'cctp-v2', roles: ['burnAndMint'] },
        ],
      },
      polygonpos: {
        role: 'locked',
        roles: [{ plugin: 'layerzero-v2-ofts', roles: ['locked'] }],
      },
      other: {
        role: 'burnAndMint',
        roles: [{ plugin: 'cctp-v2', roles: ['burnAndMint'] }],
      },
      unknown: {
        role: 'unknown',
        roles: [{ plugin: 'layerzero-v2-ofts', roles: ['unknown'] }],
      },
      intent: { role: undefined, roles: [] },
      both: {
        role: 'both',
        roles: [
          {
            plugin: 'layerzero-v2-ofts',
            roles: ['locked', 'minted'],
          },
        ],
      },
    })
  })
})

function abstract(id: string, symbol: string): AbstractTokenRecord {
  return {
    id,
    symbol,
    coingeckoId: null,
    issuer: null,
    category: 'other',
    iconUrl: null,
    coingeckoListingTimestamp: null,
    additionalCoingeckoEntries: null,
    comment: null,
    reviewed: true,
    isPriceUnreliable: false,
  }
}

function deployed(
  chain: string,
  address: string,
  abstractTokenId: string | null,
  symbol: string,
): DeployedTokenRecord {
  return {
    chain,
    address,
    abstractTokenId,
    symbol,
    decimals: 18,
    deploymentTimestamp: UnixTime(1),
    comment: null,
    metadata: null,
    ignored: false,
  }
}

function project(
  chain: string,
  tokens: TvsProjectInput['tokens'],
): TvsProjectInput {
  return { chain, projectName: chain, tokens }
}

function token(id: string, amount: TvsToken['amount']): TvsToken {
  return {
    mode: 'custom',
    id: TokenId(id),
    symbol: 'TKN',
    name: 'Token',
    priceId: 'token',
    amount,
    category: 'other',
    source: 'native',
    isAssociated: false,
  }
}

function interopDeployment(
  chain: string,
  address: string,
  abstractTokenId: string | undefined,
): InteropDeployment {
  return {
    chain,
    address,
    abstractTokenId,
    abstractSymbol: abstractTokenId ? 'TKN' : undefined,
    symbol: abstractTokenId ? 'TKN' : undefined,
    ignored: false,
    volumeUsd: 100,
    transferCount: 1,
    unvaluedTransferCount: 0,
    plugins: ['plugin'],
  }
}

function deploymentStats(
  overrides: Partial<InteropDeploymentStatsRecord>,
): InteropDeploymentStatsRecord {
  return {
    chain: 'ethereum',
    address: 'native',
    abstractTokenId: undefined,
    symbol: undefined,
    plugin: 'plugin',
    volumeUsd: 0,
    transferCount: 0,
    valuedTransferCount: 0,
    ...overrides,
  }
}

function coverageRow(
  chain: string,
  tokenAddress: string,
  plugins: string[],
): CoverageRow {
  return {
    ...interopDeployment(chain, tokenAddress, 'TOKEN1'),
    included: false,
    pluginRoles: [],
    plugins,
  }
}

function address(value: number): string {
  return `0x${value.toString(16).padStart(40, '0')}`
}
