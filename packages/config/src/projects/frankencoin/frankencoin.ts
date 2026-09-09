import { formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('frankencoin')

// Interest rates are stored in parts per million, e.g. 35000 -> "3.5".
// The leadrate positions pay comes from the original savings module
// (SavingsV2); the current Savings module pays its own, separately
// governed rate to savers (including the svZCHF vault).
const ratePercent = (contract: string): string =>
  `${discovery.getContractValue<number>(contract, 'currentRatePPM') / 10000}`

// 18-decimals wei string -> whole ZCHF with thousands separators.
const zchfAmount = (contract: string, key: string): string =>
  (
    BigInt(discovery.getContractValue<string>(contract, key)) /
    10n ** 18n
  ).toLocaleString('en-US')

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
    description:
      'Frankencoin is an oracle-free stablecoin protocol issuing ZCHF, a token tracking the Swiss franc. All contracts are immutable and configs are dao-governed: ZCHF supply is controlled only by minter modules that anyone can propose and that qualified FPS pool share holders (2% of time-weighted votes) can veto during a public application period. All protocol fees and interest accrue to an equity reserve that anyone can invest in by minting FPS shares, and that absorbs losses before ZCHF holders are affected. Collateralized minting is policed by permissionless auctions instead of price oracles, and savers earn a governance-set rate directly or through the immutable svZCHF vault.',
    detailedDescription: readProjectMarkdown(
      'frankencoin',
      'detailedDescription',
      {
        leadrate: ratePercent('SavingsV2'),
        savingsRate: ratePercent('Savings'),
        minterFee: zchfAmount('Frankencoin', 'MIN_FEE'),
        minApplicationPeriod: formatSeconds(
          discovery.getContractValue<number>(
            'Frankencoin',
            'MIN_APPLICATION_PERIOD',
          ),
          { fullUnit: true },
        ),
        openingFee: zchfAmount('MintingHubV2', 'OPENING_FEE'),
        challengerReward: `${
          discovery.getContractValue<number>(
            'MintingHubV2',
            'CHALLENGER_REWARD',
          ) / 10000
        }`,
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
        'Chainlink CCIP bridges ZCHF to other chains through a token pool that is a registered minter. A CCIP compromise could mint unbacked ZCHF on Ethereum, bounded by the governance-set per-chain rate limits.',
    },
    {
      type: 'not-tracked',
      name: 'AllUnity CHF (CHFAU)',
      icon: 'chfau',
      description:
        'ZCHF can be minted 1:1 against the centrally issued CHFAU stablecoin through a bridge capped at 10M ZCHF (expiring April 2027). A depeg or freeze of CHFAU impairs ZCHF backing up to that cap.',
    },
  ],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
