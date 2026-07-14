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
      'Liquity V2 is a borrowing protocol where users draw the BOLD stablecoin against ETH, wstETH, and rETH collateral at a user-set interest rate, each collateral held in its own isolated branch with a dedicated Stability Pool. Its contracts are immutable and adminless, so the protocol adds no trust assumptions of its own; the only one it carries is the externally controlled Chainlink price feed that each branch relies on to value its collateral.',
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
        'Supplies the price feeds each branch reads to value its ETH, wstETH, or rETH collateral. A stale, zero, or reverting feed shuts that branch down.',
    },
    {
      name: 'Rocket Pool rETH',
      icon: 'reth',
      description:
        "The rETH branch values its collateral partly from the rETH-to-ETH exchange rate reported by Rocket Pool's rETH token. A wrong rate misprices the branch, and a failing one shuts it down.",
    },
    {
      name: 'Lido wstETH',
      icon: 'wsteth',
      description:
        "The wstETH branch values its collateral from Lido's wstETH-to-stETH exchange rate reported by the wstETH token. A wrong rate misprices the branch, and a failing one shuts it down.",
    },
  ],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
