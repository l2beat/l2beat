import type { CompiledAdmin, CompiledReview } from '../types'

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
  const exit = 65

  return [
    { axis: 'CONTROL', value: control },
    { axis: 'DEPENDENCIES', value: deps },
    { axis: 'ACCESS', value: access },
    { axis: 'VERIFIABILITY', value: verifiability },
    { axis: 'ABILITY TO EXIT', value: exit },
  ]
}
