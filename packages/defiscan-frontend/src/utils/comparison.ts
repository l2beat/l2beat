import type { CompiledReview } from '../types'
import { computeEntityDependencyCount } from './dependencies'

export interface ProtocolMetrics {
  slug: string
  name: string
  chain: string
  projectType: string
  tokenName: string
  contractCount: number
  permissionedFunctionCount: number
  adminCount: number
  dependencyCount: number
  totalCapitalAtRisk: number
  totalTokenValueAtRisk: number
  combinedValue: number
  capitalPerAdmin: number
  functionsPerAdmin: number
  dependencyDensity: number
  eoaAdminCount: number
  multisigAdminCount: number
  contractAdminCount: number
  timelockAdminCount: number
  revokedAdminCount: number
  governanceAdminCount: number
  dependencyEntities: { entity: string; count: number }[]
  color: string
}

const CHART_COLORS = [
  '#7C3AED', '#3B82F6', '#10B981', '#F59E0B',
  '#EF4444', '#EC4899', '#06B6D4', '#8B5CF6',
]

export function extractMetrics(review: CompiledReview, index: number): ProtocolMetrics {
  const { totals, admins, dependencies, metadata } = review
  const entityDepCount = computeEntityDependencyCount(dependencies)

  const eoaAdminCount = admins.filter((a) =>
    a.adminType === 'EOA' || a.adminType === 'EOAPermissioned',
  ).length
  const multisigAdminCount = admins.filter((a) => a.adminType === 'Multisig').length
  const contractAdminCount = admins.filter((a) =>
    a.adminType === 'Contract' || a.adminType === 'Diamond' || a.adminType === 'Untemplatized' || a.adminType === 'Immutable' || a.adminType === 'Upgradeable',
  ).length
  const timelockAdminCount = admins.filter((a) => a.adminType === 'Timelock').length
  const revokedAdminCount = admins.filter((a) =>
    a.adminType === 'Revoked',
  ).length
  const governanceAdminCount = admins.filter((a) => a.isGovernance).length

  const entityMap = new Map<string, number>()
  for (const dep of dependencies) {
    const entity = dep.entity ?? 'Unknown'
    entityMap.set(entity, (entityMap.get(entity) ?? 0) + 1)
  }
  const dependencyEntities = Array.from(entityMap.entries())
    .map(([entity, count]) => ({ entity, count }))
    .sort((a, b) => b.count - a.count)

  const combinedValue = totals.totalCapitalAtRisk + totals.totalTokenValueAtRisk

  return {
    slug: metadata.protocolSlug,
    name: metadata.protocolName,
    chain: metadata.chain,
    projectType: metadata.projectType,
    tokenName: metadata.tokenName,
    contractCount: totals.contractCount,
    permissionedFunctionCount: totals.permissionedFunctionCount,
    adminCount: totals.adminCount,
    dependencyCount: entityDepCount,
    totalCapitalAtRisk: totals.totalCapitalAtRisk,
    totalTokenValueAtRisk: totals.totalTokenValueAtRisk,
    combinedValue,
    capitalPerAdmin: totals.adminCount > 0 ? totals.totalCapitalAtRisk / totals.adminCount : 0,
    functionsPerAdmin: totals.adminCount > 0 ? totals.permissionedFunctionCount / totals.adminCount : 0,
    dependencyDensity: totals.contractCount > 0 ? entityDepCount / totals.contractCount : 0,
    eoaAdminCount,
    multisigAdminCount,
    contractAdminCount,
    timelockAdminCount,
    revokedAdminCount,
    governanceAdminCount,
    dependencyEntities,
    color: CHART_COLORS[index % CHART_COLORS.length] ?? '#7C3AED',
  }
}

export interface RadarDimension {
  dimension: string
  fullLabel: string
  [key: string]: string | number
}

export function buildRadarData(metrics: ProtocolMetrics[]): RadarDimension[] {
  if (metrics.length === 0) return []

  const maxCapital = Math.max(...metrics.map((m) => m.totalCapitalAtRisk), 1)
  const maxContracts = Math.max(...metrics.map((m) => m.contractCount), 1)
  const maxAdmins = Math.max(...metrics.map((m) => m.adminCount), 1)
  const maxDeps = Math.max(...metrics.map((m) => m.dependencyCount), 1)
  const maxFunctions = Math.max(...metrics.map((m) => m.permissionedFunctionCount), 1)

  const dimensions = [
    { key: 'capital', fullLabel: 'TVL', normalize: (m: ProtocolMetrics) => (m.totalCapitalAtRisk / maxCapital) * 100 },
    { key: 'contracts', fullLabel: 'Contracts', normalize: (m: ProtocolMetrics) => (m.contractCount / maxContracts) * 100 },
    { key: 'admins', fullLabel: 'Admin Count', normalize: (m: ProtocolMetrics) => (m.adminCount / maxAdmins) * 100 },
    { key: 'deps', fullLabel: 'Dependencies', normalize: (m: ProtocolMetrics) => (m.dependencyCount / maxDeps) * 100 },
    { key: 'functions', fullLabel: 'Perm. Functions', normalize: (m: ProtocolMetrics) => (m.permissionedFunctionCount / maxFunctions) * 100 },
  ]

  return dimensions.map((dim) => {
    const entry: RadarDimension = { dimension: dim.key, fullLabel: dim.fullLabel }
    for (const m of metrics) {
      entry[m.slug] = Math.round(dim.normalize(m))
    }
    return entry
  })
}

export function computeAverages(metrics: ProtocolMetrics[]) {
  if (metrics.length === 0) return null
  const n = metrics.length
  return {
    avgCapital: metrics.reduce((s, m) => s + m.totalCapitalAtRisk, 0) / n,
    avgAdmins: metrics.reduce((s, m) => s + m.adminCount, 0) / n,
    avgDeps: metrics.reduce((s, m) => s + m.dependencyCount, 0) / n,
    avgContracts: metrics.reduce((s, m) => s + m.contractCount, 0) / n,
    avgFunctions: metrics.reduce((s, m) => s + m.permissionedFunctionCount, 0) / n,
    avgCapitalPerAdmin: metrics.reduce((s, m) => s + m.capitalPerAdmin, 0) / n,
  }
}

export function buildSharedDependencies(reviews: CompiledReview[]) {
  const depMap = new Map<string, { name: string; entity: string | null; protocols: string[] }>()

  for (const review of reviews) {
    for (const dep of review.dependencies) {
      const key = dep.entity ?? dep.address
      const existing = depMap.get(key)
      if (existing) {
        if (!existing.protocols.includes(review.metadata.protocolName)) {
          existing.protocols.push(review.metadata.protocolName)
        }
      } else {
        depMap.set(key, {
          name: dep.entity ?? dep.name,
          entity: dep.entity,
          protocols: [review.metadata.protocolName],
        })
      }
    }
  }

  return Array.from(depMap.values()).sort((a, b) => b.protocols.length - a.protocols.length)
}
