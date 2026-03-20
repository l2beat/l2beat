import type {
  ConfigReader,
  DiscoveryPaths,
  TemplateService,
} from '@l2beat/discovery'
import { addressesEqual, normalizeChainAddress } from './addressUtils'
import { ProjectAnalysis } from './projectAnalysis'
import { calculateV2Score } from './v2Scoring'

// ============================================================================
// Comparison Types
// ============================================================================

interface FunctionDiff {
  contractAddress: string
  functionName: string
  field: string
  oldValue: unknown
  newValue: unknown
}

interface AdminDiff {
  adminAddress: string
  issue: string
  details?: Record<string, unknown>
}

export interface ComparisonResult {
  project: string
  timestamp: string
  summary: {
    adminCountOld: number
    adminCountNew: number
    totalCapitalOld: number
    totalCapitalNew: number
    totalTokenValueOld: number
    totalTokenValueNew: number
    diffCount: number
  }
  adminDiffs: AdminDiff[]
  functionDiffs: FunctionDiff[]
}

// ============================================================================
// Comparison Logic
// ============================================================================

/**
 * Compare v2Scoring output against ProjectAnalysis output for a project.
 * Returns a diff report highlighting any data mismatches.
 */
export function compareScoring(
  paths: DiscoveryPaths,
  configReader: ConfigReader,
  templateService: TemplateService,
  projectName: string,
): ComparisonResult {
  // Compute both
  const v2Score = calculateV2Score(
    paths,
    configReader,
    templateService,
    projectName,
  )
  const analysis = new ProjectAnalysis(
    paths,
    configReader,
    templateService,
    projectName,
  )
  const adminsResult = analysis.getAdmins()

  const adminDiffs: AdminDiff[] = []
  const functionDiffs: FunctionDiff[] = []

  const oldAdmins = v2Score.inventory.admins.breakdown ?? []
  const newAdmins = adminsResult.admins

  // Compare admin counts
  if (oldAdmins.length !== newAdmins.length) {
    adminDiffs.push({
      adminAddress: '*',
      issue: 'admin_count_mismatch',
      details: { old: oldAdmins.length, new: newAdmins.length },
    })
  }

  // Build lookup maps
  const oldByAddr = new Map(
    oldAdmins.map((a) => [normalizeChainAddress(a.adminAddress), a]),
  )
  const newByAddr = new Map(
    newAdmins.map((a) => [normalizeChainAddress(a.address), a]),
  )

  // Check for admins in old but not new
  for (const [addr, oldAdmin] of oldByAddr) {
    if (!newByAddr.has(addr)) {
      adminDiffs.push({
        adminAddress: oldAdmin.adminAddress,
        issue: 'missing_in_new',
        details: {
          name: oldAdmin.adminName,
          type: oldAdmin.adminType,
          functionCount: oldAdmin.functions.length,
        },
      })
    }
  }

  // Check for admins in new but not old
  for (const [addr, newAdmin] of newByAddr) {
    if (!oldByAddr.has(addr)) {
      adminDiffs.push({
        adminAddress: newAdmin.address,
        issue: 'missing_in_old',
        details: {
          name: newAdmin.name,
          type: newAdmin.type,
          functionCount: newAdmin.functions.length,
        },
      })
    }
  }

  // Compare matching admins
  for (const [addr, oldAdmin] of oldByAddr) {
    const newAdmin = newByAddr.get(addr)
    if (!newAdmin) continue

    // Compare type
    if (oldAdmin.adminType !== newAdmin.type) {
      adminDiffs.push({
        adminAddress: oldAdmin.adminAddress,
        issue: 'type_mismatch',
        details: { old: oldAdmin.adminType, new: newAdmin.type },
      })
    }

    // Compare function count
    if (oldAdmin.functions.length !== newAdmin.functions.length) {
      adminDiffs.push({
        adminAddress: oldAdmin.adminAddress,
        issue: 'function_count_mismatch',
        details: {
          old: oldAdmin.functions.length,
          new: newAdmin.functions.length,
        },
      })
    }

    // Compare capital if available
    const oldWithCapital = oldAdmin as any
    if ('totalDirectCapital' in oldWithCapital) {
      if (oldWithCapital.totalDirectCapital !== newAdmin.totalDirectCapital) {
        functionDiffs.push({
          contractAddress: oldAdmin.adminAddress,
          functionName: '*',
          field: 'totalDirectCapital',
          oldValue: oldWithCapital.totalDirectCapital,
          newValue: newAdmin.totalDirectCapital,
        })
      }
      if (
        oldWithCapital.totalReachableCapital !== newAdmin.totalReachableCapital
      ) {
        functionDiffs.push({
          contractAddress: oldAdmin.adminAddress,
          functionName: '*',
          field: 'totalReachableCapital',
          oldValue: oldWithCapital.totalReachableCapital,
          newValue: newAdmin.totalReachableCapital,
        })
      }
    }

    // Compare per-function impact
    for (const oldFunc of oldAdmin.functions) {
      const newFunc = newAdmin.functions.find(
        (f) =>
          addressesEqual(f.contractAddress, oldFunc.contractAddress) &&
          f.functionName === oldFunc.functionName,
      )
      if (!newFunc) {
        functionDiffs.push({
          contractAddress: oldFunc.contractAddress,
          functionName: oldFunc.functionName,
          field: 'missing_in_new',
          oldValue: oldFunc.impact,
          newValue: undefined,
        })
        continue
      }
      if (oldFunc.impact !== newFunc.impact) {
        functionDiffs.push({
          contractAddress: oldFunc.contractAddress,
          functionName: oldFunc.functionName,
          field: 'impact',
          oldValue: oldFunc.impact,
          newValue: newFunc.impact,
        })
      }
    }
  }

  return {
    project: projectName,
    timestamp: new Date().toISOString(),
    summary: {
      adminCountOld: oldAdmins.length,
      adminCountNew: newAdmins.length,
      totalCapitalOld: v2Score.inventory.admins.totalCapitalAtRisk ?? 0,
      totalCapitalNew: adminsResult.totals.totalCapitalAtRisk,
      totalTokenValueOld: v2Score.inventory.admins.totalTokenValueAtRisk ?? 0,
      totalTokenValueNew: adminsResult.totals.totalTokenValueAtRisk,
      diffCount: adminDiffs.length + functionDiffs.length,
    },
    adminDiffs,
    functionDiffs,
  }
}
