import type { Formula, TvsToken } from '@l2beat/config'
import type {
  AbstractTokenRecord,
  AggregatedInteropDeployedTokenStats,
  DeployedTokenRecord,
  TokenRelationRoute,
} from '@l2beat/database'
import { EthereumAddress, TokenId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  buildCoverage,
  type CoverageRow,
  collectActiveLeaves,
  type TvsProjectInput,
  tokenKey,
} from './model'

const NOW = UnixTime(1_000_000)
const L1_USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const ARB_USDC_E = '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8'
const ARB_USDC = '0xaf88d065e77c8cc2239327c5edb3a432268e5831'
const ESCROW = '0x1111111111111111111111111111111111111111'

describe(tokenKey.name, () => {
  it('crops Address32 padding, lowercases and keeps native', () => {
    expect(
      tokenKey(
        'base',
        '0x000000000000000000000000A0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      ),
    ).toEqual(`base:${L1_USDC}`)
    expect(tokenKey('base', 'NATIVE')).toEqual('base:native')
  })
})

describe(collectActiveLeaves.name, () => {
  it('collects active leaves and marks escrow reads', () => {
    const leaves = collectActiveLeaves(
      {
        type: 'calculation',
        operator: 'sum',
        arguments: [
          escrow('ethereum', L1_USDC),
          {
            type: 'balanceOfEscrows',
            chain: 'ethereum',
            address: 'native',
            escrowAddresses: [EthereumAddress(ESCROW)],
            decimals: 18,
            sinceTimestamp: UnixTime(1),
          },
          supply('arbitrum', ARB_USDC),
          { type: 'const', value: '1', decimals: 0, sinceTimestamp: 1 },
        ],
      },
      NOW,
    )

    expect(leaves).toEqual([
      {
        chain: 'ethereum',
        address: EthereumAddress(L1_USDC),
        escrow: true,
        escrowAddresses: [EthereumAddress(ESCROW)],
      },
      {
        chain: 'ethereum',
        address: 'native',
        escrow: true,
        escrowAddresses: [EthereumAddress(ESCROW)],
      },
      {
        chain: 'arbitrum',
        address: EthereumAddress(ARB_USDC),
        escrow: false,
        escrowAddresses: [],
      },
    ])
  })

  it('skips inactive leaves and diffs with an inactive side', () => {
    const active = supply('base', L1_USDC, { since: 100, until: 300 })
    const expired = supply('base', ARB_USDC, { since: 100, until: 200 })
    const future = supply('base', ARB_USDC_E, { since: 200 })

    expect(
      collectActiveLeaves(
        {
          type: 'calculation',
          operator: 'sum',
          arguments: [active, expired, future],
        },
        UnixTime(200),
      ).map((leaf) => leaf.address),
    ).toEqual([EthereumAddress(L1_USDC)])
    expect(
      collectActiveLeaves(
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

describe(buildCoverage.name, () => {
  const arbitrum: TvsProjectInput = {
    id: 'arbitrum',
    name: 'Arbitrum One',
    chain: 'arbitrum',
    plugins: ['orbitstack-standardgateway'],
    tokens: [token(escrow('ethereum', L1_USDC))],
  }
  const usdc = abstractToken('circle.USDC', 'usd-coin')
  const deployedTokens = [
    deployedToken('ethereum', L1_USDC, usdc.id),
    deployedToken('arbitrum', ARB_USDC_E, usdc.id),
    deployedToken('arbitrum', ARB_USDC, usdc.id),
  ]

  it('marks exact formula deployments as counted', () => {
    const rows = coverage({
      projects: [
        { ...arbitrum, tokens: [token(supply('arbitrum', ARB_USDC))] },
      ],
      stats: [stat({ id: 'cctp', tokenChain: 'arbitrum', address: ARB_USDC })],
      deployedTokens,
      abstractTokens: [usdc],
    })

    expect(summary(rows)).toEqual([
      ['arbitrum', 'chain', `arbitrum:${ARB_USDC}`, 'counted'],
    ])
  })

  it('counts a copy minted by the project bridge from a counted escrow token', () => {
    const rows = coverage({
      projects: [arbitrum],
      stats: [
        stat({ id: 'arbitrum', tokenChain: 'arbitrum', address: ARB_USDC_E }),
      ],
      deployedTokens,
      abstractTokens: [usdc],
      relations: [
        relation(
          ['ethereum', L1_USDC],
          ['arbitrum', ARB_USDC_E],
          'orbitstack-standardgateway',
        ),
      ],
    })

    expect(rows[0]?.status).toEqual('countedViaCounterpart')
    expect(rows[0]?.countedVia).toEqual({ chain: 'ethereum', address: L1_USDC })
  })

  it('does not count a third-party copy backed by an escrow token of the project', () => {
    const rows = coverage({
      projects: [arbitrum],
      stats: [
        stat({ id: 'layerzero', tokenChain: 'arbitrum', address: ARB_USDC_E }),
      ],
      deployedTokens,
      abstractTokens: [usdc],
      relations: [
        relation(
          ['ethereum', L1_USDC],
          ['arbitrum', ARB_USDC_E],
          'layerzero-v2-ofts',
        ),
      ],
    })

    expect(rows[0]?.status).toEqual('sameAssetOnly')
  })

  it('does not count native USDC because escrowed USDC shares its asset', () => {
    const rows = coverage({
      projects: [arbitrum],
      stats: [stat({ id: 'cctp', tokenChain: 'arbitrum', address: ARB_USDC })],
      deployedTokens,
      abstractTokens: [usdc],
    })

    expect(rows[0]?.status).toEqual('sameAssetOnly')
  })

  it('counts a token the project bridge moved when the escrow holds the same asset', () => {
    const eth = abstractToken('ethereum.ETH', 'ethereum')
    const rows = coverage({
      projects: [
        {
          id: 'base',
          name: 'Base',
          chain: 'base',
          plugins: ['opstack'],
          tokens: [token(escrow('ethereum', 'native'))],
        },
      ],
      stats: [stat({ id: 'base', tokenChain: 'base', address: 'native' })],
      deployedTokens: [
        deployedToken('ethereum', 'native', eth.id),
        deployedToken('base', 'native', eth.id),
      ],
      abstractTokens: [eth],
    })

    expect(rows[0]?.status).toEqual('countedViaCounterpart')
    expect(rows[0]?.countedVia).toEqual({
      chain: 'ethereum',
      address: 'native',
    })
  })

  it('marks deployments with a future formula as scheduled', () => {
    const rows = coverage({
      projects: [
        {
          ...arbitrum,
          tokens: [token(supply('arbitrum', ARB_USDC, { since: NOW + 1 }))],
        },
      ],
      stats: [stat({ id: 'cctp', tokenChain: 'arbitrum', address: ARB_USDC })],
    })

    expect(rows[0]?.status).toEqual('scheduled')
  })

  it('adds tokens locked by the project bridge on the parent chain', () => {
    const dai = '0x6b175474e89094c44da98b954eedeac495271d0f'
    const rows = coverage({
      projects: [arbitrum],
      stats: [
        stat({
          id: 'arbitrum',
          tokenChain: 'ethereum',
          address: L1_USDC,
          volume: 2,
        }),
        stat({ id: 'arbitrum', tokenChain: 'ethereum', address: dai }),
        stat({ id: 'cctp', tokenChain: 'ethereum', address: L1_USDC }),
      ],
    })

    expect(summary(rows)).toEqual([
      ['arbitrum', 'escrow', `ethereum:${L1_USDC}`, 'counted'],
      ['arbitrum', 'escrow', `ethereum:${dai}`, 'missing'],
    ])
  })

  it('counts a locked token whose minted copy the project counts', () => {
    const rows = coverage({
      projects: [
        {
          ...arbitrum,
          tokens: [token(supply('arbitrum', ARB_USDC_E))],
        },
      ],
      stats: [
        stat({ id: 'arbitrum', tokenChain: 'ethereum', address: L1_USDC }),
      ],
      relations: [
        relation(
          ['ethereum', L1_USDC],
          ['arbitrum', ARB_USDC_E],
          'orbitstack-standardgateway',
        ),
      ],
    })

    expect(rows[0]?.status).toEqual('countedViaCounterpart')
  })

  it('skips parent chain tokens the project bridge minted', () => {
    const rows = coverage({
      projects: [arbitrum],
      stats: [
        stat({ id: 'arbitrum', tokenChain: 'ethereum', address: L1_USDC }),
      ],
      relations: [
        relation(
          ['arbitrum', ARB_USDC_E],
          ['ethereum', L1_USDC],
          'orbitstack-standardgateway',
        ),
      ],
    })

    expect(rows).toEqual([])
  })

  it('needs a relation to place escrow tokens of a bridge without a chain', () => {
    const portal: TvsProjectInput = {
      id: 'portal',
      name: 'Portal',
      chain: undefined,
      plugins: ['wormhole-token-bridge'],
      tokens: [],
    }
    const solanaUsdc = 'epjfwdd5aufqssqem2qn1xzybapc8g4weggkzwytdt1v'
    const rows = coverage({
      projects: [portal],
      stats: [
        stat({ id: 'portal', tokenChain: 'ethereum', address: L1_USDC }),
        stat({ id: 'portal', tokenChain: 'solana', address: solanaUsdc }),
        stat({ id: 'portal', tokenChain: 'ethereum', address: ARB_USDC }),
      ],
      relations: [
        relation(
          ['ethereum', L1_USDC],
          ['solana', solanaUsdc],
          'wormhole-token-bridge',
        ),
      ],
    })

    expect(summary(rows)).toEqual([
      ['portal', 'escrow', `ethereum:${L1_USDC}`, 'missing'],
    ])
  })

  it('merges bridges, skips chains without a project and zero addresses', () => {
    const rows = coverage({
      projects: [arbitrum],
      stats: [
        stat({
          id: 'cctp',
          tokenChain: 'arbitrum',
          address: ARB_USDC,
          volume: 5,
          lastSeen: 10,
        }),
        stat({
          id: 'across',
          bridgeType: 'nonMinting',
          tokenChain: 'arbitrum',
          address: ARB_USDC,
          volume: 7,
          lastSeen: 20,
        }),
        stat({ id: 'cctp', tokenChain: 'optimism', address: ARB_USDC }),
        stat({ id: 'cctp', tokenChain: 'arbitrum', address: '0x' }),
      ],
      deployedTokens: [
        { ...deployedToken('arbitrum', ARB_USDC, usdc.id), ignored: true },
      ],
      abstractTokens: [usdc],
    })

    expect(rows).toHaveLength(1)
    expect(rows[0]).toEqual({
      projectId: 'arbitrum',
      side: 'chain',
      chain: 'arbitrum',
      address: ARB_USDC,
      symbol: 'USDC',
      decimals: 6,
      abstractTokenId: usdc.id,
      abstractSymbol: 'USDC',
      issuer: 'circle',
      iconUrl: undefined,
      coingeckoId: 'usd-coin',
      pricing: { coingeckoId: 'usd-coin', via: undefined },
      ignored: true,
      status: 'missing',
      countedVia: undefined,
      role: undefined,
      bridges: [
        {
          id: 'across',
          bridgeType: 'nonMinting',
          volumeUsd: 7,
          transferCount: 1,
        },
        {
          id: 'cctp',
          bridgeType: 'lockAndMint',
          volumeUsd: 5,
          transferCount: 1,
        },
      ],
      volumeUsd: 12,
      transferCount: 2,
      lastSeen: 20,
    })
  })
})

describe('buildCoverage helpers', () => {
  const project: TvsProjectInput = {
    id: 'arbitrum',
    name: 'Arbitrum One',
    chain: 'arbitrum',
    plugins: ['orbitstack-standardgateway'],
    tokens: [
      token(escrow('ethereum', L1_USDC)),
      token({
        type: 'balanceOfEscrows',
        chain: 'ethereum',
        address: 'native',
        escrowAddresses: [
          EthereumAddress('0x2222222222222222222222222222222222222222'),
          EthereumAddress(ESCROW),
        ],
        decimals: 18,
        sinceTimestamp: UnixTime(1),
      }),
    ],
  }

  it('answers which deployments a project counts and where its escrows are', () => {
    const result = buildCoverage({
      stats: [],
      projects: [project],
      deployedTokens: [],
      abstractTokens: [],
      relations: [],
      timestamp: NOW,
    })

    expect(
      result.isCounted('arbitrum', {
        chain: 'ethereum',
        address: L1_USDC.toUpperCase().replace('0X', '0x'),
      }),
    ).toEqual(true)
    expect(
      result.isCounted('arbitrum', { chain: 'arbitrum', address: ARB_USDC }),
    ).toEqual(false)
    expect(result.escrowAddresses('arbitrum', 'ethereum')).toEqual([
      ESCROW,
      '0x2222222222222222222222222222222222222222',
    ])
    expect(result.escrowAddresses('arbitrum', 'arbitrum')).toEqual([])
  })

  it('prices an unlisted minted copy with its locked counterpart', () => {
    const usdc = abstractToken('circle.USDC', 'usd-coin')
    const unreliable = {
      ...abstractToken('other.TKN', 'tkn'),
      isPriceUnreliable: true,
    }
    const mintedCopy = '0x3333333333333333333333333333333333333333'
    const rows = buildCoverage({
      stats: [
        stat({ id: 'arbitrum', tokenChain: 'arbitrum', address: mintedCopy }),
        stat({ id: 'arbitrum', tokenChain: 'arbitrum', address: ARB_USDC }),
      ],
      projects: [{ ...project, tokens: [] }],
      deployedTokens: [
        deployedToken('ethereum', L1_USDC, usdc.id),
        {
          ...deployedToken('arbitrum', mintedCopy, usdc.id),
          abstractTokenId: null,
        },
        deployedToken('arbitrum', ARB_USDC, unreliable.id),
      ],
      abstractTokens: [usdc, unreliable],
      relations: [
        relation(
          ['ethereum', L1_USDC],
          ['arbitrum', mintedCopy],
          'orbitstack-standardgateway',
        ),
      ],
      timestamp: NOW,
    }).rows

    expect(rows.map((row) => [row.address, row.pricing])).toEqual([
      [
        mintedCopy,
        {
          coingeckoId: 'usd-coin',
          via: { chain: 'ethereum', address: L1_USDC, symbol: 'USDC' },
        },
      ],
      [ARB_USDC, undefined],
    ])
  })
})

function coverage(input: {
  projects: TvsProjectInput[]
  stats: AggregatedInteropDeployedTokenStats[]
  deployedTokens?: DeployedTokenRecord[]
  abstractTokens?: AbstractTokenRecord[]
  relations?: TokenRelationRoute[]
}): CoverageRow[] {
  return buildCoverage({
    deployedTokens: [],
    abstractTokens: [],
    relations: [],
    ...input,
    timestamp: NOW,
  }).rows
}

function summary(rows: CoverageRow[]) {
  return rows.map((row) => [
    row.projectId,
    row.side,
    tokenKey(row.chain, row.address),
    row.status,
  ])
}

function stat(input: {
  id: string
  tokenChain: string
  address: string
  bridgeType?: AggregatedInteropDeployedTokenStats['bridgeType']
  volume?: number
  lastSeen?: number
}): AggregatedInteropDeployedTokenStats {
  return {
    id: input.id,
    bridgeType: input.bridgeType ?? 'lockAndMint',
    srcChain: 'ethereum',
    dstChain: input.tokenChain,
    tokenChain: input.tokenChain,
    tokenAddress: input.address,
    volume: input.volume ?? 1,
    transferCount: 1,
    lastSeen: UnixTime(input.lastSeen ?? 1),
  }
}

function relation(
  locked: [string, string],
  minted: [string, string],
  plugin: string,
): TokenRelationRoute {
  return {
    tokenAChain: locked[0],
    tokenAAddress: locked[1],
    tokenBChain: minted[0],
    tokenBAddress: minted[1],
    plugin,
    bridgeType: 'lockAndMint',
    lockedToken: 'A',
  } as TokenRelationRoute
}

function escrow(chain: string, address: string): Formula {
  return {
    type: 'balanceOfEscrow',
    chain,
    address: address === 'native' ? 'native' : EthereumAddress(address),
    escrowAddress: EthereumAddress(ESCROW),
    decimals: 18,
    sinceTimestamp: UnixTime(1),
  }
}

function supply(
  chain: string,
  address: string,
  options: { since?: number; until?: number } = {},
): Extract<Formula, { type: 'totalSupply' }> {
  return {
    type: 'totalSupply',
    chain,
    address: EthereumAddress(address),
    decimals: 18,
    sinceTimestamp: UnixTime(options.since ?? 1),
    untilTimestamp:
      options.until === undefined ? undefined : UnixTime(options.until),
  }
}

function token(amount: Formula): TvsToken {
  return {
    mode: 'auto',
    id: TokenId('token'),
    priceId: 'token',
    symbol: 'TOKEN',
    name: 'Token',
    amount,
    category: 'other',
    source: 'canonical',
    isAssociated: false,
  } as TvsToken
}

function abstractToken(id: string, coingeckoId: string): AbstractTokenRecord {
  return {
    id,
    symbol: id.split('.')[1] ?? id,
    issuer: id.split('.')[0] ?? null,
    category: null,
    iconUrl: null,
    coingeckoId,
    coingeckoListingTimestamp: null,
    additionalCoingeckoEntries: null,
    comment: null,
    reviewed: true,
    isPriceUnreliable: false,
  }
}

function deployedToken(
  chain: string,
  address: string,
  abstractTokenId: string,
): DeployedTokenRecord {
  return {
    chain,
    address,
    abstractTokenId,
    symbol: 'USDC',
    decimals: 6,
    deploymentTimestamp: UnixTime(1),
    comment: null,
    ignored: false,
    metadata: null,
  }
}
