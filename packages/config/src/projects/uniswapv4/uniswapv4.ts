import { formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('uniswapv4')

// Protocol fees are in hundredths of a basis point (pips) per swap direction,
// hard-capped by pool-manager code at 1000 pips = 0.1%.
const MAX_PROTOCOL_FEE_PIPS = 1000
const formatPips = (pips: number): string => `${pips / 10000}%`

// 18-decimals wei string -> whole UNI with thousands separators.
const formatUni = (amount: string): string =>
  (BigInt(amount) / 10n ** 18n).toLocaleString('en-US')

// Piecewise-linear schedule for hookless pools: buckets ascend by LP-fee
// floor; within a bucket the per-direction fee is
// alphaPips + betaPips * (lpFee - lpFeeFloor) / 1e6.
type FeeBucket = { lpFeeFloor: number; alphaPips: number; betaPips: number }
const feeBuckets = discovery.getContractValue<FeeBucket[]>(
  'V4FeePolicy',
  'feeBucket',
)
const bucketFee = (lpFee: number): number => {
  const bucket = feeBuckets.filter((b) => b.lpFeeFloor <= lpFee).at(-1)
  if (bucket === undefined) {
    throw new Error(`No fee bucket covers LP fee ${lpFee}`)
  }
  const fee =
    bucket.alphaPips + (bucket.betaPips * (lpFee - bucket.lpFeeFloor)) / 1e6
  return Math.min(Math.floor(fee), MAX_PROTOCOL_FEE_PIPS)
}
// LP fee (pips) from which the schedule saturates at the 0.1% cap. The prose
// assumes a saturating schedule; fail loudly if governance flattens it.
const saturationBucket = feeBuckets.find(
  (b) => b.alphaPips >= MAX_PROTOCOL_FEE_PIPS,
)
if (saturationBucket === undefined) {
  throw new Error('Fee schedule no longer saturates: update the description')
}

// The prose claims hooked pools currently pay no protocol fee by default.
// That holds only while the unclassified default is zero and hooked pools are
// excluded from the bucket schedule; fail loudly rather than misdescribe.
const defaultFee = discovery.getContractValue<number>(
  'V4FeePolicy',
  'defaultFee',
)
const hookedNativeMathFeeOn = discovery.getContractValue<boolean>(
  'V4FeePolicy',
  'isHookedNativeMathFeeOn',
)
if (defaultFee !== 0 || hookedNativeMathFeeOn) {
  throw new Error(
    'Hooked pools are no longer fee-free by default: update the description',
  )
}

const timelockDelayDays =
  discovery.getContractValue<number>('Timelock', 'delay') / 86400

export const uniswapv4: BaseProject = {
  id: ProjectId('uniswapv4'),
  slug: 'uniswapv4',
  name: 'Uniswap V4',
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
    description: `Uniswap v4 is a concentrated-liquidity AMM where all pools live inside a single immutable contract and anyone can create a pool for any token pair with any fee, optionally attaching a hook: an external contract that customizes the pool's behavior. Hookless pools have no admin, no pause switch, and no upgrade path; hooked pools additionally trust their hook's code and controller. UNI tokenholder governance, acting through a ${timelockDelayDays}-day timelock, holds one bounded power over pools: a protocol fee on swaps hard-capped at 0.1% per direction. Under the current UNIfication configuration, collected protocol fees are exchanged by the Firepit for UNI sent permanently to 0xdead; governance can change this disposal path after the timelock.`,
    detailedDescription: readProjectMarkdown(
      'uniswapv4',
      'detailedDescription',
      {
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
        feeExample005: formatPips(bucketFee(500)),
        feeExample03: formatPips(bucketFee(3000)),
        feeSaturationTier: formatPips(saturationBucket.lpFeeFloor),
        hookedPoolFee: 'no protocol fee',
      },
    ),
    links: {
      websites: ['https://app.uniswap.org/'],
      documentation: ['https://docs.uniswap.org/contracts/v4/overview'],
      repositories: ['https://github.com/Uniswap/v4-core'],
      socialMedia: ['https://x.com/Uniswap'],
    },
    references: [
      {
        title: 'Uniswap v4 Core Whitepaper',
        url: 'https://app.uniswap.org/whitepaper-v4.pdf',
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
      protocolSlug: 'uniswap-v4',
      sinceTimestamp: UnixTime(1738108800),
      chains: [{ chain: 'ethereum', providerChain: 'Ethereum' }],
    },
  },
  // Declared empty on purpose: the v4 core has no oracle, no bridge, no
  // external contract its operation depends on. Hooks are per-pool opt-ins
  // chosen by pool creators, not protocol-level dependencies. The section
  // renders an explicit "none" message instead of being omitted.
  externalDependencies: [],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
