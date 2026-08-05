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
    description: `Polymarket is a prediction market where users trade outcome shares backed one-for-one by collateral: a complete set of a market's outcomes always redeems for one unit, and resolution decides how that unit is split between them. Orders are matched off-chain by a permissioned operator and settled on-chain by exchange contracts that check every order's signature. Collateral is a wrapped stablecoin held in a protocol-controlled vault, and outcomes are reported by an UMA optimistic oracle.`,
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
  // Both the bridged and the native stablecoin are registered under the
  // symbol USDC on this chain, so one entry covers both; empty balances are
  // dropped when the value config is generated.
  // The three pools that hold user collateral are disjoint, so summing them
  // does not double count: wrapping parks the underlying in the vault, and
  // splitting into outcome shares moves it back out of the vault into either
  // the outcome-token ledger (binary markets) or the wrapper that backs
  // multi-outcome positions. The circulating collateral token is therefore
  // exactly the vault balance and is deliberately not counted on top.
  escrows: [
    discovery.getEscrowDetails({
      address: discovery.getContract('CollateralVault').address,
      tokens: ['USDC'],
      description:
        'Holds the stablecoin backing every unit of the collateral token that has not been converted into outcome shares.',
    }),
    discovery.getEscrowDetails({
      address: discovery.getContract('ConditionalTokens').address,
      tokens: ['USDC'],
      description:
        'Holds the collateral locked behind outcome shares of binary markets.',
    }),
    discovery.getEscrowDetails({
      address: discovery.getContract('WrappedCollateral').address,
      tokens: ['USDC'],
      description:
        'Holds the collateral locked behind outcome shares of multi-outcome markets.',
    }),
  ],
  tvsInfo: {
    associatedTokens: [],
    warnings: [
      {
        sentiment: 'warning',
        value:
          'The outcome-token ledger is shared infrastructure, so its balance can include markets run by other protocols.',
      },
    ],
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
      project: ProjectId('polygon-pos'),
      description:
        'Its bridge mints the stablecoin that backs essentially all of the collateral token. The bridge contract holding the depositor role can mint that stablecoin without a corresponding deposit, and the token’s proxy admin, also controlled from this chain’s governance, can replace its implementation, which would allow the freeze and pause powers that are currently unset to be reinstated.',
    },
    {
      name: 'Circle',
      icon: 'usdc',
      description:
        'Issues the reserves held on the token’s home chain that give the bridged stablecoin its value, so a depeg or an action against the escrow there devalues the collateral. Circle holds no role on the bridged token itself: its blacklister, pauser and rescuer roles are empty and there is no admin able to repopulate them.',
    },
  ],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [
      {
        category: 'Funds can be stolen if',
        text: `the ${adminSafe} multisig upgrades the collateral token, its vault or the combination-market contracts after the ${timelockDelay} timelock, since the vault can be made to execute any call on the stablecoin backing every balance.`,
        isCritical: true,
      },
      {
        category: 'Funds can be stolen if',
        text: `the collateral token's owner, the timelock, grants the minter role to an address of its choosing after the ${timelockDelay} delay, since a minter can create units that no deposit backs and redeem them against the vault. The role is held today only by the outcome modules.`,
      },
      {
        category: 'Funds can be frozen if',
        text: 'the admins pause either collateral ramp, which takes effect immediately and with no timelock and blocks redemption of the collateral token back into the underlying stablecoin.',
      },
      {
        category: 'Funds can lose value if',
        text: `the admins impose an outcome on a market instead of the oracle: after ${adapterSafetyPeriod} on binary markets, and with ${negRiskOperatorDelay} on multi-outcome markets, where flagging a market and forcing its result can happen in a single transaction.`,
        isCritical: true,
      },
      {
        category: 'Funds can lose value if',
        text: 'the permissioned oracle stalls, since settlement requires a resolver role and a proposal never becomes final on its own, leaving positions unredeemable.',
      },
    ],
  },
}
