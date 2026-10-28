import type {
  AbstractTokenRecord,
  AggregatedInteropDeployedTokenStats,
  DeployedTokenRecord,
  TokenRelationRoute,
} from '@l2beat/database'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { Coverage, type CoverageRow, type TvsProjectInput } from './coverage'
import {
  ARB_USDC,
  ARB_USDC_E,
  abstractToken,
  BASE_USDBC,
  deployedToken,
  ESCROW,
  escrow,
  L1_USDC,
  NOW,
  OP_USDC_E,
  plugin,
  relation,
  stat,
  supply,
  token,
} from './test/fixtures'
import { tokenKey } from './tokens'

const OVERRIDE_ESCROW = '0x3333333333333333333333333333333333333333'

describe(Coverage.name, () => {
  const arbitrum: TvsProjectInput = {
    id: 'arbitrum',
    name: 'Arbitrum One',
    chain: 'arbitrum',
    plugins: [plugin('orbitstack-standardgateway', 'arbitrum')],
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
          plugins: [plugin('opstack', 'base')],
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

  it('trusts a relation of the project bridge over the same-asset fallback', () => {
    const rows = coverage({
      projects: [
        { ...arbitrum, tokens: [token(supply('arbitrum', ARB_USDC))] },
      ],
      stats: [
        stat({ id: 'arbitrum', tokenChain: 'ethereum', address: L1_USDC }),
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

    expect(summary(rows)).toEqual([
      ['arbitrum', 'escrow', `ethereum:${L1_USDC}`, 'sameAssetOnly'],
    ])
  })

  it("ignores relations of another project's chain that share its plugin", () => {
    const rows = coverage({
      projects: [
        {
          id: 'base',
          name: 'Base',
          chain: 'base',
          plugins: [plugin('opstack-standardbridge', 'base')],
          tokens: [token(supply('base', BASE_USDBC))],
        },
      ],
      stats: [stat({ id: 'base', tokenChain: 'ethereum', address: L1_USDC })],
      deployedTokens: [
        deployedToken('ethereum', L1_USDC, usdc.id),
        deployedToken('base', BASE_USDBC, usdc.id),
      ],
      abstractTokens: [usdc],
      relations: [
        relation(
          ['ethereum', L1_USDC],
          ['optimism', OP_USDC_E],
          'opstack-standardbridge',
        ),
      ],
    })

    expect(summary(rows)).toEqual([
      ['base', 'escrow', `ethereum:${L1_USDC}`, 'countedViaCounterpart'],
    ])
  })

  it('counts deployments of a valueForProject override', () => {
    const native = escrow('haust', 'native', { escrowAddress: OVERRIDE_ESCROW })
    const rows = coverage({
      projects: [
        {
          id: 'haust',
          name: 'Haust',
          chain: 'haust',
          plugins: [],
          tokens: [
            {
              ...token(escrow('ethereum', L1_USDC)),
              valueForProject: {
                type: 'value',
                priceId: 'haust',
                amount: native,
              },
            },
          ],
        },
      ],
      stats: [stat({ id: 'other', tokenChain: 'haust', address: 'native' })],
    })

    expect(summary(rows)).toEqual([
      ['haust', 'chain', 'haust:native', 'counted'],
    ])
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
      plugins: [plugin('wormhole-token-bridge')],
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

describe('Coverage lookups', () => {
  const project: TvsProjectInput = {
    id: 'arbitrum',
    name: 'Arbitrum One',
    chain: 'arbitrum',
    plugins: [plugin('orbitstack-standardgateway', 'arbitrum')],
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
    const result = new Coverage({
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

  it('keeps the escrows of every formula that counts the same token', () => {
    const second = '0x4444444444444444444444444444444444444444'
    const result = new Coverage({
      stats: [],
      projects: [
        {
          ...project,
          tokens: [
            token(escrow('ethereum', L1_USDC)),
            token(escrow('ethereum', L1_USDC, { escrowAddress: second })),
          ],
        },
      ],
      deployedTokens: [],
      abstractTokens: [],
      relations: [],
      timestamp: NOW,
    })

    expect(result.escrowAddresses('arbitrum', 'ethereum')).toEqual([
      ESCROW,
      second,
    ])
  })

  it('prices an unlisted minted copy with its locked counterpart', () => {
    const usdc = abstractToken('circle.USDC', 'usd-coin')
    const unreliable = {
      ...abstractToken('other.TKN', 'tkn'),
      isPriceUnreliable: true,
    }
    const mintedCopy = '0x3333333333333333333333333333333333333333'
    const rows = new Coverage({
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

  it('treats a copy backed by a counted escrow token as counted', () => {
    const result = new Coverage({
      stats: [],
      projects: [project],
      deployedTokens: [],
      abstractTokens: [],
      relations: [
        relation(
          ['ethereum', L1_USDC],
          ['arbitrum', ARB_USDC_E],
          'orbitstack-standardgateway',
        ),
      ],
      timestamp: NOW,
    })

    expect(
      result.isCounted('arbitrum', { chain: 'arbitrum', address: ARB_USDC_E }),
    ).toEqual(true)
  })

  it("does not take a copy that another project's chain minted", () => {
    const result = new Coverage({
      stats: [],
      projects: [
        {
          id: 'base',
          name: 'Base',
          chain: 'base',
          plugins: [plugin('opstack-standardbridge', 'base')],
          tokens: [],
        },
      ],
      deployedTokens: [],
      abstractTokens: [],
      relations: [
        relation(
          ['ethereum', L1_USDC],
          ['optimism', OP_USDC_E],
          'opstack-standardbridge',
        ),
      ],
      timestamp: NOW,
    })

    expect(
      result.mintedCopy('base', { chain: 'ethereum', address: L1_USDC }),
    ).toEqual(undefined)
  })

  it("finds the copy minted by the project's own bridge for an escrow token", () => {
    const result = new Coverage({
      stats: [],
      projects: [project],
      deployedTokens: [deployedToken('arbitrum', ARB_USDC_E, 'circle.USDC')],
      abstractTokens: [],
      relations: [
        relation(['ethereum', L1_USDC], ['base', ARB_USDC], 'axelar'),
        relation(
          ['ethereum', L1_USDC],
          ['arbitrum', ARB_USDC_E],
          'orbitstack-standardgateway',
        ),
      ],
      timestamp: NOW,
    })

    expect(
      result.mintedCopy('arbitrum', { chain: 'ethereum', address: L1_USDC }),
    ).toEqual({
      chain: 'arbitrum',
      address: ARB_USDC_E,
      symbol: 'USDC',
      decimals: 6,
    })
    expect(
      result.mintedCopy('arbitrum', { chain: 'ethereum', address: ARB_USDC }),
    ).toEqual(undefined)
  })
})

function coverage(input: {
  projects: TvsProjectInput[]
  stats: AggregatedInteropDeployedTokenStats[]
  deployedTokens?: DeployedTokenRecord[]
  abstractTokens?: AbstractTokenRecord[]
  relations?: TokenRelationRoute[]
}): CoverageRow[] {
  return new Coverage({
    deployedTokens: [],
    abstractTokens: [],
    relations: [],
    ...input,
    timestamp: NOW,
  }).rows
}

function summary(rows: CoverageRow[]) {
  return rows.map((row) => [row.projectId, row.side, tokenKey(row), row.status])
}
