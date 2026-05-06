import type { CompiledReview, Mitigation, MitigationType } from '../types'
import { displayMitigationValue } from '../types'
import { formatUsdValue } from './format'

export interface KeyFinding {
  type: 'positive' | 'warning' | 'critical' | 'info'
  title: string
  detail: string
}

/**
 * Top-level entry point: run every detector against the review and return the
 * findings they produce. Each detector is self-contained — add a new finding
 * by writing a new detector and adding it to the array below.
 */
export function getKeyFindings(review: CompiledReview): KeyFinding[] {
  return DETECTORS.map((d) => d(review)).filter(
    (f): f is KeyFinding => f !== null,
  )
}

type Detector = (review: CompiledReview) => KeyFinding | null

const DETECTORS: Detector[] = [
  detectImmutability,
  detectEOAs,
  detectMultisigs,
  detectTotalValueSecured,
  detectDependencies,
  detectMitigations,
]

// ---------------------------------------------------------------------------
// Detectors
// ---------------------------------------------------------------------------

/**
 * Returns a finding for either:
 *  - full admin immutability (no human or governance controls any admin), or
 *  - code immutability (every in-scope protocol contract is immutable bytecode,
 *    even if a multisig can still tweak parameters).
 * Otherwise null.
 */
function detectImmutability(review: CompiledReview): KeyFinding | null {
  const { admins } = review

  const hasHumanOrGov = admins.some(
    (a) =>
      a.adminType === 'EOA' ||
      a.adminType === 'EOAPermissioned' ||
      a.adminType === 'Multisig' ||
      a.adminType === 'Timelock' ||
      a.isGovernance,
  )

  if (!hasHumanOrGov && admins.length > 0) {
    return {
      type: 'positive',
      title: 'Fully immutable protocol',
      detail:
        'All admin controls resolve to immutable contracts or revoked addresses. No admin can modify protocol behavior after deployment.',
    }
  }

  if (isProtocolCodeImmutable(review)) {
    return {
      type: 'positive',
      title: 'Immutable code',
      detail:
        'Every protocol contract is deployed as immutable bytecode. Admins can still write to on-chain parameters exposed by these contracts, but they cannot change the code itself.',
    }
  }

  return null
}

function detectEOAs(review: CompiledReview): KeyFinding | null {
  const eoas = review.admins.filter(
    (a) => a.adminType === 'EOA' || a.adminType === 'EOAPermissioned',
  )
  if (eoas.length === 0) return null

  const maxCapital = Math.max(...eoas.map((e) => e.totalReachableCapital))
  if (maxCapital <= 0) return null

  return {
    type: 'critical',
    title: `${eoas.length} EOA${eoas.length > 1 ? 's' : ''} with permissioned access`,
    detail: `Externally owned account${eoas.length > 1 ? 's' : ''} can execute critical functions affecting up to ${formatUsdValue(maxCapital)} in TVL.`,
  }
}

function detectMultisigs(review: CompiledReview): KeyFinding | null {
  const multisigs = review.admins.filter((a) => a.adminType === 'Multisig')
  if (multisigs.length === 0) return null

  const maxCapital = Math.max(...multisigs.map((m) => m.totalReachableCapital))
  if (maxCapital <= 0) return null

  return {
    type: 'warning',
    title: `${multisigs.length} multisig${multisigs.length > 1 ? 's' : ''} with permissioned access`,
    detail: `Multisig wallets provide distributed control but still require trust in a known group of signers. ${multisigs.map((m) => m.name).join(', ')}.`,
  }
}

function detectTotalValueSecured(review: CompiledReview): KeyFinding | null {
  const { totals } = review
  const tokenValue = totals.totalTokenValue ?? totals.totalTokenValueAtRisk
  const tvs = totals.totalCapitalAtRisk + tokenValue
  if (tvs <= 0) return null

  const hasToken = tokenValue > 0
  const hasTvl = totals.totalCapitalAtRisk > 0

  let detail: string
  if (hasToken && hasTvl) {
    detail = `Total Value Secured by the protocol: ${formatUsdValue(totals.totalCapitalAtRisk)} in TVL (funds locked in protocol contracts) and ${formatUsdValue(tokenValue)} in protocol token market cap.`
  } else if (hasTvl) {
    detail = `Total Value Secured by the protocol, consisting of ${formatUsdValue(totals.totalCapitalAtRisk)} in TVL (tokens held in contracts).`
  } else {
    detail = `Total Value Secured by the protocol, consisting of ${formatUsdValue(tokenValue)} in protocol token market cap.`
  }

  return {
    type: 'info',
    title: `${formatUsdValue(tvs)} TVS`,
    detail,
  }
}

function detectDependencies(review: CompiledReview): KeyFinding | null {
  const { dependencies } = review
  if (dependencies.length === 0) {
    return {
      type: 'positive',
      title: 'Fully autonomous protocol',
      detail:
        'The protocol does not depend on any external contracts, operating entirely through its own on-chain logic.',
    }
  }

  const entities = new Set(dependencies.map((d) => d.entity).filter(Boolean))
  const entityCount = entities.size
  const contractCount = dependencies.length
  const entityLabel =
    entityCount > 0
      ? `${entityCount} external vendor${entityCount !== 1 ? 's' : ''}`
      : `${contractCount} external dependenc${contractCount !== 1 ? 'ies' : 'y'}`

  return {
    type: 'warning',
    title: entityLabel,
    detail: `The protocol depends on ${contractCount} external contract${contractCount !== 1 ? 's' : ''} from ${entityCount > 0 ? `${entityCount} vendor${entityCount !== 1 ? 's' : ''}` : 'external sources'}, introducing third-party risk. A failure or compromise in any dependency could affect protocol operations.`,
  }
}

function detectMitigations(review: CompiledReview): KeyFinding | null {
  const { totalFnCount, mitigatedFnCount, mitigations } =
    collectMitigations(review)
  if (mitigations.length === 0 || mitigatedFnCount === 0) return null

  const unique = deduplicateMitigations(mitigations)
  const typeList = formatMitigationTypeList(unique)

  return {
    type: 'info',
    title: `${mitigatedFnCount} out of ${totalFnCount} functions with potential impact on funds have mitigations`,
    detail: `Taking into account only functions which can impact funds. Mitigations include ${typeList}.`,
  }
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/**
 * Code immutability — distinct from admin immutability. True when every
 * in-scope protocol contract is deployed as immutable bytecode, even if a
 * multisig exists to tweak on-chain parameters. The multisig cannot swap
 * implementations, so its reach is bounded to parameters on already-deployed
 * code. Excludes Gnosis Safes (signer-set wallets, not protocol logic) and
 * EOAs (keepers, foundation addresses) — they're the governance layer.
 */
function isProtocolCodeImmutable(review: CompiledReview): boolean {
  const NON_PROTOCOL_PROXY_TYPES = new Set(['gnosis safe', 'EOA'])
  const protocolContracts = review.contracts.filter(
    (c) => !c.isExternal && !NON_PROTOCOL_PROXY_TYPES.has(c.proxyType ?? ''),
  )
  return (
    protocolContracts.length > 0 &&
    protocolContracts.every((c) => (c.proxyType ?? '') === 'immutable')
  )
}

function collectMitigations(review: CompiledReview): {
  mitigations: Mitigation[]
  totalFnCount: number
  mitigatedFnCount: number
} {
  const mitigations: Mitigation[] = []
  let totalFnCount = 0
  let mitigatedFnCount = 0

  for (const admin of review.admins) {
    for (const fn of admin.functions) {
      if (fn.mitigations) mitigations.push(...fn.mitigations)
      const reachableFunds = fn.reachableContracts
        .filter((rc) => rc.fundsAtRisk)
        .reduce((sum, rc) => sum + rc.fundsUsd, 0)
      if (fn.directFundsUsd <= 0 && reachableFunds <= 0) continue
      totalFnCount++
      if (fn.mitigations && fn.mitigations.length > 0) mitigatedFnCount++
    }
  }

  for (const dep of review.dependencies) {
    for (const fn of dep.functions) {
      if (fn.mitigations) mitigations.push(...fn.mitigations)
    }
  }

  return { mitigations, totalFnCount, mitigatedFnCount }
}

function deduplicateMitigations(mitigations: Mitigation[]): Mitigation[] {
  const seen = new Set<string>()
  const unique: Mitigation[] = []
  for (const m of mitigations) {
    const key = `${m.type}:${m.delaySeconds ?? ''}:${displayMitigationValue(m.valueRange?.min)}:${displayMitigationValue(m.valueRange?.max)}:${displayMitigationValue(m.relativeValue?.maxChangePercent)}:${m.description}`
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(m)
    }
  }
  return unique
}

function formatMitigationTypeList(mitigations: Mitigation[]): string {
  const types = new Set<MitigationType>(mitigations.map((m) => m.type))
  const typeLabels: string[] = []

  if (types.has('delay')) {
    const delays: number[] = []
    for (const m of mitigations) {
      if (m.type === 'delay' && m.delaySeconds !== undefined) {
        delays.push(m.delaySeconds)
      }
    }
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

  return typeLabels.length > 1
    ? `${typeLabels.slice(0, -1).join(', ')} and ${typeLabels[typeLabels.length - 1]}`
    : (typeLabels[0] ?? '')
}

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
