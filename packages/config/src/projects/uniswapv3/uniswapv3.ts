import { ProjectId, UnixTime } from '@l2beat/shared-pure'
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

// Packed protocol-fee value on the adapter: two 4-bit denominators
// (token0 in the low nibble, token1 in the high one), each 0 or 4..10.
// Both sides are currently set to the same denominator.
const protocolFeeDenominator =
  discovery.getContractValue<number>('V3OpenFeeAdapter', 'defaultFee') % 16

const trackedPools = [
  { contract: 'UniswapV3Pool_USDC_WETH_005', tokens: ['USDC', 'WETH'] },
  { contract: 'UniswapV3Pool_WBTC_WETH_03', tokens: ['WBTC', 'WETH'] },
] as const

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
    description:
      'Uniswap v3 is a concentrated-liquidity AMM where anyone can deploy an immutable, adminless pool for any token pair at an enabled fee tier. User funds sit only in the pools, which no one can upgrade or pause. UNI tokenholder governance, acting through a 2-day timelock, holds two bounded powers over the system: enabling new fee tiers and setting a protocol fee capped at 1/4 of LP fees per side, which since the UNIfication proposal flows through the V3OpenFeeAdapter into the TokenJar and is exchanged by the Firepit for burned UNI.',
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
        timelockDelayDays:
          discovery.getContractValue<number>('Timelock', 'delay') / 86400,
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
        mintIntervalDays:
          discovery.getContractValue<number>(
            'UNIToken',
            'minimumTimeBetweenMints',
          ) / 86400,
        protocolFeeDenominator,
        firepitMaxAssets: discovery.getContractValue<number>(
          'Firepit',
          'MAX_RELEASE_LENGTH',
        ),
        firepitThreshold: formatUni(
          discovery.getContractValue<string>('Firepit', 'threshold'),
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
  escrows: trackedPools.map(({ contract, tokens }) =>
    discovery.getEscrowDetails({
      address: discovery.getContract(contract).address,
      tokens: [...tokens],
    }),
  ),
  tvsInfo: {
    associatedTokens: [],
    warnings: [
      {
        value:
          'Only two representative pools (USDC/WETH 0.05% and WBTC/WETH 0.3%) are tracked, so this figure is a small sample of Uniswap v3’s total value.',
        sentiment: 'warning',
      },
    ],
  },
  defiInfo: {
    category: 'DEX',
  },
  externalDependencies: [
    {
      name: 'WETH9',
      icon: 'weth',
      description:
        'The canonical, immutable wrapped-ETH contract that the periphery (SwapRouter, SwapRouter02, NonfungiblePositionManager, UniversalRouter) uses to wrap and unwrap ETH for swaps and liquidity operations. The core pools have no dependency on it: a WETH9 failure would break native-ETH handling in the periphery and devalue WETH held as an ordinary pool token, but pools not paired with WETH would be unaffected.',
    },
  ],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
