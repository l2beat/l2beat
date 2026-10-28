import { assert, formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { discoveredDefiToken } from '../../templates/defiTokens'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('lido')

// The four consensus instances share one committee; read from the
// AccountingOracle's HashConsensus (referenced by address since the name is
// not unique across the four instances).
const ACCOUNTING_HASH_CONSENSUS =
  'eth:0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288'
const STETH = 'eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84'
const WSTETH = 'eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0'

const oracleQuorum = discovery.getContractValue<number>(
  ACCOUNTING_HASH_CONSENSUS,
  'getQuorum',
)
const oracleMembers = discovery.getContractValue<{ addresses: string[] }>(
  ACCOUNTING_HASH_CONSENSUS,
  'getMembers',
).addresses.length
const dsmGuardianAddresses = discovery.getContractValue<string[]>(
  'DepositSecurityModule',
  'getGuardians',
)
const dsmGuardians = dsmGuardianAddresses.length
const dsmQuorum = discovery.getContractValue<number>(
  'DepositSecurityModule',
  'getGuardianQuorum',
)
// Oracle seats and DSM guardian seats are held by Execution Delegation
// Framework DelegationContracts (getCooldown fails for any other holder).
const delegationSeats = [
  ...discovery.getContractValue<string[]>(ACCOUNTING_HASH_CONSENSUS, 'members'),
  ...dsmGuardianAddresses,
]
const delegationCooldowns = delegationSeats.map((address) =>
  discovery.getContractValue<number>(address, 'getCooldown'),
)
assert(
  delegationCooldowns.every((c) => c === delegationCooldowns[0]),
  'Lido DelegationContract cooldowns differ, update the description',
)
const delegationCooldownDays = delegationCooldowns[0] / 86400
const vaultShareCap =
  discovery.getContractValue<number>(
    'VaultHub',
    'MAX_RELATIVE_SHARE_LIMIT_BP',
  ) / 100
const externalRatioCap =
  discovery.getContractValue<number>(STETH, 'getMaxExternalRatioBP') / 100
const dgSubmitDays =
  discovery.getContractValue<number>(
    'EmergencyProtectedTimelock',
    'getAfterSubmitDelay',
  ) / 86400
const dgScheduleDays =
  discovery.getContractValue<number>(
    'EmergencyProtectedTimelock',
    'getAfterScheduleDelay',
  ) / 86400
const vetoPercent = Number(
  discovery.getContractValueBigInt(
    'ImmutableDualGovernanceConfigProvider',
    'FIRST_SEAL_RAGE_QUIT_SUPPORT',
  ) /
    10n ** 16n,
)
const rageQuitPercent = Number(
  discovery.getContractValueBigInt(
    'ImmutableDualGovernanceConfigProvider',
    'SECOND_SEAL_RAGE_QUIT_SUPPORT',
  ) /
    10n ** 16n,
)
const emergencyEnd = new Date(
  discovery.getContractValue<{ emergencyProtectionEndsAfter: number }>(
    'EmergencyProtectedTimelock',
    'getEmergencyProtectionDetails',
  ).emergencyProtectionEndsAfter * 1000,
)
  .toISOString()
  .slice(0, 10)

const days = (n: number) => `${n} day${n === 1 ? '' : 's'}`
const stakeLimit = discovery.getContractValue<{
  maxStakeLimit: string
  maxStakeLimitGrowthBlocks: number
}>(STETH, 'getStakeLimitFullInfo')
const stakeLimitEth = (
  BigInt(stakeLimit.maxStakeLimit) /
  10n ** 18n
).toLocaleString('en-US')
// The limit drains with deposits and refills linearly over this many blocks.
const stakeLimitRefill = formatSeconds(
  stakeLimit.maxStakeLimitGrowthBlocks * 12,
  { fullUnit: true },
)
const oracleFrameDays =
  (discovery.getContractValue<{ epochsPerFrame: number }>(
    ACCOUNTING_HASH_CONSENSUS,
    'getFrameConfig',
  ).epochsPerFrame *
    32 *
    12) /
  86400
const oracleCadence =
  oracleFrameDays === 1 ? 'daily' : `every ${days(oracleFrameDays)}`
// 1e9-precision fraction -> percent
const maxPositiveRebasePercent =
  discovery.getContractValue<number>(
    'OracleReportSanityChecker',
    'getMaxPositiveTokenRebase',
  ) / 1e7
const stakingModules = discovery.getContractValue<
  {
    nodeOperatorsCount: number
    state: { name: string; stakeShareLimit: number }
  }[]
>('StakingRouter', 'getAllStakingModuleDigests')
const csm = stakingModules.find((m) => m.state.name === 'Community Staking')
assert(csm, 'lido: Community Staking module not found')
const externalLivePercent = (
  Number(
    (discovery.getContractValueBigInt(STETH, 'getExternalEther') * 10000n) /
      discovery.getContractValueBigInt(STETH, 'getTotalPooledEther'),
  ) / 100
).toFixed(2)
const circuitBreakerPauseDays =
  discovery.getContractValue<number>('CircuitBreaker', 'pauseDuration') / 86400
const circuitBreakerCommittee = discovery.getMultisigStats(
  'CircuitBreakerCommittee',
)

export const lido: BaseProject = {
  id: ProjectId('lido'),
  slug: 'lido',
  name: 'Lido',
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
    description: `Lido is Ethereum’s largest liquid staking protocol. Users deposit ETH and receive stETH, a rebasing token whose supply tracks the protocol’s total pooled ETH staked across four node-operator modules. Because staked ETH lives on the beacon chain, the core trust surface is the execution-layer↔consensus-layer boundary, bridged by a ${oracleQuorum}-of-${oracleMembers} oracle committee (bounded by on-chain sanity checks) and by trustless EIP-4788 beacon-root proofs. Withdrawal credentials are set by the protocol, so node operators cannot take user principal. Every protocol-critical change is controlled by the Lido DAO through Dual Governance, which gives stETH holders a veto and a rage-quit exit against DAO proposals over a ${dgSubmitDays}-day-plus timelock.`,
    detailedDescription: readProjectMarkdown('lido', 'detailedDescription', {
      oracleMembers,
      oracleQuorum,
      dsmGuardians,
      dsmQuorum,
      delegationCooldownDays,
      vaultShareCap,
      externalRatioCap,
      dgSubmitDays,
      dgScheduleDays,
      vetoPercent,
      rageQuitPercent,
      emergencyEnd,
    }),
    links: {
      websites: ['https://lido.fi/'],
      documentation: ['https://docs.lido.fi/'],
      repositories: ['https://github.com/lidofinance/core'],
      socialMedia: ['https://x.com/LidoFinance'],
    },
    badges: [],
  },
  defiInfo: {
    category: 'Liquid Staking',
    tvl: { source: 'l2beat' },
    tokens: [
      discoveredDefiToken(
        discovery,
        STETH,
        'Rebasing receipt for pooled ETH: balances follow the daily oracle report.',
      ),
      discoveredDefiToken(
        discovery,
        WSTETH,
        'Non-rebasing wrapper of stETH: a fixed share count whose ETH value rises with rewards; immutable.',
      ),
    ],
  },
  liquidStakingRisks: {
    minting: {
      value: 'Permissionless',
      secondLine: `gated by DSM ${dsmQuorum}/${dsmGuardians}`,
      sentiment: 'good',
      description: `Anyone can stake ETH for stETH, up to ${stakeLimitEth} ETH; deposits use up that limit and it refills over ${stakeLimitRefill}. Sending deposited ETH to new validators needs ${dsmQuorum} of ${dsmGuardians} guardian signatures, and any one guardian can pause that.`,
    },
    operators: {
      value: 'Hybrid',
      secondLine: 'no bond; CSM bonded',
      sentiment: 'neutral',
      description: `Most stake is run by curated operators who post no bond, so their slashing losses are shared by all holders. ${csm.nodeOperatorsCount} permissionless operators in the Community Staking Module, capped at ${csm.state.stakeShareLimit / 100}% of stake, post a bond that covers their penalties.`,
    },
    backing: {
      value: 'Protocol vault',
      secondLine: 'creds: protocol',
      sentiment: 'good',
      description: `Validators withdraw to a Lido contract set by the protocol, not by operators. Vaults can also mint stETH against their own collateral, capped at ${externalRatioCap}% of supply (${externalLivePercent}% today).`,
    },
    oracle: {
      value: `${oracleQuorum} of ${oracleMembers}`,
      secondLine: `${oracleCadence} · ≤${maxPositiveRebasePercent}%`,
      sentiment: 'warning',
      description: `A ${oracleQuorum}-of-${oracleMembers} oracle committee reports balances ${oracleCadence}, and each report can raise the rate by at most ${maxPositiveRebasePercent}%. If the committee stops, the rate and withdrawals freeze.`,
    },
    exit: {
      value: 'Oracle-gated',
      secondLine: `${oracleCadence} batches · pausable`,
      sentiment: 'warning',
      description: `Withdrawal requests are finalized in batches with each oracle report, at the lower of the request and report rate. When the buffer cannot cover the queue, requests wait for validators to exit, which can take days. A ${circuitBreakerCommittee} committee can pause the queue for ${days(circuitBreakerPauseDays)}, and another can extend that indefinitely.`,
    },
    upgrades: {
      value: 'Lido DAO',
      secondLine: `${dgSubmitDays + dgScheduleDays}d min · stETH veto`,
      sentiment: 'neutral',
      description: `Code changes go through Dual Governance and take at least ${days(dgSubmitDays + dgScheduleDays)}. Holders locking ${vetoPercent}% of stETH delay a change; at ${rageQuitPercent}% they can exit before it applies. Until ${emergencyEnd}, emergency committees can freeze execution.`,
    },
  },
  externalDependencies: [],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [
      {
        category: 'Funds can be stolen if',
        text: 'the Lido DAO passes a malicious upgrade through Dual Governance and stETH holders fail to veto (≥1%) or rage-quit (≥10%) within the timelock delay.',
        isCritical: true,
      },
      {
        category: 'Funds can be stolen if',
        text: 'the emergency committees reset governance to the no-veto fallback and an LDO majority then pushes an upgrade the stETH-holder veto would otherwise have blocked.',
      },
      {
        category: 'Funds can be stolen if',
        text: 'a quorum of Deposit Security Module guardians colludes with a node operator to sign off a deposit batch that front-runs freshly-deposited ETH with attacker withdrawal credentials (bounded per block by the max deposits per block).',
      },
      {
        category: 'Funds can lose value if',
        text: 'the oracle committee quorum misreports — bounded per report by the OracleReportSanityChecker (rebase and consensus-layer balance-change clamps), so mispricing is capped.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'the oracle committee stops submitting reports, since withdrawals can only be finalized inside the oracle report — recovery requires a governance action.',
      },
      {
        category: 'Funds can lose value if',
        text: 'node operators go offline or are slashed; the loss is socialized to all stETH holders through a smaller rebase, pooled (NOR/SDVT) operators post no bond to absorb it, and correlated mass-slashing raises the per-validator penalty.',
      },
    ],
  },
}
