import type {
  CompiledReview,
  CompiledAdmin,
  CompiledDependency,
  Mitigation,
  MitigationType,
} from '../types'
import { displayMitigationValue } from '../types'
import { formatUsdValue } from './format'
import { computeEntityDependencyCount } from './dependencies'

function formatDelayDuration(seconds: number): string {
  if (seconds >= 86400) {
    const days = seconds / 86400
    return `${days === Math.floor(days) ? `${days}` : `${days.toFixed(1)}`} day${days !== 1 ? 's' : ''}`
  }
  if (seconds >= 3600) {
    const hours = seconds / 3600
    return `${hours === Math.floor(hours) ? `${hours}` : `${hours.toFixed(1)}`} hour${hours !== 1 ? 's' : ''}`
  }
  if (seconds >= 60) {
    const minutes = seconds / 60
    return `${minutes === Math.floor(minutes) ? `${minutes}` : `${minutes.toFixed(1)}`} min`
  }
  return `${seconds}s`
}

/** Generate executive summary sentence from review data */
export function generateExecutiveSummary(review: CompiledReview): string {
  const { totals, metadata, admins } = review
  const adminTypes = getAdminTypeSummary(admins)
  const capitalStr = formatUsdValue(totals.totalCapitalAtRisk)

  const parts: string[] = []

  parts.push(
    `${metadata.protocolName} has ${capitalStr} in TVL across ${totals.contractCount} contracts`,
  )

  if (totals.adminCount > 0) {
    parts.push(
      `controlled by ${totals.adminCount} admin${totals.adminCount !== 1 ? 's' : ''} (${adminTypes})`,
    )
  }

  const depCount = computeEntityDependencyCount(review.dependencies)
  if (depCount > 0) {
    parts.push(
      `with ${depCount} external dependenc${depCount !== 1 ? 'ies' : 'y'}`,
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
  const capitalStr = admin.totalReachableCapital > 0
    ? ` with access to ${formatUsdValue(admin.totalReachableCapital)} in TVL`
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

  // Check for immutability — no human-controlled or governance admins
  const hasHumanOrGov = admins.some(
    (a) =>
      a.adminType === 'EOA' ||
      a.adminType === 'EOAPermissioned' ||
      a.adminType === 'Multisig' ||
      a.adminType === 'Timelock' ||
      a.isGovernance,
  )

  if (!hasHumanOrGov && admins.length > 0) {
    findings.push({
      type: 'positive',
      title: 'Fully immutable protocol',
      detail:
        'All admin controls resolve to immutable contracts or revoked addresses. No admin can modify protocol behavior after deployment.',
    })
  }

  // Check for EOAs
  const eoas = admins.filter(
    (a) => a.adminType === 'EOA' || a.adminType === 'EOAPermissioned',
  )
  if (eoas.length > 0) {
    const maxCapital = Math.max(...eoas.map((e) => e.totalReachableCapital))
    if (maxCapital > 0) {
      findings.push({
        type: 'critical',
        title: `${eoas.length} EOA${eoas.length > 1 ? 's' : ''} with permissioned access`,
        detail: `Externally owned account${eoas.length > 1 ? 's' : ''} can execute critical functions affecting up to ${formatUsdValue(maxCapital)} in TVL.`,
      })
    }
  }

  // Check for multisig
  const multisigs = admins.filter((a) => a.adminType === 'Multisig')
  if (multisigs.length > 0) {
    const maxMultisigCapital = Math.max(...multisigs.map((m) => m.totalReachableCapital))
    if (maxMultisigCapital > 0) {
      findings.push({
        type: 'warning',
        title: `${multisigs.length} multisig${multisigs.length > 1 ? 's' : ''} governing the protocol`,
        detail: `Multisig wallets provide distributed control but still require trust in a known group of signers. ${multisigs.map((m) => m.name).join(', ')}.`,
      })
    }
  }

  // Funds secured — always show as info
  const tokenValue = totals.totalTokenValue ?? totals.totalTokenValueAtRisk
  const tvs = totals.totalCapitalAtRisk + tokenValue
  if (tvs > 0) {
    const hasToken = tokenValue > 0
    const hasTvl = totals.totalCapitalAtRisk > 0
    findings.push({
      type: 'info',
      title: `${formatUsdValue(tvs)} TVS`,
      detail: hasToken && hasTvl
        ? `Total Value Secured by the protocol: ${formatUsdValue(totals.totalCapitalAtRisk)} in TVL (funds locked in protocol contracts) and ${formatUsdValue(tokenValue)} in protocol token market cap.`
        : hasTvl
          ? `Total Value Secured by the protocol, consisting of ${formatUsdValue(totals.totalCapitalAtRisk)} in TVL (tokens held in contracts).`
          : `Total Value Secured by the protocol, consisting of ${formatUsdValue(tokenValue)} in protocol token market cap.`,
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
    const entities = new Set(dependencies.map((d) => d.entity).filter(Boolean))
    const entityCount = entities.size
    const contractCount = dependencies.length
    const entityLabel = entityCount > 0
      ? `${entityCount} external vendor${entityCount !== 1 ? 's' : ''}`
      : `${contractCount} external dependenc${contractCount !== 1 ? 'ies' : 'y'}`
    findings.push({
      type: 'warning',
      title: entityLabel,
      detail: `The protocol depends on ${contractCount} external contract${contractCount !== 1 ? 's' : ''} from ${entityCount > 0 ? `${entityCount} vendor${entityCount !== 1 ? 's' : ''}` : 'external sources'}, introducing third-party risk. A failure or compromise in any dependency could affect protocol operations.`,
    })
  }

  // Mitigations
  const allMitigations: Mitigation[] = []
  let totalFnCount = 0
  let mitigatedFnCount = 0
  for (const admin of admins) {
    for (const fn of admin.functions) {
      if (fn.mitigations) allMitigations.push(...fn.mitigations)
      const reachableFunds = fn.reachableContracts
        .filter((rc) => rc.fundsAtRisk)
        .reduce((sum, rc) => sum + rc.fundsUsd, 0)
      if (fn.directFundsUsd <= 0 && reachableFunds <= 0) continue
      totalFnCount++
      if (fn.mitigations && fn.mitigations.length > 0) {
        mitigatedFnCount++
      }
    }
  }
  for (const dep of dependencies) {
    for (const fn of dep.functions) {
      if (fn.mitigations) allMitigations.push(...fn.mitigations)
    }
  }

  if (allMitigations.length > 0) {
    // Deduplicate mitigations
    const seen = new Set<string>()
    const unique: Mitigation[] = []
    for (const m of allMitigations) {
      const key = `${m.type}:${m.delaySeconds ?? ''}:${displayMitigationValue(m.valueRange?.min)}:${displayMitigationValue(m.valueRange?.max)}:${displayMitigationValue(m.relativeValue?.maxChangePercent)}:${m.description}`
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(m)
      }
    }

    const types = new Set<MitigationType>(unique.map((m) => m.type))
    const typeLabels: string[] = []
    if (types.has('delay')) {
      const delays = unique
        .filter((m) => m.type === 'delay' && m.delaySeconds !== undefined)
        .map((m) => m.delaySeconds!)
      const uniqueDelays = [...new Set(delays)].sort((a, b) => a - b)
      if (uniqueDelays.length > 0) {
        const formatted = uniqueDelays.map(formatDelayDuration)
        typeLabels.push(`time delays (${formatted.join(', ')})`)
      } else {
        typeLabels.push('time delays')
      }
    }
    if (types.has('valueRange')) typeLabels.push('value range limits')
    if (types.has('relativeValue')) typeLabels.push('relative value caps')
    if (types.has('other')) typeLabels.push('additional safeguards')

    const typeList =
      typeLabels.length > 1
        ? `${typeLabels.slice(0, -1).join(', ')} and ${typeLabels[typeLabels.length - 1]}`
        : typeLabels[0]

    findings.push({
      type: 'info',
      title: `${mitigatedFnCount} out of ${totalFnCount} functions with potential impact on funds have mitigations`,
      detail: `Taking into account only functions which can impact funds. Mitigations include ${typeList}.`,
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
  TVL: 'Total Value Locked — the total USD value of funds in the protocol that could be affected if an admin key is compromised or misused.',
  Immutable: 'A contract that cannot be changed after deployment — its code and behavior are permanently fixed on the blockchain.',
  CDP: 'Collateralized Debt Position — a mechanism where users lock collateral to borrow assets, commonly used in stablecoin protocols.',
  Oracle: 'A service that brings external data (like asset prices) onto the blockchain for smart contracts to use.',
  Governance: 'A contract or system that manages decision-making for a protocol, typically through token voting or delegated authority.',
}
