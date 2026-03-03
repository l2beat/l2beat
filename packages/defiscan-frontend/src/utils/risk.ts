import type { CompiledReview } from '../types'

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MINIMAL'

export interface ProtocolRiskProfile {
  slug: string
  name: string
  chain: string
  projectType: string
  overallRisk: RiskLevel
  riskScore: number // 0-100 (100 = highest risk)
  capitalAtRisk: number
  tokenValueAtRisk: number
  totalExposure: number
  adminBreakdown: Record<string, number>
  adminCount: number
  dependencyCount: number
  contractCount: number
  permissionedFunctions: number
  hasEOAAdmin: boolean
  hasMultisigAdmin: boolean
  hasTimelockAdmin: boolean
  keyRiskFactors: string[]
}

export function computeRiskScore(review: CompiledReview): number {
  let score = 0

  // Admin type risk (0-40 points)
  const adminTypes = review.admins.map((a) => a.adminType)
  if (adminTypes.includes('EOA') || adminTypes.includes('EOAPermissioned')) {
    score += 40
  } else if (adminTypes.some((t) => t === 'Multisig')) {
    score += 20
  } else if (adminTypes.some((t) => t === 'Timelock')) {
    score += 10
  }
  // No additional risk for immutable-only admins (or zero admins)


  // Dependency concentration (0-25 points)
  const depCount = review.totals.dependencyCount
  if (depCount >= 5) score += 25
  else if (depCount >= 3) score += 15
  else if (depCount >= 1) score += 8

  // Capital concentration (0-20 points)
  const totalCap = review.totals.totalCapitalAtRisk
  if (totalCap > 500_000_000) score += 20
  else if (totalCap > 100_000_000) score += 15
  else if (totalCap > 10_000_000) score += 10
  else if (totalCap > 0) score += 5

  // Permissioned function density (0-15 points)
  const funcRatio = review.totals.permissionedFunctionCount / Math.max(review.totals.contractCount, 1)
  if (funcRatio > 3) score += 15
  else if (funcRatio > 1.5) score += 10
  else if (funcRatio > 0) score += 5

  return Math.min(100, score)
}

export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 70) return 'CRITICAL'
  if (score >= 50) return 'HIGH'
  if (score >= 35) return 'MEDIUM'
  if (score >= 20) return 'LOW'
  return 'MINIMAL'
}

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case 'CRITICAL': return '#EF4444'
    case 'HIGH': return '#F97316'
    case 'MEDIUM': return '#F59E0B'
    case 'LOW': return '#10B981'
    case 'MINIMAL': return '#06B6D4'
  }
}

export function riskBgClass(level: RiskLevel): string {
  switch (level) {
    case 'CRITICAL': return 'bg-risk-critical/10 text-risk-critical border-risk-critical/20'
    case 'HIGH': return 'bg-risk-high/10 text-risk-high border-risk-high/20'
    case 'MEDIUM': return 'bg-risk-medium/10 text-risk-medium border-risk-medium/20'
    case 'LOW': return 'bg-risk-low/10 text-risk-low border-risk-low/20'
    case 'MINIMAL': return 'bg-risk-minimal/10 text-risk-minimal border-risk-minimal/20'
  }
}

export function buildRiskProfile(review: CompiledReview): ProtocolRiskProfile {
  const score = computeRiskScore(review)
  const adminBreakdown: Record<string, number> = {}
  for (const admin of review.admins) {
    adminBreakdown[admin.adminType] = (adminBreakdown[admin.adminType] ?? 0) + 1
  }

  const hasEOA = review.admins.some((a) => a.adminType === 'EOA' || a.adminType === 'EOAPermissioned')
  const hasMultisig = review.admins.some((a) => a.adminType === 'Multisig')
  const hasTimelock = review.admins.some((a) => a.adminType === 'Timelock')

  const keyRiskFactors: string[] = []
  if (hasEOA) keyRiskFactors.push('EOA admin detected')
  if (review.totals.dependencyCount > 3) keyRiskFactors.push('High dependency count')
  if (review.totals.totalCapitalAtRisk > 100_000_000) keyRiskFactors.push('Large capital exposure')
  if (!hasTimelock && hasMultisig) keyRiskFactors.push('No timelock protection')

  return {
    slug: review.metadata.protocolSlug,
    name: review.metadata.protocolName,
    chain: review.metadata.chain,
    projectType: review.metadata.projectType,
    overallRisk: riskLevelFromScore(score),
    riskScore: score,
    capitalAtRisk: review.totals.totalCapitalAtRisk,
    tokenValueAtRisk: review.totals.totalTokenValueAtRisk,
    totalExposure: review.totals.totalCapitalAtRisk + review.totals.totalTokenValueAtRisk,
    adminBreakdown,
    adminCount: review.totals.adminCount,
    dependencyCount: review.totals.dependencyCount,
    contractCount: review.totals.contractCount,
    permissionedFunctions: review.totals.permissionedFunctionCount,
    hasEOAAdmin: hasEOA,
    hasMultisigAdmin: hasMultisig,
    hasTimelockAdmin: hasTimelock,
    keyRiskFactors,
  }
}

export function getAdminTypeDistribution(reviews: CompiledReview[]): Record<string, number> {
  const dist: Record<string, number> = {}
  for (const r of reviews) {
    for (const a of r.admins) {
      dist[a.adminType] = (dist[a.adminType] ?? 0) + 1
    }
  }
  return dist
}
