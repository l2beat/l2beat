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

// Packed protocol-fee values: two 4-bit denominators (token0 in the low
// nibble, token1 in the high one), each 0 or 4..10. All current values are
// symmetric; the guard forces a description update if that ever changes.
const protocolFeeDenominator = (packed: number): number => {
  const token0Side = packed % 16
  const token1Side = Math.floor(packed / 16)
  if (token0Side !== token1Side) {
    throw new Error(
      `Asymmetric protocol fee ${packed}: update the description wording`,
    )
  }
  return token0Side
}
const poolProtocolFeeDenominator = (pool: string): number =>
  protocolFeeDenominator(
    discovery.getContractValue<{ feeProtocol: number }>(pool, 'slot0')
      .feeProtocol,
  )

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
    description: `Uniswap v3 is a concentrated-liquidity AMM where anyone can deploy an immutable, adminless pool for any token pair at an enabled fee tier. User funds sit only in the pools, which no one can upgrade or pause. UNI tokenholder governance, acting through a ${timelockDelayDays}-day timelock, holds two bounded control powers over v3 pools: enabling new fee tiers and setting a protocol fee capped at 1/4 of LP fees per side. Since the UNIfication proposal, collected protocol fees flow through the V3OpenFeeAdapter into the TokenJar and are exchanged by the Firepit for UNI sent permanently to 0xdead.`,
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
        defaultProtocolFeeDenominator: protocolFeeDenominator(
          discovery.getContractValue<number>('V3OpenFeeAdapter', 'defaultFee'),
        ),
        tier03ProtocolFeeDenominator: poolProtocolFeeDenominator(
          'UniswapV3Pool_WBTC_WETH_03',
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
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
