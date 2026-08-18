import { formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('frankencoin')

// 18-decimals wei string -> whole ZCHF with thousands separators.
const formatZchf = (amount: string): string =>
  (BigInt(amount) / 10n ** 18n).toLocaleString('en-US')

// Interest rates are stored in parts per million, e.g. 35000 -> "3.5".
const formatPpmRate = (ppm: number): string => `${ppm / 10000}`

// The leadrate that MintingHubV2 positions pay comes from the original
// savings module (SavingsV2); the current Savings module pays its own,
// separately governed rate to savers (including the svZCHF vault).
const leadratePpm = discovery.getContractValue<number>(
  'SavingsV2',
  'currentRatePPM',
)
const savingsRatePpm = discovery.getContractValue<number>(
  'Savings',
  'currentRatePPM',
)

// Equity stores the minimum FPS holding duration left-shifted by 20 bits of
// sub-second time resolution; unshift to get plain seconds (90 days).
const minHoldingDurationSeconds = Number(
  BigInt(
    discovery.getContractValue<string>('Equity', 'MIN_HOLDING_DURATION'),
  ) >> 20n,
)

export const frankencoin: BaseProject = {
  id: ProjectId('frankencoin'),
  slug: 'frankencoin',
  name: 'Frankencoin',
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
    description: `Frankencoin is an oracle-free stablecoin protocol issuing ZCHF, a token tracking the Swiss franc. ZCHF is minted against arbitrary ERC20 collateral in auction-policed positions, 1:1 against whitelisted CHF stablecoins, and by cross-chain modules, with all supply changes going through 'minter' modules that anyone can propose and qualified FPS pool share holders (2% of time-weighted votes) can veto. All contracts are immutable with no admin keys: governance consists solely of such quorum-gated vetoes and delayed proposals. Savers earn a governance-set interest rate (currently ${formatPpmRate(savingsRatePpm)}%) on deposited ZCHF, either directly in the Savings module or through the immutable svZCHF ERC4626 vault that auto-compounds it.`,
    detailedDescription: readProjectMarkdown(
      'frankencoin',
      'detailedDescription',
      {
        minFee: formatZchf(
          discovery.getContractValue<string>('Frankencoin', 'MIN_FEE'),
        ),
        minApplicationPeriod: formatSeconds(
          discovery.getContractValue<number>(
            'Frankencoin',
            'MIN_APPLICATION_PERIOD',
          ),
          { fullUnit: true },
        ),
        openingFee: formatZchf(
          discovery.getContractValue<string>('MintingHubV2', 'OPENING_FEE'),
        ),
        challengerReward: formatPpmRate(
          discovery.getContractValue<number>(
            'MintingHubV2',
            'CHALLENGER_REWARD',
          ),
        ),
        leadrate: formatPpmRate(leadratePpm),
        savingsRate: formatPpmRate(savingsRatePpm),
        valuationFactor: discovery.getContractValue<number>(
          'Equity',
          'VALUATION_FACTOR',
        ),
        minHoldingDuration: formatSeconds(minHoldingDurationSeconds, {
          fullUnit: true,
        }),
      },
    ),
    links: {
      websites: ['https://frankencoin.com/', 'https://app.frankencoin.com/'],
      documentation: ['https://docs.frankencoin.com/'],
      repositories: ['https://github.com/Frankencoin-ZCHF/FrankenCoin'],
      socialMedia: [
        'https://x.com/frankencoinzchf',
        'https://t.me/frankencoinzchf',
      ],
    },
    references: [
      {
        title: 'Frankencoin Research Paper (UZH)',
        url: 'https://www.zora.uzh.ch/entities/publication/b1bff836-6852-457d-93e6-496807db37fa',
      },
    ],
    badges: [],
  },
  defiInfo: {
    category: 'Stablecoin',
  },
  externalDependencies: [
    {
      type: 'tracked',
      projectId: ProjectId('ccip'),
      description:
        'Chainlink CCIP bridges ZCHF to other chains through a BurnMintTokenPool that is a registered minter, and carries the leadrate, governance-vote, and profit/loss settlement messages between deployments. A CCIP compromise could mint unbacked ZCHF on Ethereum through the token pool, bounded by the governance-set per-chain rate limits.',
    },
  ],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
