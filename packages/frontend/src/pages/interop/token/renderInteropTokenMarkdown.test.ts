import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { InteropTokenDashboardData } from '~/server/features/layer2s/interop/getInteropTokenData'
import type {
  InteropTokenDeploymentView,
  InteropTokenRelationsGraph,
} from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'
import type { ProtocolEntry } from '~/server/features/layer2s/interop/types'
import {
  type InteropTokenPage,
  renderInteropTokenMarkdown,
} from './renderInteropTokenMarkdown'

// Method: render one hand-built token page (the same data the HTML page
// receives) and read the markdown the way an agent would: split it into H2
// sections and check each one for the values it must carry. Expected values
// are literals from the fixture, formatted as they appear on the HTML page.
describe(renderInteropTokenMarkdown.name, () => {
  it('opens with the token symbol and a link to the canonical HTML page', () => {
    expect(renderInteropTokenMarkdown(PAGE)).toMatchRegex(
      /^# USDC\n\nMarkdown version of https:\/\/l2beat\.com\/interop\/tokens\/usdc01\/circle\/usdc\n\n/,
    )
  })

  it('gives the headline numbers of the stats block as summary facts', () => {
    const summary = getSection(renderInteropTokenMarkdown(PAGE), 'Summary')

    expect(summary).toInclude(
      '- Issued by: Circle',
      '- Category: stablecoin',
      '- Last 24h volume: $12.50 M',
      '- Last 24h transfer count: 4.32 K',
      '- Last 24h avg. transfer time: 1m 30s',
      '- Last 24h avg. transfer value: $2.89 K',
      '- Last 24h top path: Ethereum <-> Base ($5.00 M)',
      '- Top protocol (based on 24h volume): [CCTP](https://l2beat.com/interop/protocols/cctp) (volume $8.00 M, 1.20 K transactions)',
      '- Protocols used: CCTP, Across',
      '- Deployments: 4',
    )
  })

  it('follows the HTML page outline with one H2 per section', () => {
    const headings = renderInteropTokenMarkdown(PAGE)
      .split('\n')
      .filter((line) => line.startsWith('## '))

    expect(headings).toEqual([
      '## Summary',
      '## Volume and flows',
      '## Top protocols',
      '## Onchain deployments',
      '## Transfers',
    ])
  })

  it('points the flows chart and the transfers browser to the HTML page', () => {
    const markdown = renderInteropTokenMarkdown(PAGE)

    expect(getSection(markdown, 'Volume and flows')).toInclude(
      'https://l2beat.com/interop/tokens/usdc01/circle/usdc#interop-volume',
    )
    expect(getSection(markdown, 'Transfers')).toInclude(
      'https://l2beat.com/interop/tokens/usdc01/circle/usdc#interop-transfers',
    )
  })

  it('tables the protocols in the order given, linking each protocol page', () => {
    const protocols = getSection(
      renderInteropTokenMarkdown(PAGE),
      'Top protocols',
    )

    expect(protocols).toInclude(
      [
        '| # | Name | Category | Last 24h volume | Last 24h transfer count | Last 24h avg. transfer time | Last 24h avg. transfer value |',
        '| --- | --- | --- | --- | --- | --- | --- |',
        '| 1 | [CCTP](https://l2beat.com/interop/protocols/cctp) | canonical | $8.00 M | 1200 | 15m | $6.66 K |',
        '| 2 | [Across](https://l2beat.com/interop/protocols/across) (aggregate, using Across Settlement) | intent | $4.50 M | 3000 | Fast: 10s, Slow: N/A | No data |',
      ].join('\n'),
    )
  })

  it('says so when no protocol moved the token', () => {
    const protocols = getSection(
      renderInteropTokenMarkdown({
        ...PAGE,
        tokenData: { ...TOKEN_DATA, entries: [] },
      }),
      'Top protocols',
    )

    expect(protocols).toInclude('No protocol data for this token.')
  })

  it('tables every deployment with its full address, minters and stats', () => {
    const deployments = getSection(
      renderInteropTokenMarkdown(PAGE),
      'Onchain deployments',
    )

    expect(deployments).toInclude(
      [
        '| # | Chain | Address | Symbol | Minters | Last 24h volume | Last 24h transfer count | Last 24h avg. transfer time |',
        '| --- | --- | --- | --- | --- | --- | --- | --- |',
        `| 1 | Ethereum | [${ETHEREUM_USDC}](https://etherscan.io/address/${ETHEREUM_USDC}) | USDC | None known (likely the locked or natively issued side) | $6.00 M | 2000 | 1m |`,
        `| 2 | Base | [${BASE_USDC}](https://basescan.org/address/${BASE_USDC}) | USDC | [CCTP](https://l2beat.com/interop/protocols/cctp) | $3.00 M | 900 | 20s |`,
        `| 3 | Arbitrum One | [${ARBITRUM_USDC}](https://arbiscan.io/address/${ARBITRUM_USDC}) | USDC | [CCTP](https://l2beat.com/interop/protocols/cctp) | $1.00 M | 300 | 25s |`,
        `| 4 | Unichain | ${UNICHAIN_USDC} | USDC.e | [Stargate](https://l2beat.com/interop/protocols/stargate) | No data (chain not fully supported) | No data (chain not fully supported) | No data (chain not fully supported) |`,
      ].join('\n'),
    )
  })

  it('describes the backing relations the HTML page draws as a diagram', () => {
    const deployments = getSection(
      renderInteropTokenMarkdown(PAGE),
      'Onchain deployments',
    )

    expect(deployments).toInclude(
      [
        '### Backing relations',
        '',
        '- Burn and mint between USDC on Base, Arbitrum One via [CCTP](https://l2beat.com/interop/protocols/cctp)',
        '- USDC on Base, Arbitrum One is backed by USDC on Ethereum (0xA0b8...eB48) (bridge not identified)',
        '- USDC.e on Unichain (0x078D...7AD6) is backed by USDC on Ethereum (0xA0b8...eB48) via [Stargate](https://l2beat.com/interop/protocols/stargate)',
      ].join('\n'),
    )
  })

  it('warns instead of giving statistics when the token has no transfers', () => {
    const markdown = renderInteropTokenMarkdown({ ...PAGE, tokenData: null })

    expect(getSection(markdown, 'Summary')).toInclude(
      '**Warning:** No transfers of this token were found in the past 24 hours',
      '- Issued by: Circle\n- Category: stablecoin\n- Deployments: 4',
    )
    expect(markdown).not.toInclude('## Top protocols')
  })
})

function getSection(markdown: string, heading: string) {
  const [, afterHeading] = markdown.split(`\n## ${heading}\n`)
  expect(afterHeading).not.toEqual(undefined)
  return (afterHeading ?? '').split('\n## ')[0] ?? ''
}

// A token page shaped like the one the HTML page renders: every section the
// token page has, deployments in a burn-and-mint group and on an unsupported
// chain, and protocols in volume order, as the dashboard data provides them.

const ETHEREUM_USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
const BASE_USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const ARBITRUM_USDC = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'
const UNICHAIN_USDC = '0x078D782b760474a361dDA0AF3839290b0EF57AD6'

const CCTP = {
  id: 'cctp',
  name: 'CCTP',
  iconUrl: '/icons/cctp.png',
  href: '/interop/protocols/cctp',
}
const STARGATE = {
  id: 'stargate',
  name: 'Stargate',
  iconUrl: '/icons/stargate.png',
  href: '/interop/protocols/stargate',
}

function deployment(
  chain: string,
  address: string,
  overrides: Partial<InteropTokenDeploymentView>,
): InteropTokenDeploymentView {
  return {
    chain: { id: chain.toLowerCase(), name: chain, iconUrl: undefined },
    address,
    symbol: 'USDC',
    explorerUrl: undefined,
    minters: [],
    isSupported: true,
    volume: 0,
    transferCount: 0,
    avgDuration: null,
    ...overrides,
  }
}

const GRAPH: InteropTokenRelationsGraph = {
  nodes: [
    {
      id: 'ethereum',
      volume: 6_000_000,
      transferCount: 2_000,
      avgDuration: 60,
      bridges: [],
      deployments: [
        deployment('Ethereum', ETHEREUM_USDC, {
          explorerUrl: `https://etherscan.io/address/${ETHEREUM_USDC}`,
          volume: 6_000_000,
          transferCount: 2_000,
          avgDuration: 60,
        }),
      ],
    },
    {
      id: 'unichain',
      volume: null,
      transferCount: null,
      avgDuration: null,
      bridges: [],
      deployments: [
        deployment('Unichain', UNICHAIN_USDC, {
          symbol: 'USDC.e',
          minters: [STARGATE],
          isSupported: false,
          volume: null,
          transferCount: null,
          avgDuration: null,
        }),
      ],
    },
    {
      id: 'cctp-group',
      volume: 4_000_000,
      transferCount: 1_200,
      avgDuration: 22,
      bridges: [CCTP],
      deployments: [
        deployment('Base', BASE_USDC, {
          explorerUrl: `https://basescan.org/address/${BASE_USDC}`,
          minters: [CCTP],
          volume: 3_000_000,
          transferCount: 900,
          avgDuration: 20,
        }),
        deployment('Arbitrum One', ARBITRUM_USDC, {
          explorerUrl: `https://arbiscan.io/address/${ARBITRUM_USDC}`,
          minters: [CCTP],
          volume: 1_000_000,
          transferCount: 300,
          avgDuration: 25,
        }),
      ],
    },
  ],
  edges: [
    { backer: 'ethereum', backed: 'cctp-group', bridges: [] },
    { backer: 'ethereum', backed: 'unichain', bridges: [STARGATE] },
  ],
}

function protocol(
  name: string,
  overrides: Partial<ProtocolEntry>,
): ProtocolEntry {
  return {
    id: ProjectId(name.toLowerCase()),
    slug: name.toLowerCase(),
    iconUrl: `/icons/${name.toLowerCase()}.png`,
    name,
    shortName: undefined,
    description: undefined,
    type: 'canonical',
    bridgeTypes: ['burnAndMint'],
    isAggregate: false,
    subgroup: undefined,
    volume: 0,
    tokens: { items: [], remainingCount: 0 },
    chains: { items: [], remainingCount: 0 },
    transferCount: 0,
    averageValue: null,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    averageDuration: null,
    byBridgeType: undefined,
    averageValueInFlight: undefined,
    netMintedValue: undefined,
    topRoute: undefined,
    snapshotTimestamp: undefined,
    filterable: undefined,
    ...overrides,
  }
}

const TOKEN_DATA: InteropTokenDashboardData = {
  token: {
    id: 'usdc01',
    symbol: 'USDC',
    issuer: 'circle',
    iconUrl: '/icons/usdc.png',
    topProtocol: undefined,
    volume: 12_500_000,
    transferCount: 4_321,
    avgDuration: { type: 'single', duration: 90 },
    avgValue: 2_893,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    netMintedValue: undefined,
    flows: [],
  },
  flows: [],
  topPath: { chainA: 'ethereum', chainB: 'base', volume: 5_000_000 },
  topProtocol: {
    name: 'CCTP',
    slug: 'cctp',
    iconUrl: '/icons/cctp.png',
    volume: { value: 8_000_000, share: 0.64 },
    transfers: { value: 1_200, share: 0.29 },
  },
  topProtocols: [],
  entries: [
    protocol('CCTP', {
      volume: 8_000_000,
      transferCount: 1_200,
      averageValue: 6_667,
      averageDuration: { type: 'single', duration: 900 },
    }),
    protocol('Across', {
      type: 'intent',
      isAggregate: true,
      subgroup: { name: 'Across Settlement', iconUrl: '/icons/across.png' },
      volume: 4_500_000,
      transferCount: 3_000,
      averageDuration: {
        type: 'split',
        splits: [
          { label: 'Fast', duration: 10 },
          { label: 'Slow', duration: null },
        ],
      },
    }),
  ],
  zeroTransferProtocols: [],
  snapshotTimestamp: 1_700_000_000,
}

const PAGE: InteropTokenPage = {
  token: {
    id: 'usdc01',
    symbol: 'USDC',
    issuer: 'circle',
    iconUrl: null,
    category: 'stablecoin',
  },
  tokenEntry: {
    deploymentsCount: 4,
    sections: [
      {
        type: 'InteropTokenVolumeSection',
        props: {
          id: 'interop-volume',
          title: 'Volume and flows',
          tokenId: 'usdc01',
          interopChains: [],
        },
      },
      {
        type: 'InteropTokenProtocolsSection',
        props: { id: 'interop-protocols', title: 'Top protocols' },
      },
      {
        type: 'InteropTokenOnchainDeploymentsSection',
        props: {
          id: 'onchain-deployments',
          title: 'Onchain deployments',
          graph: GRAPH,
        },
      },
      {
        type: 'InteropTokenTransfersSection',
        props: {
          id: 'interop-transfers',
          title: 'Transfers',
          tokenId: 'usdc01',
          interopChains: [],
        },
      },
    ],
  },
  tokenData: TOKEN_DATA,
}
