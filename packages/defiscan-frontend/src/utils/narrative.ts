import type { CompiledReview, CompiledAdmin, CompiledDependency } from '../types'
import { formatUsdValue } from './format'

/** Generate executive summary sentence from review data */
export function generateExecutiveSummary(review: CompiledReview): string {
  const { totals, metadata, admins } = review
  const adminTypes = getAdminTypeSummary(admins)
  const capitalStr = formatUsdValue(totals.totalCapitalAtRisk)

  const parts: string[] = []

  parts.push(
    `${metadata.protocolName} has ${capitalStr} in funds locked across ${totals.contractCount} contracts`,
  )

  if (totals.adminCount > 0) {
    parts.push(
      `controlled by ${totals.adminCount} admin${totals.adminCount !== 1 ? 's' : ''} (${adminTypes})`,
    )
  }

  if (totals.dependencyCount > 0) {
    parts.push(
      `with ${totals.dependencyCount} external dependenc${totals.dependencyCount !== 1 ? 'ies' : 'y'}`,
    )
  }

  return parts.join(', ') + '.'
}

/** Summarize admin types into human-readable string */
function getAdminTypeSummary(admins: CompiledAdmin[]): string {
  const counts = new Map<string, number>()
  for (const admin of admins) {
    const t = admin.adminType
    counts.set(t, (counts.get(t) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([type, count]) => `${count} ${humanAdminType(type)}${count > 1 ? 's' : ''}`)
    .join(', ')
}

function humanAdminType(type: string): string {
  switch (type) {
    case 'EOA':
      return 'externally owned account'
    case 'EOAPermissioned':
      return 'permissioned EOA'
    case 'Multisig':
      return 'multisig'
    case 'Timelock':
      return 'timelock'
    case 'Contract':
    case 'Untemplatized':
      return 'contract'
    case 'Diamond':
      return 'diamond proxy'
    case 'Immutable':
      return 'immutable contract'
    case 'Upgradeable':
      return 'upgradeable contract'
    case 'Revoked':
      return 'revoked address'
    default:
      return type.toLowerCase()
  }
}

/** Generate human-readable admin narrative */
export function generateAdminNarrative(admin: CompiledAdmin): string {
  const capitalStr = admin.totalDirectCapital > 0
    ? ` with access to ${formatUsdValue(admin.totalDirectCapital)} in locked funds`
    : ''

  const funcCount = admin.functions.length
  const funcStr = `${funcCount} permissioned function${funcCount !== 1 ? 's' : ''}`

  return `This ${humanAdminType(admin.adminType)} controls ${funcStr}${capitalStr}.`
}

/** Group dependencies by entity for narrative display */
export function groupDependenciesByEntity(deps: CompiledDependency[]): Map<string, CompiledDependency[]> {
  const grouped = new Map<string, CompiledDependency[]>()
  for (const dep of deps) {
    const key = dep.entity ?? 'Other'
    const list = grouped.get(key) ?? []
    list.push(dep)
    grouped.set(key, list)
  }
  return grouped
}

/** Get key findings from the review data */
export interface KeyFinding {
  type: 'positive' | 'warning' | 'critical' | 'info'
  title: string
  detail: string
}

export function getKeyFindings(review: CompiledReview): KeyFinding[] {
  const findings: KeyFinding[] = []
  const { admins, totals, dependencies } = review

  // Check for immutability
  const allRevoked = admins.every(
    (a) =>
      a.adminType === 'Revoked' ||
      a.adminType === 'Contract' ||
      a.adminType === 'Untemplatized' ||
      a.adminType === 'Immutable',
  )

  if (allRevoked && admins.length > 0) {
    findings.push({
      type: 'positive',
      title: 'Fully immutable protocol',
      detail:
        'All admin controls resolve to immutable contracts or revoked addresses. No human entity can modify protocol behavior after deployment.',
    })
  }

  // Check for EOAs
  const eoas = admins.filter(
    (a) => a.adminType === 'EOA' || a.adminType === 'EOAPermissioned',
  )
  if (eoas.length > 0) {
    const maxCapital = Math.max(...eoas.map((e) => e.totalDirectCapital))
    findings.push({
      type: 'critical',
      title: `${eoas.length} EOA${eoas.length > 1 ? 's' : ''} with admin access`,
      detail: `Externally owned account${eoas.length > 1 ? 's' : ''} can execute critical functions affecting up to ${formatUsdValue(maxCapital)} in locked funds. A single compromised private key could impact user funds.`,
    })
  }

  // Check for multisig
  const multisigs = admins.filter((a) => a.adminType === 'Multisig')
  if (multisigs.length > 0) {
    findings.push({
      type: 'warning',
      title: `${multisigs.length} multisig${multisigs.length > 1 ? 's' : ''} governing the protocol`,
      detail: `Multisig wallets provide distributed control but still require trust in a known group of signers. ${multisigs.map((m) => m.name).join(', ')}.`,
    })
  }

  // Funds locked — always show as info
  if (totals.totalCapitalAtRisk > 0) {
    findings.push({
      type: 'info',
      title: `${formatUsdValue(totals.totalCapitalAtRisk)} in funds locked`,
      detail: 'Total value of funds locked in the protocol across all contracts.',
    })
  }

  // Dependencies
  if (dependencies.length === 0) {
    findings.push({
      type: 'positive',
      title: 'Fully autonomous protocol',
      detail: 'The protocol does not depend on any external contracts, operating entirely through its own on-chain logic.',
    })
  } else {
    findings.push({
      type: 'warning',
      title: `${dependencies.length} external dependenc${dependencies.length !== 1 ? 'ies' : 'y'}`,
      detail: `The protocol depends on ${dependencies.length} external contract${dependencies.length !== 1 ? 's' : ''}, introducing third-party risk. A failure or compromise in any dependency could affect protocol operations.`,
    })
  }

  return findings
}

/** Glossary of DeFi terms */
export const GLOSSARY: Record<string, string> = {
  EOA: 'Externally Owned Account — a blockchain address controlled by a single private key, representing one person or entity.',
  Multisig: 'Multi-signature wallet — requires multiple parties to approve a transaction (e.g., 3-of-5 means 3 out of 5 keyholders must sign).',
  Timelock: 'A smart contract mechanism that enforces a mandatory waiting period before changes take effect, giving users time to react.',
  Proxy: 'A contract pattern that allows upgrading the underlying logic while keeping the same address. Users interact with the proxy, which delegates to an implementation.',
  'Permissioned Function': 'A smart contract function that can only be called by specific addresses (admins), not by the general public.',
  'Funds Locked': 'The total USD value of funds locked in the protocol that could be affected if an admin key is compromised or misused.',
  Immutable: 'A contract that cannot be changed after deployment — its code and behavior are permanently fixed on the blockchain.',
  CDP: 'Collateralized Debt Position — a mechanism where users lock collateral to borrow assets, commonly used in stablecoin protocols.',
  Oracle: 'A service that brings external data (like asset prices) onto the blockchain for smart contracts to use.',
  Governance: 'A contract or system that manages decision-making for a protocol, typically through token voting or delegated authority.',
}
