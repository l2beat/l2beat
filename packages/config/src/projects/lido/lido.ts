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
  },
  externalDependencies: [
    {
      type: 'not-tracked',
      name: 'Ethereum consensus layer',
      icon: 'ethereum',
      description:
        'Staked ETH, validator balances, exits and slashings live on the beacon chain, which Lido’s contracts cannot read directly. Aggregate accounting and withdrawal finalization depend on the oracle committee reporting consensus-layer state; targeted facts use trustless EIP-4788 beacon-root proofs. A halt or corruption of the consensus layer halts rebases and withdrawal finalization.',
    },
  ],
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
