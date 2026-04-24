import type {
  CompiledAdmin,
  CompiledGovernanceDuration,
  CompiledReview,
} from '../types'

const DAY = 86_400
const HOUR = 3_600

function adminImpact(a: CompiledAdmin): number {
  return (a.totalReachableCapital ?? 0) + (a.totalReachableTokenValue ?? 0)
}

function computeVerifiability(review: CompiledReview): number {
  const { totals, audits = [] } = review
  const coverage = totals.coverage
  const loc = totals.linesOfCode ?? 0
  const auditCount = audits.length
  const maxBounty = audits.reduce((m, a) => Math.max(m, a.bounty ?? 0), 0)

  const coverageScore =
    coverage === undefined
      ? 40
      : coverage >= 1
        ? 50
        : coverage >= 0.95
          ? 40
          : coverage >= 0.9
            ? 20
            : 5

  const auditScore =
    auditCount === 0
      ? 0
      : auditCount === 1
        ? 10
        : auditCount === 2
          ? 18
          : auditCount === 3
            ? 22
            : 25

  const locScore =
    loc === 0
      ? 8
      : loc <= 5000
        ? 15
        : loc <= 10000
          ? 12
          : loc <= 20000
            ? 8
            : loc <= 50000
              ? 4
              : 1

  const bountyScore =
    maxBounty === 0
      ? 0
      : maxBounty < 100_000
        ? 2
        : maxBounty < 500_000
          ? 5
          : maxBounty < 1_000_000
            ? 7
            : 10

  return Math.min(
    100,
    Math.round(coverageScore + auditScore + locScore + bountyScore),
  )
}

const FIXED_UNIT_SECONDS: Record<string, number> = {
  second: 1,
  minute: 60,
  hour: HOUR,
  day: DAY,
  week: 7 * DAY,
}

function parseFixedDuration(value: string | undefined): number {
  if (!value) return 0
  const re = /(\d+(?:\.\d+)?)\s*(second|minute|hour|day|week)s?/gi
  let total = 0
  for (const m of value.matchAll(re)) {
    const n = Number.parseFloat(m[1])
    const factor = FIXED_UNIT_SECONDS[m[2].toLowerCase()]
    if (!Number.isNaN(n) && factor) total += n * factor
  }
  return total
}

function durationSeconds(d: CompiledGovernanceDuration | undefined): number {
  if (!d) return 0
  if (d.kind === 'none') return 0
  if (d.kind === 'fieldRef')
    return d.resolved && typeof d.seconds === 'number' ? d.seconds : 0
  if (d.kind === 'fixed') return parseFixedDuration(d.value)
  return 0
}

function computeGovernance(review: CompiledReview): number {
  const { admins, totals, governance } = review
  const tvs = totals.totalCapitalAtRisk + (totals.totalTokenValue ?? 0)

  const govAdmins = admins.filter((a) => a.isGovernance && adminImpact(a) > 0)

  // Short-circuit only when governance is undocumented AND no isGovernance
  // admin has fund impact — i.e. the protocol genuinely has no governance
  // layer. If governance is documented but no admin is tagged isGovernance
  // (e.g. offchain Snapshot + multisig executor), fall through and score it,
  // using all fund-impacting admins as the impact set.
  if (govAdmins.length === 0 && governance === undefined) return 95

  const execScore =
    governance === undefined
      ? 5
      : governance.voteExecution === 'onchain'
        ? 30
        : 10

  const delay =
    durationSeconds(governance?.proposalPeriod) +
    durationSeconds(governance?.executionDelay)
  const delayScore =
    delay >= 10 * DAY
      ? 35
      : delay >= 7 * DAY
        ? 28
        : delay >= 3 * DAY
          ? 18
          : delay >= 1 * DAY
            ? 10
            : delay >= 12 * HOUR
              ? 5
              : 2

  const impactAdmins =
    govAdmins.length > 0 ? govAdmins : admins.filter((a) => adminImpact(a) > 0)
  const govImpact = impactAdmins.reduce((s, a) => s + adminImpact(a), 0)
  // Admins can reach overlapping contracts, so raw sums may exceed TVS.
  // Cap share at 1.0 — the tier boundaries are what matters, not the ratio.
  const share = Math.min(1, tvs > 0 ? govImpact / tvs : govImpact > 0 ? 1 : 0)
  const impactScore =
    share <= 0.1 ? 30 : share <= 0.3 ? 22 : share <= 0.6 ? 12 : 5

  return Math.min(95, Math.round(execScore + delayScore + impactScore))
}

function computeControl(review: CompiledReview): number {
  const { admins, totals } = review
  const tvs = totals.totalCapitalAtRisk + (totals.totalTokenValue ?? 0)

  const impacting = admins.filter((a) => adminImpact(a) > 0)
  if (impacting.length === 0) return 90

  const hasEOA = impacting.some(
    (a) => a.adminType === 'EOA' || a.adminType === 'EOAPermissioned',
  )
  if (hasEOA) return 25

  const multisigs = impacting.filter((a) => a.adminType === 'Multisig')
  if (multisigs.length > 0) {
    const multisigImpact = multisigs.reduce((s, a) => s + adminImpact(a), 0)
    const share = tvs > 0 ? multisigImpact / tvs : 1
    return share < 0.3 ? 75 : 55
  }

  return 80
}

export function deriveRadarData(review: CompiledReview) {
  const { dependencies, totals, resources = [] } = review

  const depCount = dependencies.length
  const frontendCount = resources.filter((r) => r.type === 'frontend').length

  const control = computeControl(review)
  const deps =
    depCount === 0 ? 90 : depCount <= 2 ? 70 : depCount <= 5 ? 50 : 30
  const access =
    frontendCount === 0
      ? 20
      : frontendCount === 1
        ? 50
        : frontendCount <= 3
          ? 75
          : 90
  const verifiability = computeVerifiability(review)
  const governance = computeGovernance(review)

  return [
    { axis: 'CONTROL', value: control },
    { axis: 'DEPENDENCIES', value: deps },
    { axis: 'ACCESS', value: access },
    { axis: 'VERIFIABILITY', value: verifiability },
    { axis: 'GOVERNANCE', value: governance },
  ]
}
