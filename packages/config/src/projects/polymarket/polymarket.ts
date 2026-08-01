import {
  ChainSpecificAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('polymarket')

const formatDelay = (seconds: number): string =>
  seconds === 0 ? 'no delay' : formatSeconds(seconds, { fullUnit: true })

// "12 hours" -> "12-hour", so a delay can be used as an adjective in prose.
const asAdjective = (delay: string): string =>
  delay.replace(/^(\d+) (\w+?)s?$/, '$1-$2')

// "3 of 6 (50%)" -> "3/6", so the prose stays readable if the Safe is resized.
const multisigRatio = (contract: string): string => {
  const threshold = discovery.getContractValue<string>(
    contract,
    'multisigThreshold',
  )
  const match = /^(\d+) of (\d+)/.exec(threshold)
  if (!match) {
    throw new Error(`Unexpected multisigThreshold "${threshold}"`)
  }
  return `${match[1]}/${match[2]}`
}

const adminSafe = multisigRatio('AdminSafe')

const timelockDelay = formatDelay(
  discovery.getContractValue<number>('Timelock', 'minDelay'),
)

// Emergency-resolution windows. The binary and neg-risk adapters share a
// constant; the operator that fronts multi-outcome markets has its own.
const adapterSafetyPeriod = formatDelay(
  discovery.getContractValue<number>('UmaCtfAdapterBinary', 'SAFETY_PERIOD'),
)
const negRiskOperatorDelay = formatDelay(
  discovery.getContractValue<number>('NegRiskOperator', 'DELAY_PERIOD'),
)

export const polymarket: BaseProject = {
  id: ProjectId('polymarket'),
  slug: 'polymarket',
  name: 'Polymarket',
  shortName: undefined,
  addedAt: UnixTime(0),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    // Smart account with admin on the multi-outcome operator (zero-delay
    // outcome override) and roles on the outcome modules; its code is not
    // verified on the explorer.
    unverifiedContracts: [
      ChainSpecificAddress('matic:0xAC9930b2AE455a671b62dE86876A7e8587825294'),
    ],
  },
  display: {
    description: `Polymarket is a prediction market where users trade outcome shares backed one-for-one by collateral: a complete set of a market's outcomes always redeems for one unit, and resolution decides how that unit is split between them. Orders are matched off-chain by a permissioned operator and settled on-chain by exchange contracts that check every order's signature, so the operator cannot invent a trade — but it does choose the fee charged on each fill, which is not part of what the user signs and is capped only by a rate the admins set, so the all-in price can be worse than the signed limit. Collateral is a wrapped stablecoin whose backing sits in a vault the protocol controls. Outcomes come from an UMA optimistic oracle, but adapter admins can override any market: after a ${asAdjective(adapterSafetyPeriod)} safety period on binary markets, and with ${negRiskOperatorDelay} on multi-outcome ones. A ${adminSafe} multisig holds most admin roles, alongside a few operational addresses including an EOA on the multi-outcome operator, and through a ${asAdjective(timelockDelay)} timelock it can upgrade the collateral, wallet and combination-market contracts.`,
    detailedDescription: readProjectMarkdown(
      'polymarket',
      'detailedDescription',
      {
        adminSafe,
        timelockDelay,
        adapterSafetyPeriod,
        legacyAdapterSafetyPeriod: formatDelay(
          discovery.getContractValue<number>(
            'UmaCtfAdapterLegacy',
            'emergencySafetyPeriod',
          ),
        ),
        negRiskOperatorDelay,
        oracleLiveness: formatDelay(
          discovery.getContractValue<number>(
            'ManagedOptimisticOracleV2',
            'defaultLiveness',
          ),
        ),
        oracleDisputeWindow: formatDelay(
          discovery.getContractValue<number>(
            'ManagedOptimisticOracleV2',
            'minimumDisputeWindow',
          ),
        ),
        collateralSymbol: discovery.getContractValue<string>(
          'CollateralToken',
          'symbol',
        ),
        userPauseBlocks: discovery.getContractValue<number>(
          'CTFExchange',
          'userPauseBlockInterval',
        ),
        walletPauseDelay: formatDelay(
          discovery.getContractValue<number>(
            'DepositWalletFactory',
            'timelockDelay',
          ),
        ),
      },
    ),
    links: {
      websites: ['https://polymarket.com/'],
      documentation: ['https://docs.polymarket.com/'],
      repositories: ['https://github.com/Polymarket'],
      socialMedia: ['https://x.com/Polymarket'],
    },
    references: [
      {
        title: 'Contract addresses - Polymarket documentation',
        url: 'https://docs.polymarket.com/resources/contracts',
      },
      {
        title: 'Market resolution - Polymarket documentation',
        url: 'https://docs.polymarket.com/concepts/resolution',
      },
    ],
    badges: [],
  },
  defiInfo: {
    category: 'Prediction market',
  },
  externalDependencies: [
    {
      name: 'UMA',
      icon: 'uma',
      description:
        'Supplies the optimistic oracle that answers each market question. Proposals and disputes are bonded and settlement is performed by permissioned resolvers, so a stalled or captured oracle leaves markets unresolved or resolves them wrongly.',
    },
    {
      name: 'Circle USDC',
      icon: 'usdc',
      description:
        'Backs the collateral token one-for-one. Issuer freeze powers over the vault, or over a user address, would block wrapping and redemption of the affected balance.',
    },
  ],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
