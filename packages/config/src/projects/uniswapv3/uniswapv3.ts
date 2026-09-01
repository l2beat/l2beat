import { formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('uniswapv3')

// Pool fees are in hundredths of a basis point (1e-6), e.g. 500 -> "0.05%".
const formatFeeTier = (fee: number): string => `${fee / 10000}%`

// Enabled fee tiers as tracked by the V3OpenFeeAdapter (the factory owner),
// e.g. [100, 500, 3000, 10000] -> "0.01%, 0.05%, 0.3%, and 1%".
const feeTiers = discovery.getContractValue<number[]>(
  'V3OpenFeeAdapter',
  'feeTiers',
)
const feeTierList = feeTiers
  .map(formatFeeTier)
  .map((s, i, arr) => (i === arr.length - 1 ? `and ${s}` : s))
  .join(', ')

// 18-decimals wei string -> whole UNI with thousands separators.
const formatUni = (amount: string): string =>
  (BigInt(amount) / 10n ** 18n).toLocaleString('en-US')

const poolValue = (pool: string, key: string): number =>
  discovery.getContractValue<number>(pool, key)

// Packed protocol-fee values contain two 4-bit denominators (token0 in the low
// nibble, token1 in the high one), each 0 or 4..10. The prose assumes the two
// sides match; fail loudly rather than silently misdescribe a future schedule.
const formatProtocolFee = (packed: number): string => {
  const token0Side = packed % 16
  const token1Side = Math.floor(packed / 16)
  if (token0Side !== token1Side) {
    throw new Error(
      `Asymmetric protocol fee ${packed}: update the description wording`,
    )
  }
  if (token0Side === 0) {
    return 'off'
  }
  if (token0Side < 4 || token0Side > 10) {
    throw new Error(
      `Invalid protocol fee ${packed}: update the description wording`,
    )
  }
  return `1/${token0Side} of LP fees per side`
}
const zeroFeeSentinel = discovery.getContractValue<number>(
  'V3OpenFeeAdapter',
  'ZERO_FEE_SENTINEL',
)
const decodeAdapterStoredFee = (stored: number): number =>
  stored === zeroFeeSentinel ? 0 : stored

const timelockDelayDays =
  discovery.getContractValue<number>('Timelock', 'delay') / 86400

export const uniswapv3: BaseProject = {
  id: ProjectId('uniswapv3'),
  slug: 'uniswapv3',
  name: 'Uniswap V3',
  shortName: undefined,
  addedAt: UnixTime(0),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description: `Uniswap v3 is a concentrated-liquidity AMM where anyone can deploy an immutable, adminless pool for any token pair at an enabled fee tier. User funds sit only in the pools, which no one can upgrade or pause. UNI tokenholder governance, acting through a ${timelockDelayDays}-day timelock, holds two bounded control powers over v3 pools: enabling new fee tiers and setting a protocol fee capped at 1/4 of LP fees per side. Under the current UNIfication configuration, collected protocol fees are exchanged by the Firepit for UNI sent permanently to 0xdead; governance can change this disposal path after the timelock.`,
    detailedDescription: readProjectMarkdown(
      'uniswapv3',
      'detailedDescription',
      {
        feeTierCount: feeTiers.length,
        feeTierList,
        usdcWethFee: formatFeeTier(
          poolValue('UniswapV3Pool_USDC_WETH_005', 'fee'),
        ),
        usdcWethTickSpacing: poolValue(
          'UniswapV3Pool_USDC_WETH_005',
          'tickSpacing',
        ),
        wbtcWethFee: formatFeeTier(
          poolValue('UniswapV3Pool_WBTC_WETH_03', 'fee'),
        ),
        wbtcWethTickSpacing: poolValue(
          'UniswapV3Pool_WBTC_WETH_03',
          'tickSpacing',
        ),
        timelockDelayDays,
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
        defaultProtocolFee: formatProtocolFee(
          decodeAdapterStoredFee(
            discovery.getContractValue<number>(
              'V3OpenFeeAdapter',
              'defaultFee',
            ),
          ),
        ),
        tier03ProtocolFee: formatProtocolFee(
          discovery.getContractValue<number>(
            'V3OpenFeeAdapter',
            'tier03DefaultFee',
          ),
        ),
      },
    ),
    links: {
      websites: ['https://app.uniswap.org/'],
      documentation: ['https://docs.uniswap.org/contracts/v3/overview'],
      repositories: ['https://github.com/Uniswap/v3-core'],
      socialMedia: ['https://x.com/Uniswap'],
    },
    references: [
      {
        title: 'Uniswap v3 Core Whitepaper',
        url: 'https://app.uniswap.org/whitepaper-v3.pdf',
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
  },
  // Declared empty on purpose: v3 has no oracle, no bridge, no external
  // contract its operation depends on. The section renders an explicit
  // "none" message instead of being omitted.
  externalDependencies: [],
  crops: {
    censorshipResistance: {
      sentiment: 'good',
      points: [
        'Pools are immutable and adminless: nothing can be paused or upgraded.',
        'Anyone can deploy a pool for any token pair at an enabled fee tier, and swapping or withdrawing liquidity needs no permission and passes through no operator.',
        'UNI tokenholder governance, acting through a 2d timelock, holds only two bounded powers over v3 pools: enabling new fee tiers, and setting a protocol fee capped at 1/4 of LP fees per side.',
        'Governance cannot block a swap, freeze a position, or reach LP funds.',
      ],
      notReviewed: [
        'The routers and interfaces users actually reach the pools through, which sit outside them.',
      ],
    },
    openSource: {
      sentiment: 'good',
      license: 'GPL-2.0',
      points: [
        'The GPL covers both the v3 core and the periphery - the business-source grant on the core expired in 2023.',
        'The contracts are verified onchain, and can be built and run locally alongside a self-hosted interface.',
      ],
    },
    privacy: {
      status: 'fullyTransparent',
      points: [
        'The protocol does not make privacy claims, and is fully transparent.',
        'Swaps and positions are public onchain.',
      ],
    },
    security: {
      sentiment: 'good',
      points: [
        'Every contract that holds or routes user funds is immutable, with no upgrade path.',
        'No external dependency - no oracle, no bridge.',
        'The core has been battle-tested at very high volume since 2021.',
      ],
      missing: [
        'A governance-set protocol fee remains: currently 1/4 of LP fees per side, 1/6 on the 0.3% tier, with proceeds burned as UNI through the Firepit.',
        'Per-pool token and liquidity risk stays with the user.',
      ],
      notReviewed: [
        'The router and approval contracts that sit outside the pools, which are assessed separately.',
        'Circuit breakers and rate limits.',
      ],
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
