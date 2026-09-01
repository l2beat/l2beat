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
const securityCouncilSize = Number(value('RocketDAOSecurity', 'memberCount'))

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
    description: `Rocket Pool is a permissionless Ethereum staking pool. Depositors receive ${value('RocketTokenRETH', 'symbol')}, a token whose redemption price is set by a permissioned oracle set of ${oracleSetSize} node operators: ${membersNeeded('RocketDAONodeTrusted')} of them agreeing writes the network balance from which the price is derived, bounded to a ${percent('RocketDAOProtocolSettingsNetwork', 'getMaxRethDelta')} move per report and to one report every ${duration('RocketDAOProtocolSettingsNetwork', 'getSubmitBalancesFrequency')}. Validator keys are run by permissionless node operators who post their own ETH bond; staking ${value('RocketTokenRPL', 'symbol')} is optional. Redeeming ${value('RocketTokenRETH', 'symbol')} on-chain is open to any holder and cannot be paused, but pays only out of the protocol's liquid buffer. The same oracle set is the only body that can change protocol code, after a delay of ${duration('RocketDAOProtocolSettingsSecurity', 'getUpgradeDelay')} that a security council of ${securityCouncilSize} can veto.`,
    detailedDescription: readProjectMarkdown(
      'rocketpool',
      'detailedDescription',
      {
        oracleSetSize,
        oracleSetQuorum: membersNeeded('RocketDAONodeTrusted'),
        oracleSetBond: value('RocketDAONodeTrusted', 'memberBond'),
        consensusThreshold: percent(
          'RocketDAOProtocolSettingsNetwork',
          'getNodeConsensusThreshold',
        ),
        submitFrequency: duration(
          'RocketDAOProtocolSettingsNetwork',
          'getSubmitBalancesFrequency',
        ),
        maxRethDelta: percent(
          'RocketDAOProtocolSettingsNetwork',
          'getMaxRethDelta',
        ),
        securityCouncilSize,
        securityCouncilQuorum: membersNeeded('RocketDAOSecurity'),
        upgradeVetoQuorum: percent(
          'RocketDAOProtocolSettingsSecurity',
          'getUpgradeVetoQuorum',
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
        maxPenaltyRate: percent('RocketMinipoolPenalty', 'getMaxPenaltyRate'),
        megapoolPenaltyCap: value('RocketMegapoolPenalties', 'maximumPenalty'),
        megapoolPenaltyThreshold: percent(
          'RocketDAOProtocolSettingsMegapool',
          'getPenaltyThreshold',
        ),
        proposalQuorum: percent(
          'RocketDAOProtocolSettingsProposals',
          'getProposalQuorum',
        ),
        proposalVetoQuorum: percent(
          'RocketDAOProtocolSettingsProposals',
          'getProposalVetoQuorum',
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
