import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import type { InteropProtocolDashboardData } from '~/server/features/layer2s/interop/getInteropProtocolData'
import type { InteropProtocolEntry } from '~/server/features/layer2s/interop/protocol/getInteropProtocolEntry'
import type {
  ChainData,
  ProtocolEntry,
  TokenData,
} from '~/server/features/layer2s/interop/types'
import {
  type InteropProtocolPageContent,
  renderInteropProtocolMarkdown,
} from './renderInteropProtocolMarkdown'

// Method: render one hand-built page (the protocol entry and dashboard data
// the HTML page receives) and read the markdown the way an agent would: split
// it into H2 sections and check each one for the values it must carry.
// Expected values are literals from the fixture, formatted as they appear on
// the HTML page.
describe(renderInteropProtocolMarkdown.name, () => {
  it('opens with the protocol name and a link to the HTML page', () => {
    const markdown = renderInteropProtocolMarkdown(PAGE)

    expect(markdown).toMatchRegex(
      /^# Across\n\nMarkdown version of https:\/\/l2beat\.com\/interop\/protocols\/across\n\n/,
    )
  })

  it('gives the last 24h headline numbers of the stats block', () => {
    const summary = getSection(renderInteropProtocolMarkdown(PAGE), 'Summary')

    expect(summary).toInclude(
      '- Last 24h volume: $1.50 M',
      '- Last 24h transfer count: 1.20 K',
      '- Last 24h top path: Ethereum ↔ Arbitrum One ($900.00 K)',
      '- Last 24h avg. transfer time: 1m 30s',
      '- Last 24h avg. transfer value: $1.25 K',
      '- Tokens by volume: USDC ($800.00 K), WETH ($500.00 K), USDT ($100.00 K), and 12 more',
      '- Top token: [USDC](https://l2beat.com/interop/tokens/usdc-id/circle/usdc) ($800.00 K volume, 700 transfers)',
      '- Transfer size: Under $100: 600 transfers, $100-$1K: 400 transfers, $1K-$10K: 150 transfers, $10K-$100K: 45 transfers, Over $100K: 5 transfers (min $1.00, average $1.25 K, max $250.00 K)',
      '- Transfer type distribution: Lock & Mint: $150.00 K, Non-minting: $1.35 M',
      'Across is an intent-based bridge.',
    )
  })

  it('reports the average transfer time the way the HTML cell does', () => {
    const cases: [ProtocolEntry['averageDuration'], string][] = [
      [
        {
          type: 'split',
          splits: [
            { label: 'Fast', duration: 90 },
            { label: 'Slow', duration: null },
          ],
        },
        '- Last 24h avg. transfer time: Fast: 1m 30s, Slow: N/A',
      ],
      [
        { type: 'unknown' },
        '- Last 24h avg. transfer time: Unknown (the transfer times for this protocol could not be derived based on onchain data only)',
      ],
    ]
    for (const [averageDuration, expected] of cases) {
      const summary = getSection(
        renderInteropProtocolMarkdown({
          ...PAGE,
          protocolData: {
            ...PAGE.protocolData,
            entry: { ...PROTOCOL, averageDuration },
          },
        }),
        'Summary',
      )

      expect(summary).toInclude(expected)
    }
  })

  it('leaves out the numbers the HTML page shows as a dash when there were no transfers', () => {
    const summary = getSection(
      renderInteropProtocolMarkdown({
        ...PAGE,
        protocolData: {
          entry: undefined,
          flows: [],
          topPath: undefined,
          transferSize: undefined,
          topToken: undefined,
        },
      }),
      'Summary',
    )

    expect(summary.split('\n').filter((line) => line.startsWith('- '))).toEqual(
      ['- Last 24h transfer count: 0'],
    )
  })

  it('surfaces protocol warnings before the facts, with no risk list', () => {
    const summary = getSection(
      renderInteropProtocolMarkdown({
        ...PAGE,
        projectEntry: {
          ...PAGE.projectEntry,
          header: {
            ...PAGE.projectEntry.header,
            emergencyWarning: 'Funds are at risk.',
            redWarning: { text: 'Critical contracts are unverified.' },
            warning: 'The protocol is being upgraded.',
          },
        },
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '**Warning:** Funds are at risk.',
      '**Warning:** Critical contracts are unverified.',
      '**Warning:** The protocol is being upgraded.',
    )
    expect(summary.indexOf('**Warning:**')).toBeLessThan(
      summary.indexOf('- Last 24h'),
    )
    expect(summary).not.toInclude('### Risks')
  })

  it('leads the warnings with the under review banner of the HTML page', () => {
    const summary = getSection(
      renderInteropProtocolMarkdown({
        ...PAGE,
        projectEntry: {
          ...PAGE.projectEntry,
          underReviewStatus: 'config',
          header: {
            ...PAGE.projectEntry.header,
            warning: 'The protocol is being upgraded.',
          },
        },
      }),
      'Summary',
    )

    expect(summary).toInclude('**Warning:** This project is under review.')
    expect(summary.indexOf('This project is under review.')).toBeLessThan(
      summary.indexOf('The protocol is being upgraded.'),
    )
  })

  it('follows the HTML page outline with one H2 per section', () => {
    const headings = renderInteropProtocolMarkdown(PAGE)
      .split('\n')
      .filter((line) => line.startsWith('## '))

    expect(headings).toEqual([
      '## Summary',
      '## Volume and flows',
      '## Description',
      '## Top tokens by volume',
      '## Transfers',
    ])
  })

  it('lists the top chains and the routes the flows graph draws', () => {
    const volume = getSection(
      renderInteropProtocolMarkdown(PAGE),
      'Volume and flows',
    )

    expect(volume).toInclude(
      '### Top chains by volume\n\n- Ethereum: $1.40 M (1.10 K transfers)\n- Arbitrum One: $1.10 M (900 transfers)\n- Base: $50.00 K (40 transfers)\n- and 2 more',
      '### Top routes by volume\n\n- Ethereum → Arbitrum One: $700.00 K\n- Arbitrum One → Ethereum: $200.00 K\n- Base → Ethereum: $50.00 K\n\n',
      'https://l2beat.com/interop/protocols/across#interop-volume',
    )
  })

  it('carries the detailed description', () => {
    expect(
      getSection(renderInteropProtocolMarkdown(PAGE), 'Description'),
    ).toInclude('Relayers fill user intents and are repaid later.')
  })

  it('points the live token and transfer tables to the HTML page', () => {
    const markdown = renderInteropProtocolMarkdown(PAGE)

    expect(getSection(markdown, 'Top tokens by volume')).toInclude(
      'https://l2beat.com/interop/protocols/across#interop-tokens',
    )
    expect(getSection(markdown, 'Transfers')).toInclude(
      'https://l2beat.com/interop/protocols/across#interop-transfers',
    )
  })
})

function getSection(markdown: string, heading: string) {
  const [, afterHeading] = markdown.split(`\n## ${heading}\n`)
  expect(afterHeading).not.toEqual(undefined)
  return (afterHeading ?? '').split('\n## ')[0] ?? ''
}

// An interop protocol page shaped like the one the HTML page renders: every
// section a protocol with transfers in the last 24h gets.

const CHAINS: InteropChainWithIcon[] = [
  chainWithIcon('ethereum', 'Ethereum'),
  chainWithIcon('arbitrum', 'Arbitrum One'),
  chainWithIcon('base', 'Base'),
]

function chainWithIcon(id: string, name: string): InteropChainWithIcon {
  return {
    id,
    name,
    type: 'evm',
    display: name,
    color: '#000000',
    explorerUrl: `https://${id}.example`,
    iconUrl: `/icons/${id}.png`,
  }
}

function chain(
  id: string,
  name: string,
  volume: number,
  transferCount: number,
): ChainData {
  return {
    id,
    name,
    iconUrl: `/icons/${id}.png`,
    volume,
    transferCount,
    avgDuration: null,
    avgValue: volume / transferCount,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    netMintedValue: undefined,
  }
}

function token(symbol: string, volume: number): TokenData {
  return {
    id: `${symbol.toLowerCase()}-id`,
    symbol,
    issuer: null,
    iconUrl: `/icons/${symbol.toLowerCase()}.png`,
    topProtocol: undefined,
    volume,
    transferCount: 1,
    avgDuration: null,
    avgValue: null,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    netMintedValue: undefined,
    flows: [],
  }
}

function bridgeType(volume: number) {
  return {
    volume,
    transferCount: 1,
    averageValue: null,
    tokens: { items: [], remainingCount: 0 },
    flows: [],
  }
}

const PROTOCOL: ProtocolEntry = {
  id: ProjectId('across'),
  slug: 'across',
  iconUrl: '/icons/across.png',
  name: 'Across',
  shortName: undefined,
  description: 'Across is an intent-based bridge.',
  type: 'intent',
  bridgeTypes: ['nonMinting', 'lockAndMint'],
  isAggregate: undefined,
  subgroup: undefined,
  volume: 1_500_000,
  tokens: {
    items: [
      token('USDC', 800_000),
      token('WETH', 500_000),
      token('USDT', 100_000),
    ],
    remainingCount: 12,
  },
  chains: {
    items: [
      chain('ethereum', 'Ethereum', 1_400_000, 1_100),
      chain('arbitrum', 'Arbitrum One', 1_100_000, 900),
      chain('base', 'Base', 50_000, 40),
    ],
    remainingCount: 2,
  },
  transferCount: 1_200,
  averageValue: 1_250,
  minTransferValueUsd: 1,
  maxTransferValueUsd: 250_000,
  averageDuration: { type: 'single', duration: 90 },
  byBridgeType: {
    nonMinting: {
      ...bridgeType(1_350_000),
      averageValueInFlight: undefined,
    },
    lockAndMint: {
      ...bridgeType(150_000),
      netMintedValue: undefined,
    },
    burnAndMint: undefined,
    unknown: undefined,
  },
  averageValueInFlight: undefined,
  netMintedValue: undefined,
  topRoute: undefined,
  snapshotTimestamp: 1_760_000_000,
  filterable: undefined,
}

const PROTOCOL_DATA: InteropProtocolDashboardData = {
  entry: PROTOCOL,
  flows: [],
  topPath: { chainA: 'ethereum', chainB: 'arbitrum', volume: 900_000 },
  transferSize: {
    name: 'Across',
    iconUrl: '/icons/across.png',
    countUnder100: 600,
    percentageUnder100: 50,
    count100To1K: 400,
    percentage100To1K: 33.33,
    count1KTo10K: 150,
    percentage1KTo10K: 12.5,
    count10KTo100K: 45,
    percentage10KTo100K: 3.75,
    countOver100K: 5,
    percentageOver100K: 0.42,
    minTransferValueUsd: 1,
    maxTransferValueUsd: 250_000,
    averageTransferSizeUsd: 1_250,
  },
  topToken: {
    id: 'usdc-id',
    symbol: 'USDC',
    issuer: 'Circle',
    iconUrl: '/icons/usdc.png',
    volume: 800_000,
    transferCount: 700,
  },
}

const API_SELECTION = { from: ['ethereum', 'arbitrum'], to: ['base'] }

const ENTRY: InteropProtocolEntry = {
  id: ProjectId('across'),
  name: 'Across',
  shortName: undefined,
  slug: 'across',
  icon: '/icons/across.png',
  underReviewStatus: undefined,
  header: {
    description: 'Across is an intent-based bridge.',
    detailedDescription: 'Relayers fill user intents and are repaid later.',
    recentUpdatesCount: 0,
    links: [],
  },
  sections: [
    {
      type: 'InteropVolumeSection',
      props: {
        id: 'interop-volume',
        title: 'Volume and flows',
        entry: PROTOCOL,
        interopChains: CHAINS,
        defaultSelectedChains: ['ethereum', 'arbitrum', 'base'],
        topRoutes: [
          { srcChain: 'ethereum', dstChain: 'arbitrum', volume: 700_000 },
          { srcChain: 'arbitrum', dstChain: 'ethereum', volume: 200_000 },
          { srcChain: 'base', dstChain: 'ethereum', volume: 50_000 },
        ],
      },
    },
    {
      type: 'DetailedDescriptionSection',
      props: {
        id: 'detailed-description',
        title: 'Description',
        description: 'Across is an intent-based bridge.',
        detailedDescription: 'Relayers fill user intents and are repaid later.',
      },
    },
    {
      type: 'InteropTokensSection',
      props: {
        id: 'interop-tokens',
        title: 'Top tokens by volume',
        projectId: ProjectId('across'),
        apiSelection: API_SELECTION,
      },
    },
    {
      type: 'InteropTransfersSection',
      props: {
        id: 'interop-transfers',
        title: 'Transfers',
        scope: { type: 'project', projectId: ProjectId('across') },
        apiSelection: API_SELECTION,
        snapshotTimestamp: 1_760_000_000,
        interopChains: CHAINS,
      },
    },
  ],
}

const PAGE: InteropProtocolPageContent = {
  projectEntry: ENTRY,
  protocolData: PROTOCOL_DATA,
}
