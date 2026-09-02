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

const formatBasisPoints = (basisPoints: number): string =>
  `${basisPoints / 100}%`

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

// The Safe that owns and can upgrade the managed oracle; its two owners are
// the AdminSafe and the oracle operators' Safe, so both must sign.
const oracleUpgradeSafe = multisigRatio('SafeL2')

const timelockDelay = formatDelay(
  discovery.getContractValue<number>('Timelock', 'minDelay'),
)

const ctfExchangeMaxFeeRate = discovery.getContractValue<number>(
  'CTFExchange',
  'getMaxFeeRate',
)
const negRiskCtfExchangeMaxFeeRate = discovery.getContractValue<number>(
  'NegRiskCtfExchange',
  'getMaxFeeRate',
)
if (ctfExchangeMaxFeeRate !== negRiskCtfExchangeMaxFeeRate) {
  throw new Error('The two CTF exchanges have different maximum fee rates')
}

// Fees are supplied at settlement and are not fields of the signed Order. In
// these exchange implementations, a zero maximum skips the percentage check;
// it does not require the supplied fee to be zero.
const ctfFeeRule =
  ctfExchangeMaxFeeRate === 0
    ? 'The current maximum fee-rate setting on both CTF exchanges is zero, which disables the percentage limit rather than fees themselves.'
    : `Both CTF exchanges currently cap the fee at ${formatBasisPoints(ctfExchangeMaxFeeRate)}.`
const ctfFeeRisk =
  ctfExchangeMaxFeeRate === 0
    ? 'their current zero setting disables the percentage check'
    : `their current percentage cap is ${formatBasisPoints(ctfExchangeMaxFeeRate)}`

const combosMaxFeeRateBps = discovery.getContractValue<number>(
  'CombosExchange',
  'MAX_FEE_RATE',
)
const combosFeeRule =
  combosMaxFeeRateBps === 0
    ? 'The combination-position venue also has a zero setting, which disables its percentage limit rather than fees themselves.'
    : `The combination-position venue currently caps this fee at ${formatBasisPoints(combosMaxFeeRateBps)}.`
const combosFeeRisk =
  combosMaxFeeRateBps === 0
    ? 'the combination-position venue also disables its percentage check'
    : `the combination-position venue currently permits up to ${formatBasisPoints(combosMaxFeeRateBps)}`

const ctfExchangeUserPauseBlocks = discovery.getContractValue<number>(
  'CTFExchange',
  'userPauseBlockInterval',
)
const negRiskCtfExchangeUserPauseBlocks = discovery.getContractValue<number>(
  'NegRiskCtfExchange',
  'userPauseBlockInterval',
)
const combosExchangeUserPauseBlocks = discovery.getContractValue<number>(
  'CombosExchange',
  'userPauseBlockInterval',
)
if (
  ctfExchangeUserPauseBlocks !== negRiskCtfExchangeUserPauseBlocks ||
  ctfExchangeUserPauseBlocks !== combosExchangeUserPauseBlocks
) {
  throw new Error('The exchanges have different user-pause intervals')
}

// Internal constant in all three current exchange implementations. It has no
// getter, so discovery cannot interpolate it directly.
const maxUserPauseBlocks = 302_400

// Emergency-resolution windows. The binary adapter and the operator that
// fronts CTF neg-risk markets use separate constants.
const adapterSafetyPeriod = formatDelay(
  discovery.getContractValue<number>('UmaCtfAdapterBinary', 'SAFETY_PERIOD'),
)
const negRiskOperatorDelaySeconds = discovery.getContractValue<number>(
  'NegRiskOperator',
  'DELAY_PERIOD',
)
const negRiskOverrideTiming =
  negRiskOperatorDelaySeconds === 0
    ? 'immediately after flagging the question, including in the same transaction'
    : `after waiting ${formatDelay(negRiskOperatorDelaySeconds)} from flagging the question`

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
    description:
      'Polymarket is a prediction market where users trade collateral-backed outcome shares through offchain order books. Market listing, order execution, resolution, and parts of the collateral and wallet systems depend on permissioned actors.',
    detailedDescription: readProjectMarkdown(
      'polymarket',
      'detailedDescription',
      {
        adminSafe,
        oracleUpgradeSafe,
        timelockDelay,
        adapterSafetyPeriod,
        legacyAdapterSafetyPeriod: formatDelay(
          discovery.getContractValue<number>(
            'UmaCtfAdapterLegacy',
            'emergencySafetyPeriod',
          ),
        ),
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
        ctfFeeRule,
        combosFeeRule,
        userPauseBlocks: ctfExchangeUserPauseBlocks,
        maxUserPauseBlocks: maxUserPauseBlocks.toLocaleString('en-US'),
        negRiskOverrideTiming,
        walletPauseDelay: discovery.getContractValue<string>(
          'DepositWalletFactory',
          'timelockDelay',
        ),
        walletMaxPauseDelay: formatDelay(
          discovery.getContractValue<number>(
            'DepositWalletFactory',
            'MAX_TIMELOCK_DELAY',
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
      {
        title: 'How markets are created - Polymarket Help Center',
        url: 'https://help.polymarket.com/en/articles/13364541-how-are-markets-created',
      },
    ],
    badges: [],
  },
  // Both the bridged and the native stablecoin are registered under the
  // symbol USDC on this chain, so one entry covers both; empty balances are
  // dropped when the value config is generated.
  // The three pools that hold stablecoins are disjoint. Wrapping moves the
  // underlying into the vault. CTF adapters unwrap pUSD before moving the
  // underlying into ConditionalTokens or WrappedCollateral. PositionManager
  // splits burn pUSD without moving the underlying, so their backing remains
  // in the vault. Counting these pools, but not pUSD itself, avoids double
  // counting while retaining the backing of both outcome-token systems.
  escrows: [
    discovery.getEscrowDetails({
      address: discovery.getContract('CollateralVault').address,
      tokens: ['USDC'],
      description:
        'Holds the stablecoins backing circulating pUSD and PositionManager outcome shares created by burning pUSD.',
    }),
    discovery.getEscrowDetails({
      address: discovery.getContract('ConditionalTokens').address,
      tokens: ['USDC'],
      description: 'Holds USDC.e locked directly behind CTF outcome shares.',
    }),
    discovery.getEscrowDetails({
      address: discovery.getContract('WrappedCollateral').address,
      tokens: ['USDC'],
      description: 'Holds USDC.e locked behind CTF neg-risk outcome shares.',
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
    tvl: { source: 'l2beat' },
  },
  externalDependencies: [
    {
      type: 'not-tracked',
      name: 'UMA',
      icon: 'uma',
      description:
        'Supplies the optimistic oracle used by CTF-based market questions. Proposals and disputes are bonded and settlement is performed by permissioned resolvers, so a stalled or captured oracle leaves those markets unresolved or resolves them wrongly.',
    },
    {
      type: 'tracked',
      projectId: ProjectId('polygon-pos'),
      description:
        'Its bridge mints the stablecoin that backs essentially all of the collateral token. The bridge contract holding the depositor role can mint that stablecoin without a corresponding deposit, and the token’s proxy admin, also controlled from this chain’s governance, can replace its implementation, which would allow the freeze and pause powers that are currently unset to be reinstated.',
    },
    {
      type: 'not-tracked',
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
        text: `the ${adminSafe} multisig upgrades the collateral token or its vault after the ${timelockDelay} timelock and moves the stablecoin backing every balance.`,
        isCritical: true,
      },
      {
        category: 'Funds can be stolen if',
        text: 'a PositionManager bridge-role holder mints outcome shares without burning pUSD, or an upgraded outcome module mints unbacked pUSD, and the resulting claims are redeemed against the vault.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'the admins pause either collateral ramp with no delay, blocking redemption of the collateral token into the underlying stablecoin.',
      },
      {
        category: 'Funds can lose value if',
        text: `a resolution admin overrides the UMA result after ${adapterSafetyPeriod} on a CTF binary question, a CTF neg-risk admin forces a result ${negRiskOverrideTiming}, or a PositionManager resolver reports a false result.`,
        isCritical: true,
      },
      {
        category: 'Funds can lose value if',
        text: 'a permissioned UMA or PositionManager resolver stalls, leaving the affected outcome shares unredeemable.',
      },
      {
        category: 'Funds can lose value if',
        text: `the operator charges an unsigned fee that pushes the all-in price past the signed limit: on the CTF exchanges ${ctfFeeRisk}, while ${combosFeeRisk}.`,
      },
    ],
  },
}
