import { CoingeckoId, ProjectId } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { BaseProject } from '../../types'

export const agglayer: BaseProject = {
  id: ProjectId('agglayer'),
  slug: 'agglayer',
  name: 'Agglayer',
  shortName: undefined,
  addedAt: 1743677000,
  display: {
    description:
      'Agglayer is a cross-chain settlement layer that connects the liquidity and users of any blockchain for fast, low cost interoperability and growth.',
    links: {
      websites: ['https://www.agglayer.dev/'],
      bridges: ['https://portal.polygon.technology/bridge'],
      documentation: [
        'https://docs.agglayer.dev',
        'https://www.agglayer.dev/learn',
      ],
      explorers: ['https://visualizer.agglayer.dev/'],
      socialMedia: ['https://x.com/agglayer'],
    },
    badges: [BADGES.Stack.CDKErigon, BADGES.Infra.Agglayer],
  },
  colors: {
    primary: {
      light: '#6C00F6',
      dark: '#9655FF',
    },
    secondary: {
      light: '#6C51F4',
      dark: '#7046EB',
    },
  },
  milestones: [
    {
      title: 'Agglayer v0.3 goes live – Multichain support',
      url: 'https://x.com/Agglayer/status/1937204244559327391',
      date: '2025-06-23T00:00:00Z',
      description:
        'Agglayer v0.3 Is Live: Lays Groundwork for non-CDK Chains to Securely join Agglayer, starting with Polygon PoS',
      type: 'general',
    },
    {
      title: 'Agglayer Vault Bridge is available',
      url: 'https://x.com/Agglayer/status/1920489030497489127',
      date: '2025-05-08T00:00:00Z',
      description:
        'Vault Bridge leverages bridge deposits to provide chains a built-in revenue stream',
      type: 'general',
    },
    {
      title: 'Agglayer CDK goes Multistack',
      url: 'https://x.com/Agglayer/status/1920114795333759063',
      date: '2025-05-07T00:00:00Z',
      description:
        'Agglayer CDK (formerly Polygon CDK) goes multistack to unify Web3: Introducing the CDK OP Stack configuration, with native Agglayer connection',
      type: 'general',
    },
    {
      title: 'Agglayer v0.2 goes live – Pessimistic Proofs',
      url: 'https://www.agglayer.dev/blogs/major-development-upgrade-for-a-multistack-future-pessimistic-proofs-live-on-agglayer-mainnet',
      date: '2025-02-03T00:00:00Z',
      description:
        'Cross-chain interoperability gets hardened with pessimistic fallback protections, reducing risk in messaging and bridging.',
      type: 'general',
    },
    {
      title: 'Pessimistic Proof testnet goes live',
      url: 'https://x.com/0xPolygon/status/1869867180415730130',
      date: '2024-12-01T00:00:00Z',
      description:
        'Developers gain hands-on access to simulate cross-chain failover scenarios and test Agglayer’s fallback security model.',
      type: 'general',
    },
    {
      title: 'AUSD becomes Agglayer’s stablecoin',
      url: 'https://x.com/0xPolygon/status/1855975301215658214',
      date: '2024-11-11T00:00:00Z',
      description:
        'Agora introduces AUSD, a native, fungible stablecoin designed for seamless cross-chain movement.',
      type: 'general',
    },
    {
      title: 'AggSummit Bangkok',
      url: 'https://x.com/0xPolygon/status/1855846928183181669',
      date: '2024-11-10T00:00:00Z',
      description:
        'Flagship global ecosystem event highlighting builders, chains, and use cases for an aggregated future.',
      type: 'general',
    },
    {
      title: 'Pessimistic Proofs introduced',
      url: 'https://www.agglayer.dev/blogs/introducing-the-pessimistic-proof-for-agglayer-zk-security-for-cross-chain-interoperability',
      date: '2024-05-28T00:00:00Z',
      description:
        'Pessimistic Proofs formally introduced—adding ZK-backed fallback security to cross-chain messaging. SP1 to generate pessimistic proofs for Agglayer.',
      type: 'general',
    },
    {
      title: 'First ever Aggregation Day',
      url: 'https://x.com/i/broadcasts/1ZkKzjpmAAaKv',
      date: '2024-02-23T00:00:00Z',
      description:
        'A new community tradition: ecosystem alignment day featuring cross-chain dev updates, talks, and live demos.',
      type: 'general',
    },
    {
      title: 'Agglayer v0.1 goes live',
      url: 'https://x.com/0xPolygon/status/1763582539837370787',
      date: '2024-03-01T00:00:00Z',
      description:
        'Launch of the Unified Bridge. The first phase of aggregation begins.',
      type: 'general',
    },
    {
      title: 'Aggregated Thesis published',
      url: 'https://www.agglayer.dev/blogs/aggregated-blockchains-a-new-thesis',
      date: '2024-01-24T00:00:00Z',
      description:
        'Agglayer is introduced as a global settlement layer to bring crosschain unity to all blockchains.',
      type: 'general',
    },
  ],
  ecosystemConfig: {
    links: {
      buildOn: 'https://docs.agglayer.dev/',
      learnMore: 'https://www.agglayer.dev/learn',
      governanceDelegateToL2BEAT:
        'https://governance.polygon.technology/community-members/0x1B686eE8E31c5959D9F5BBd8122a58682788eeaD/',
      governanceProposals: 'https://governance.polygon.technology/proposals/',
    },
    firstBanner: {
      mainText: 'Build an Agglayer chain',
    },
    token: {
      coingeckoId: CoingeckoId('polygon-ecosystem-token'),
      description:
        'The POL token is used for governance across the Polygon ecosystem, including Polygon PoS and Agglayer chains. It also secures the Polygon PoS network and functions as a gas token on the chain.',
    },
  },
}
