import { formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CROP_NOTES } from '../../common/crops'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('uniswapv2')

const timelockDelayDays =
  discovery.getContractValue<number>('Timelock', 'delay') / 86400

// 18-decimals wei string -> whole UNI with thousands separators.
const formatUni = (amount: string): string =>
  (BigInt(amount) / 10n ** 18n).toLocaleString('en-US')

const protocolFeeOn =
  discovery.getContractValue<string>('UniswapV2Factory', 'feeTo') !==
  'eth:0x0000000000000000000000000000000000000000'

export const uniswapv2: BaseProject = {
  id: ProjectId('uniswapv2'),
  slug: 'uniswapv2',
  name: 'Uniswap V2',
  shortName: undefined,
  addedAt: UnixTime(1791504000), // 2026-10-09
  discoveryInfo: getDiscoveryInfo([discovery]),
  ossificationHistory: discovery.getOssificationHistory(),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description: `Uniswap v2 is a constant-product AMM where anyone can create an immutable, adminless pair for any two tokens. User funds sit only in the pairs, which no one can upgrade or pause, and every swap pays a 0.3% fee to liquidity providers. UNI tokenholder governance, acting through a ${timelockDelayDays}-day timelock, holds one power over v2: choosing the recipient of a protocol fee of 1/6 of LP fees, which ${protocolFeeOn ? 'is currently switched on' : 'is currently switched off'}.`,
    detailedDescription: readProjectMarkdown(
      'uniswapv2',
      'detailedDescription',
      {
        timelockDelayDays,
        protocolFeeStatus: protocolFeeOn ? 'switched on' : 'switched off',
        votingDelayBlocks: discovery
          .getContractValue<number>('GovernorBravo', 'votingDelay')
          .toLocaleString('en-US'),
        votingPeriodBlocks: discovery
          .getContractValue<number>('GovernorBravo', 'votingPeriod')
          .toLocaleString('en-US'),
        proposalThreshold: formatUni(
          discovery.getContractValue<string>(
            'GovernorBravo',
            'proposalThreshold',
          ),
        ),
        quorumVotes: formatUni(
          discovery.getContractValue<string>('GovernorBravo', 'quorumVotes'),
        ),
        uniMintCap: discovery.getContractValue<number>('UNIToken', 'mintCap'),
        uniMintInterval: formatSeconds(
          discovery.getContractValue<number>(
            'UNIToken',
            'minimumTimeBetweenMints',
          ),
          { fullUnit: true },
        ),
      },
    ),
    links: {
      websites: ['https://app.uniswap.org/'],
      documentation: ['https://docs.uniswap.org/contracts/v2/overview'],
      repositories: [
        'https://github.com/Uniswap/v2-core',
        'https://github.com/Uniswap/v2-periphery',
      ],
      socialMedia: ['https://x.com/Uniswap'],
    },
    references: [
      {
        title: 'Uniswap v2 Core Whitepaper',
        url: 'https://app.uniswap.org/whitepaper.pdf',
      },
      {
        title: 'UNIfication proposal (protocol fees & UNI burn)',
        url: 'https://vote.uniswapfoundation.org/proposals/93',
      },
    ],
    badges: [],
  },
  defiInfo: {
    category: 'DEX',
    tvl: {
      source: 'defillama',
      protocolSlug: 'uniswap-v2',
      sinceTimestamp: UnixTime(1588636800), // 2020-05-05
      chains: [{ chain: 'ethereum', providerChain: 'Ethereum' }],
    },
  },
  // Declared empty on purpose: v2 has no oracle, no bridge, no external
  // contract its operation depends on.
  externalDependencies: [],
  crops: {
    censorshipResistance: {
      sentiment: 'good',
      points: [
        CROP_NOTES.infiniteExitWindow,
        'Anyone can create a pair for any two tokens, and swapping or withdrawing liquidity needs no permission and passes through no operator.',
        `UNI tokenholder governance, acting through a ${timelockDelayDays}-day timelock, holds one power over v2: choosing the recipient of the protocol fee, which the code fixes at 1/6 of LP fees.`,
        'Governance cannot block a swap, freeze liquidity, or reach LP funds.',
        CROP_NOTES.passesWalkawayTest(
          'pairs keep working with the team, the interface and governance gone, and any contract can call them directly.',
        ),
      ],
      notReviewed: [
        'The interfaces users reach the pairs through, which sit outside them.',
      ],
    },
    openSource: {
      sentiment: 'good',
      license: 'GPL-3.0',
      points: [
        'The core, the periphery and the interface are published under the GPL.',
        'The contracts are verified onchain, and can be built and run locally alongside a self-hosted interface.',
      ],
    },
    privacy: {
      status: 'fullyTransparent',
      points: [
        'The protocol does not make privacy claims, and is fully transparent.',
        'Swaps and liquidity positions are public onchain.',
      ],
    },
    security: {
      sentiment: 'good',
      points: [
        'Every contract that holds user funds is immutable, with no upgrade path.',
        'No external dependency: no oracle, no bridge.',
        'The core has secured value at very high volume since 2020.',
      ],
      additionalConsiderations: [
        'Per-pair token and liquidity risk stays with the user.',
      ],
      notReviewed: [CROP_NOTES.notReviewed.circuitBreakers],
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
