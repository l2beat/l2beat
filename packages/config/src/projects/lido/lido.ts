import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
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

const oracleQuorum = discovery.getContractValue<number>(
  ACCOUNTING_HASH_CONSENSUS,
  'getQuorum',
)
const oracleMembers = discovery.getContractValue<{ addresses: string[] }>(
  ACCOUNTING_HASH_CONSENSUS,
  'getMembers',
).addresses.length
const dsmGuardians = discovery.getContractValue<string[]>(
  'DepositSecurityModule',
  'getGuardians',
).length
const dsmQuorum = discovery.getContractValue<number>(
  'DepositSecurityModule',
  'getGuardianQuorum',
)
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

// --- Liquid staking risk comparison (DeFi summary tab) ---
const days = (n: number) => `${n} day${n === 1 ? '' : 's'}`
const stakeLimit = discovery.getContractValue<{
  maxStakeLimit: string
  maxStakeLimitGrowthBlocks: number
}>(STETH, 'getStakeLimitFullInfo')
const stakeLimitEth = (
  BigInt(stakeLimit.maxStakeLimit) /
  10n ** 18n
).toLocaleString('en-US')
const stakeLimitGrowthBlocks =
  stakeLimit.maxStakeLimitGrowthBlocks.toLocaleString('en-US')
const oracleFrameDays =
  (discovery.getContractValue<{ epochsPerFrame: number }>(
    ACCOUNTING_HASH_CONSENSUS,
    'getFrameConfig',
  ).epochsPerFrame *
    32 *
    12) /
  86400
// 1e9-precision fraction -> percent
const maxPositiveRebasePercent =
  discovery.getContractValue<number>(
    'OracleReportSanityChecker',
    'getMaxPositiveTokenRebase',
  ) / 1e7
const annualIncreasePercent =
  discovery.getContractValue<{ annualBalanceIncreaseBPLimit: number }>(
    'OracleReportSanityChecker',
    'getOracleReportLimits',
  ).annualBalanceIncreaseBPLimit / 100
const maxClDecreaseBp = discovery.getContractValue<number>(
  'OracleReportSanityChecker',
  'getMaxCLBalanceDecreaseBP',
)
const stakingModules = discovery.getContractValue<
  {
    nodeOperatorsCount: number
    state: { name: string; stakeShareLimit: number }
  }[]
>('StakingRouter', 'getAllStakingModuleDigests')
const stakingModule = (name: string) => {
  const module = stakingModules.find((m) => m.state.name === name)
  if (!module) throw new Error(`lido: staking module ${name} not found`)
  return {
    operators: module.nodeOperatorsCount,
    sharePercent: module.state.stakeShareLimit / 100,
  }
}
const nor = stakingModule('curated-onchain-v1')
const sdvt = stakingModule('SimpleDVT')
const csm = stakingModule('Community Staking')
const cmv2 = stakingModule('curated-onchain-v2')
const externalLivePercent = (
  Number(
    (discovery.getContractValueBigInt(STETH, 'getExternalEther') * 10000n) /
      discovery.getContractValueBigInt(STETH, 'getTotalPooledEther'),
  ) / 100
).toFixed(2)
const wqMinWei = discovery.getContractValue<number>(
  'WithdrawalQueueERC721',
  'MIN_STETH_WITHDRAWAL_AMOUNT',
)
const wqMaxEth = (
  discovery.getContractValueBigInt(
    'WithdrawalQueueERC721',
    'MAX_STETH_WITHDRAWAL_AMOUNT',
  ) /
  10n ** 18n
).toLocaleString('en-US')
const circuitBreakerPauseDays =
  discovery.getContractValue<number>('CircuitBreaker', 'pauseDuration') / 86400
const circuitBreakerCommittee = discovery.getMultisigStats(
  'CircuitBreakerCommittee',
)
const resealCommittee = discovery.getMultisigStats('ResealCommittee')
const emergencyActivation = discovery.getMultisigStats(
  'DualGovernanceEmergencyActivationCommittee',
)
const emergencyExecution = discovery.getMultisigStats(
  'DualGovernanceEmergencyExecutionCommittee',
)
const dgConfig = discovery.getContractValue<{
  vetoSignallingMinDuration: number
  vetoSignallingMaxDuration: number
}>('ImmutableDualGovernanceConfigProvider', 'getDualGovernanceConfig')
const oracleCadence =
  oracleFrameDays === 1 ? 'daily' : `every ${days(oracleFrameDays)}`
const vetoMinDays = dgConfig.vetoSignallingMinDuration / 86400
const vetoMaxDays = dgConfig.vetoSignallingMaxDuration / 86400
const emergencyModeDays =
  discovery.getContractValue<{ emergencyModeDuration: number }>(
    'EmergencyProtectedTimelock',
    'getEmergencyProtectionDetails',
  ).emergencyModeDuration / 86400

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
    liquidStaking: {
      token: 'stETH, wstETH',
      minting: {
        value: 'Permissionless',
        secondLine: `gated by DSM ${dsmQuorum}/${dsmGuardians}`,
        sentiment: 'good',
        description: `Anyone can submit ETH for stETH under a rolling ${stakeLimitEth} ETH limit (refills over ${stakeLimitGrowthBlocks} blocks). Validator deposits need ${dsmQuorum} of ${dsmGuardians} DSM guardian signatures; any guardian can pause them. The StakingRouter sets withdrawal credentials. wstETH is an immutable non-rebasing wrapper.`,
      },
      operators: {
        value: 'Hybrid',
        secondLine: 'no bond; CSM bonded',
        sentiment: 'neutral',
        description: `Curated modules (${nor.operators} operators in the registry, ${sdvt.operators} in SimpleDVT) post no bond, so their slashing shrinks every holder's rebase; the permissionless CSM (${csm.operators} operators, ${csm.sharePercent}% share) and the curated MaxEB module (${cmv2.operators}) post a stETH bond burned on penalties. Anyone can force a requested exit via EIP-7002.`,
      },
      backing: {
        value: 'Protocol vault',
        secondLine: 'creds: protocol',
        sentiment: 'good',
        description: `Credentials point at the WithdrawalVault, set by the StakingRouter. Balances come from the oracle committee, validator facts from EIP-4788 proofs. stVaults may mint stETH against their own collateral, capped at ${externalRatioCap}% of supply (${externalLivePercent}% today).`,
      },
      exchangeRate: {
        value: `${oracleQuorum} of ${oracleMembers}`,
        secondLine: `${oracleCadence} · ≤${maxPositiveRebasePercent}%`,
        sentiment: 'warning',
        description: `Rebases ${oracleCadence} on a ${oracleQuorum}-of-${oracleMembers} report, capped at +${maxPositiveRebasePercent}% per report, ${annualIncreasePercent}% a year and ${maxClDecreaseBp} bp down over 36 days. A silent committee stops rebases and finalization.`,
      },
      exit: {
        value: 'Oracle-gated',
        secondLine: '≤1 day · pausable',
        sentiment: 'warning',
        description: `Requests (${wqMinWei} wei to ${wqMaxEth} stETH) mint an unstETH NFT finalized only in the ${oracleCadence} report, at the lower of request and report rate. A ${circuitBreakerCommittee} committee can pause the queue for ${days(circuitBreakerPauseDays)}; the ${resealCommittee} Reseal Committee can make that indefinite.`,
      },
      upgrades: {
        value: 'Lido DAO',
        secondLine: `${dgSubmitDays + dgScheduleDays}d min · stETH veto`,
        sentiment: 'neutral',
        description: `The Aragon Agent, proxy admin of every core contract, acts only through Dual Governance: ${days(dgSubmitDays)} plus ${days(dgScheduleDays)}. ${vetoPercent}% of stETH locked blocks scheduling for ${vetoMinDays} to ${vetoMaxDays} days; ${rageQuitPercent}% triggers a rage quit. Until ${emergencyEnd}, ${emergencyActivation} and ${emergencyExecution} committees can freeze execution for ${days(emergencyModeDays)} or reset to a no-veto fallback.`,
      },
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
