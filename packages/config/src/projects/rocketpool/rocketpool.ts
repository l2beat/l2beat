import { formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('rocketpool')

const value = (contract: string, key: string): string =>
  String(discovery.getContractValue<string | number>(contract, key))

// Fractions are stored on-chain with 18 decimals; read them raw from the
// settings contract that owns them and render them as a percentage.
const percent = (contract: string, key: string): string => {
  const raw = Number(discovery.getContractValue<string | number>(contract, key))
  return `${Number.parseFloat((raw / 1e16).toFixed(6))}%`
}

// Durations are read raw from the settings contract that owns them so the page
// can spell the unit out; the templates keep their own short-form copies.
const duration = (contract: string, key: string): string =>
  formatSeconds(discovery.getContractValue<number>(contract, key), {
    fullUnit: true,
  })

// One vote is one member, so the quorum in votes is the number of members that
// must agree. A proposal passes at "votes >= required", and the required figure
// is a fraction of the seat count, so a fractional requirement rounds up.
const membersNeeded = (contract: string): number =>
  Math.ceil(Number(value(contract, 'quorumVotes')))

const oracleSetSize = Number(value('RocketDAONodeTrusted', 'memberCount'))

// Registration of new node operators is a live protocol switch; render its
// state from discovery so the page never hardcodes it.
const registrationStatus = discovery.getContractValue<boolean>(
  'RocketDAOProtocolSettingsNode',
  'getRegistrationEnabled',
)
  ? 'enabled'
  : 'disabled'

// The council's seats are discovered from its membership register, and each
// seat's own signing threshold is read from whatever contract holds it, so no
// sibling is referenced by name.
const councilSeats = discovery.getContractValue<string[]>(
  'RocketDAOSecurity',
  'members',
)
const councilSeatThreshold = councilSeats
  .map((seat) => discovery.getContractValue<string>(seat, 'multisigThreshold'))
  .join(', ')

// --- Liquid staking risk comparison (DeFi summary tab) ---
const rethSymbol = value('RocketTokenRETH', 'symbol')
const balanceCadence =
  discovery.getContractValue<number>(
    'RocketDAOProtocolSettingsNetwork',
    'getSubmitBalancesFrequency',
  ) === 86400
    ? 'daily'
    : `every ${duration('RocketDAOProtocolSettingsNetwork', 'getSubmitBalancesFrequency')}`
const securityCouncil = discovery.getMultisigStats('SecurityCouncilSafe')
const maxPenaltyEth = value('RocketMegapoolPenalties', 'maximumPenalty')
const upgradeVetoQuorum = percent(
  'RocketDAOProtocolSettingsSecurity',
  'getUpgradeVetoQuorum',
)
const voteDelay = duration(
  'RocketDAONodeTrustedSettingsProposals',
  'getVoteDelayTime',
)
const upgradeVetoWindow = duration(
  'RocketDAOProtocolSettingsSecurity',
  'getUpgradeDelay',
)
// Vote delay plus the post-vote veto window: the shortest path from an
// upgrade proposal to its execution, excluding the vote itself.
const upgradePathDays =
  (discovery.getContractValue<number>(
    'RocketDAONodeTrustedSettingsProposals',
    'getVoteDelayTime',
  ) +
    discovery.getContractValue<number>(
      'RocketDAOProtocolSettingsSecurity',
      'getUpgradeDelay',
    )) /
  86400

export const rocketpool: BaseProject = {
  id: ProjectId('rocketpool'),
  slug: 'rocketpool',
  name: 'Rocket Pool',
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
    description: `Rocket Pool is an Ethereum liquid staking protocol. Users deposit ETH and receive ${value('RocketTokenRETH', 'symbol')}, a token whose value tracks the protocol's pooled ETH and staking rewards. Validators are run by registered node operators who combine their own ETH bond with ETH supplied by the pool. Withdrawal credentials point to protocol contracts, so operators cannot take user principal. The core trust surface is a ${membersNeeded('RocketDAONodeTrusted')}-of-${oracleSetSize} oracle set that reports the balances used to price ${value('RocketTokenRETH', 'symbol')}, with each report limited to a ${percent('RocketDAOProtocolSettingsNetwork', 'getMaxRethDelta')} price move and one report every ${duration('RocketDAOProtocolSettingsNetwork', 'getSubmitBalancesFrequency')}. The same oracle set can upgrade protocol contracts after a delay of ${duration('RocketDAOProtocolSettingsSecurity', 'getUpgradeDelay')}, subject to a veto by a ${councilSeatThreshold} security council Safe. On-chain redemptions cannot be paused, but depend on available protocol liquidity.`,
    detailedDescription: readProjectMarkdown(
      'rocketpool',
      'detailedDescription',
      {
        oracleSetSize,
        registrationStatus,
        votingStakeCap: percent(
          'RocketDAOProtocolSettingsNode',
          'getMaximumStakeForVotingPower',
        ),
        oracleSetQuorum: membersNeeded('RocketDAONodeTrusted'),
        oracleSetBond: value('RocketDAONodeTrusted', 'memberBond'),
        submitFrequency: duration(
          'RocketDAOProtocolSettingsNetwork',
          'getSubmitBalancesFrequency',
        ),
        maxRethDelta: percent(
          'RocketDAOProtocolSettingsNetwork',
          'getMaxRethDelta',
        ),
        upgradeDelay: duration(
          'RocketDAOProtocolSettingsSecurity',
          'getUpgradeDelay',
        ),
        minimumDeposit: value('RocketDepositPool', 'minimumDeposit'),
        maximumPoolSize: value('RocketDepositPool', 'maximumPoolSize'),
        depositFee: percent(
          'RocketDAOProtocolSettingsDeposit',
          'getDepositFee',
        ),
        targetCollateralRate: percent(
          'RocketDAOProtocolSettingsNetwork',
          'getTargetRethCollateralRate',
        ),
        unstakingPeriod: duration(
          'RocketDAOProtocolSettingsNode',
          'getUnstakingPeriod',
        ),
        megapoolPenaltyCap: value('RocketMegapoolPenalties', 'maximumPenalty'),
        megapoolPenaltyThreshold: percent(
          'RocketDAOProtocolSettingsMegapool',
          'getPenaltyThreshold',
        ),
        proposalBond: value('RocketDAOProtocolVerifier', 'proposalBond'),
        challengeBond: value('RocketDAOProtocolVerifier', 'challengeBond'),
        challengePeriod: duration(
          'RocketDAOProtocolSettingsProposals',
          'getChallengePeriod',
        ),
        oracleVoteDelay: duration(
          'RocketDAONodeTrustedSettingsProposals',
          'getVoteDelayTime',
        ),
        securityCouncilSeat: councilSeatThreshold,
      },
    ),
    links: {
      websites: ['https://rocketpool.net/'],
      documentation: ['https://docs.rocketpool.net/'],
      repositories: ['https://github.com/rocket-pool/rocketpool'],
      socialMedia: ['https://x.com/Rocket_Pool'],
    },
    references: [
      {
        title: 'RPIP-61: rETH exchange rate update bounds',
        url: 'https://rpips.rocketpool.net/RPIPs/RPIP-61',
      },
      {
        title: 'RPIP-33: Protocol DAO governance',
        url: 'https://rpips.rocketpool.net/RPIPs/RPIP-33',
      },
    ],
    badges: [],
  },
  defiInfo: {
    category: 'Liquid Staking',
    liquidStaking: {
      token: rethSymbol,
      minting: {
        value: 'Permissionless',
        secondLine: 'ungated FIFO queue',
        sentiment: 'good',
        description: `Deposits (minimum ${value('RocketDepositPool', 'minimumDeposit')} ETH, ${percent('RocketDAOProtocolSettingsDeposit', 'getDepositFee')} fee) mint ${rethSymbol} at the stored rate, up to ${value('RocketDepositPool', 'maximumPoolSize')} ETH unassigned. ETH is matched to the next queued validator first-in-first-out; anyone can trigger assignment. The ${securityCouncil} security council or RPL governance can switch deposits off.`,
      },
      operators: {
        value: 'Permissionless',
        secondLine: 'ETH bond',
        sentiment: 'good',
        warning:
          registrationStatus === 'disabled'
            ? {
                value:
                  'Registration of new node operators is currently switched off.',
                sentiment: 'warning',
              }
            : undefined,
        description: `Registration is permissionless (currently ${registrationStatus}); operators bond part of each validator's 32 ETH and an exit shortfall hits their share first. The oracle set can fine up to ${maxPenaltyEth} ETH per penalty. No EIP-7002: stake returns only when the operator exits or is slashed.`,
      },
      backing: {
        value: 'Minipools',
        secondLine: 'creds: minipool',
        sentiment: 'good',
        description: `Credentials point at the validator's own minipool or megapool, fixed at funding. Returned balances split on-chain between operator bond and pool share, exits are proven against beacon-chain state, and the vault and token contracts are not upgradeable.`,
      },
      exchangeRate: {
        value: `${membersNeeded('RocketDAONodeTrusted')} of ${oracleSetSize}`,
        secondLine: `${balanceCadence} · ≤${percent('RocketDAOProtocolSettingsNetwork', 'getMaxRethDelta')}`,
        sentiment: 'warning',
        description: `Price is reported total ETH over supply, written by ${membersNeeded('RocketDAONodeTrusted')} of ${oracleSetSize} oracle DAO members ${balanceCadence}, at most ${percent('RocketDAOProtocolSettingsNetwork', 'getMaxRethDelta')} per report. Reports never expire, so a silent oracle leaves the stale price in force. The security council can switch submission off.`,
      },
      exit: {
        value: 'Burn anytime',
        secondLine: 'instant · no pause',
        sentiment: 'good',
        warning: {
          value:
            'Pays only from the liquid buffer and reverts when it is empty; there is no forced validator exit.',
          sentiment: 'warning',
        },
        description: `Burn ${rethSymbol} for ETH at the stored rate with no queue, delay or pause switch, but only from the contract buffer plus deposit-pool surplus (target ${percent('RocketDAOProtocolSettingsNetwork', 'getTargetRethCollateralRate')} of backing). When that is empty the burn reverts.`,
      },
      upgrades: {
        value: `Oracle DAO (${membersNeeded('RocketDAONodeTrusted')}/${oracleSetSize})`,
        secondLine: `≥${upgradePathDays}d · council veto`,
        sentiment: 'warning',
        description: `Only the oracle DAO (${oracleSetSize} bonded operator accounts, ${value('RocketDAONodeTrusted', 'memberBond')} RPL each, ${membersNeeded('RocketDAONodeTrusted')}-of-${oracleSetSize} majority) can change code: ${voteDelay} before voting opens, then ${upgradeVetoWindow} in which the ${securityCouncil} security council can veto at ${upgradeVetoQuorum} quorum. Vault and tokens are not upgradeable; RPL governance sets parameters only.`,
      },
    },
  },
  // Declared empty on purpose: the protocol has no bridge, no third-party price
  // feed, and no external contract it depends on. Its only outside contract is
  // the Ethereum beacon-chain deposit contract, which is part of the chain
  // rather than a dependency on another protocol. The section renders an
  // explicit "none" message instead of being omitted.
  externalDependencies: [],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
