import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('liquityv2')

// Each branch's collateral ratios and penalties live on its AddressesRegistry,
// already normalized to percentages by discovery (e.g. MCR "110"). wstETH and
// rETH share values, so one "LST" reading covers both.
const branchValue = (branch: string, key: string): string =>
  discovery.getContractValue<string>(`AddressesRegistry_${branch}`, key)

const collateralPools = [
  { contract: 'ActivePool_WETH', token: 'WETH' },
  { contract: 'DefaultPool_WETH', token: 'WETH' },
  { contract: 'ActivePool_wstETH', token: 'wstETH' },
  { contract: 'DefaultPool_wstETH', token: 'wstETH' },
  { contract: 'ActivePool_rETH', token: 'rETH' },
  { contract: 'DefaultPool_rETH', token: 'rETH' },
] as const

export const liquityv2: BaseProject = {
  id: ProjectId('liquityv2'),
  slug: 'liquityv2',
  name: 'Liquity V2 (BOLD)',
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
      'Liquity V2 is a borrowing protocol where users draw the BOLD stablecoin against ETH, wstETH, and rETH collateral at a user-set interest rate, each collateral held in its own isolated branch with a dedicated Stability Pool. Its contracts are immutable and adminless, so its trust surface comes from the external price feeds and collateral systems on which those branches depend.',
    detailedDescription: readProjectMarkdown(
      'liquityv2',
      'detailedDescription',
      {
        wethMcr: branchValue('WETH', 'MCR'),
        lstMcr: branchValue('wstETH', 'MCR'),
        wethCcr: branchValue('WETH', 'CCR'),
        lstCcr: branchValue('wstETH', 'CCR'),
        wethScr: branchValue('WETH', 'SCR'),
        lstScr: branchValue('wstETH', 'SCR'),
        bcr: branchValue('WETH', 'BCR'),
        spPenalty: branchValue('WETH', 'LIQUIDATION_PENALTY_SP'),
        wethRedistribution: branchValue(
          'WETH',
          'LIQUIDATION_PENALTY_REDISTRIBUTION',
        ),
        lstRedistribution: branchValue(
          'wstETH',
          'LIQUIDATION_PENALTY_REDISTRIBUTION',
        ),
        ethStaleness: discovery.getContractValue<string>(
          'RETHPriceFeed',
          'ethUsdStaleness',
        ),
        rethEthStaleness: discovery.getContractValue<string>(
          'RETHPriceFeed',
          'rEthEthStaleness',
        ),
      },
    ),
    links: {
      websites: ['https://www.liquity.org/'],
      documentation: ['https://docs.liquity.org/'],
      repositories: ['https://github.com/liquity/bold'],
      socialMedia: [
        'https://x.com/LiquityProtocol',
        'https://discord.com/invite/HFKpCdgQm6',
      ],
    },
    references: [
      {
        title: 'Liquity V2 Whitepaper',
        url: 'https://liquity.gitbook.io/v2-whitepaper',
      },
    ],
    badges: [],
  },
  escrows: collateralPools.map(({ contract, token }) =>
    discovery.getEscrowDetails({
      address: discovery.getContract(contract).address,
      tokens: [token],
    }),
  ),
  tvsInfo: {
    associatedTokens: [],
    warnings: [],
  },
  defiInfo: {
    category: 'Stablecoin',
  },
  externalDependencies: [
    {
      project: ProjectId('chainlink'),
      description:
        'Impact: Chainlink controls the market-price inputs used by every branch; a plausible wrong answer can cause unsafe borrowing, missed or wrongful liquidations, and incorrect redemptions, while a stale, non-positive, or reverting answer shuts affected branches down. Limitations: Liquity applies input-specific staleness checks, LST cross-checks, and shutdown fallbacks, but these do not fully prevent the impacts above. The exact Chainlink admin and signer-quorum paths are analyzed in Permissions below.',
    },
    {
      name: 'Rocket Pool rETH',
      icon: 'reth',
      description:
        "Impact: Rocket Pool is treated as a black box. If rETH loses its backing or becomes inaccessible, the rETH branch can accrue bad debt; a wrong canonical rETH/ETH rate can underprice collateral, and a reverting or non-positive rate shuts the branch down. Limitations and remaining protections: Liquity isolates rETH in its own branch, caps upward market-feed manipulation by using the lower of Chainlink's rETH/ETH price and the canonical rate, and retains closure, claims, and Stability Pool withdrawals after shutdown. These mechanisms cannot restore value to failed rETH collateral.",
    },
    {
      name: 'Lido wstETH',
      icon: 'wsteth',
      description:
        'Impact: Lido is treated as a black box. If wstETH loses its backing or becomes inaccessible, the wstETH branch can accrue bad debt; a wrong canonical wstETH/stETH rate directly misprices collateral, and a reverting or non-positive rate shuts the branch down. Limitations and remaining protections: Liquity isolates wstETH in its own branch and retains closure, claims, and Stability Pool withdrawals after shutdown, but it has no independent source with which to validate the canonical rate or restore value to failed wstETH collateral.',
    },
  ],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
