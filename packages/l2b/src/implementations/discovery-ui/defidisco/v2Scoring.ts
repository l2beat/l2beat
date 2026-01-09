import type {
  ConfigReader,
  DiscoveryPaths,
  TemplateService,
} from '@l2beat/discovery'
import { getProject } from '../getProject'
import { getContractTags } from './contractTags'
import {
  extractAddressesFromResolvedOwners,
  getFunctions,
  resolveOwnersFromDiscovered,
} from './functions'
import type {
  AdminDetail,
  ApiAddressType,
  DependencyDetail,
  FunctionDetail,
  Impact,
  Likelihood,
  Severity,
} from './types'

// ============================================================================
// Type Definitions
// ============================================================================

export type LetterGrade =
  | 'AAA'
  | 'AA'
  | 'A'
  | 'BBB'
  | 'BB'
  | 'B'
  | 'CCC'
  | 'CC'
  | 'C'
  | 'D'
  | 'Unscored'

export interface ModuleScore {
  grade: LetterGrade
  inventory: number
}

export interface FunctionModuleScore extends ModuleScore {
  breakdown?: Record<LetterGrade, FunctionDetail[]>
  unscoredCount?: number
}

export interface DependencyModuleScore extends ModuleScore {
  breakdown?: DependencyDetail[]
}

export interface AdminModuleScore extends ModuleScore {
  breakdown?: AdminDetail[]
}

// ============================================================================
// Severity Scoring Functions
// ============================================================================

/**
 * Severity level mapping: Impact × Likelihood → Severity
 *
 * Maps the combination of impact and likelihood to a severity level string.
 * This table is used for textual severity classification.
 *
 * Table format:
 * Impact \ Likelihood | Mitigated     | Low       | Medium    | High
 * Critical            | Medium        | High      | Critical  | Critical
 * High                | Low           | Medium    | Medium    | High
 * Medium              | Informational | Low       | Medium    | High
 * Low                 | Informational | Informational | Low   | Medium
 */
const SEVERITY_LEVEL_MAP: Record<Impact, Record<Likelihood, Severity>> = {
  critical: {
    mitigated: 'medium',
    low: 'high',
    medium: 'critical',
    high: 'critical',
  },
  high: {
    mitigated: 'low',
    low: 'medium',
    medium: 'medium',
    high: 'high',
  },
  medium: {
    mitigated: 'informational',
    low: 'low',
    medium: 'medium',
    high: 'high',
  },
  low: {
    mitigated: 'informational',
    low: 'informational',
    medium: 'low',
    high: 'medium',
  },
}

/**
 * Grade mapping: Impact × Likelihood → LetterGrade
 *
 * Maps the combination of impact and likelihood to a letter grade.
 * This table is used for quantitative risk scoring.
 *
 * Table format:
 * Impact \ Likelihood | Mitigated | Low  | Medium | High
 * Critical            | B         | C    | D      | D
 * High                | A         | BB   | CC     | D
 * Medium              | AA        | A    | BBB    | CCC
 * Low                 | AA        | AA   | A      | BBB
 */
const SEVERITY_GRADE_MAP: Record<Impact, Record<Likelihood, LetterGrade>> = {
  critical: {
    mitigated: 'B',
    low: 'C',
    medium: 'D',
    high: 'D',
  },
  high: {
    mitigated: 'A',
    low: 'BB',
    medium: 'CC',
    high: 'D',
  },
  medium: {
    mitigated: 'AA',
    low: 'A',
    medium: 'BBB',
    high: 'CCC',
  },
  low: {
    mitigated: 'AA',
    low: 'AA',
    medium: 'A',
    high: 'BBB',
  },
}

/**
 * Get severity level from impact and likelihood.
 * Returns the textual severity classification.
 *
 * @param impact - The impact level (low, medium, high, critical)
 * @param likelihood - The likelihood level (mitigated, low, medium, high)
 * @returns The severity level (informational, low, medium, high, critical)
 */
export function getSeverityLevel(
  impact: Impact,
  likelihood: Likelihood,
): Severity {
  return SEVERITY_LEVEL_MAP[impact][likelihood]
}

/**
 * Get severity grade from impact and likelihood.
 * Returns the letter grade for quantitative scoring.
 *
 * @param impact - The impact level (low, medium, high, critical)
 * @param likelihood - The likelihood level (mitigated, low, medium, high)
 * @returns The letter grade (AAA through D)
 */
export function getSeverityGrade(
  impact: Impact,
  likelihood: Likelihood,
): LetterGrade {
  return SEVERITY_GRADE_MAP[impact][likelihood]
}

export interface V2ScoreResult {
  inventory: {
    contracts: ModuleScore
    functions: FunctionModuleScore
    dependencies: DependencyModuleScore
    admins: AdminModuleScore
  }
  finalScore: LetterGrade
}

interface ScoringData {
  projectData: any
  permissionOverrides: any
  contractTags: any
  functions: any
  paths: DiscoveryPaths
  projectName: string
}

// ============================================================================
// Grade Utility Functions
// ============================================================================

const GRADE_TO_NUMERIC: Record<LetterGrade, number> = {
  AAA: 10,
  AA: 9,
  A: 8,
  BBB: 7,
  BB: 6,
  B: 5,
  CCC: 4,
  CC: 3,
  C: 2,
  D: 1,
  Unscored: 0, // Special value - doesn't affect grade calculations
}

const NUMERIC_TO_GRADE: LetterGrade[] = [
  'D', // 0-1
  'D', // 1-2
  'C', // 2-3
  'CC', // 3-4
  'CCC', // 4-5
  'B', // 5-6
  'BB', // 6-7
  'BBB', // 7-8
  'A', // 8-9
  'AA', // 9-10
  'AAA', // 10
]

export function gradeToNumeric(grade: LetterGrade): number {
  return GRADE_TO_NUMERIC[grade]
}

export function numericToGrade(score: number): LetterGrade {
  // Clamp between 1-10
  const clamped = Math.max(1, Math.min(10, Math.round(score)))
  return NUMERIC_TO_GRADE[clamped] || 'D'
}

export function aggregateGrades(grades: LetterGrade[]): LetterGrade {
  if (grades.length === 0) return 'D'

  // Final score = worst score among all modules
  const numericScores = grades.map(gradeToNumeric)
  const worstScore = Math.min(...numericScores)

  return numericToGrade(worstScore)
}

// ============================================================================
// Scoring Modules
// ============================================================================

/**
 * Base interface for scoring modules
 */
interface ScoringModule {
  name: string
  calculate(
    data: ScoringData,
  ):
    | ModuleScore
    | FunctionModuleScore
    | DependencyModuleScore
    | AdminModuleScore
}

/**
 * Contract Inventory Module
 * Counts total contracts (initial + discovered, excluding EOAs)
 * Scoring: fewer contracts = better grade
 *
 * NOTE: Thresholds below are TEMPORARY PLACEHOLDER logic and will be replaced
 * with proper V2 framework scoring criteria in the future.
 */
class ContractInventoryModule implements ScoringModule {
  name = 'contracts'

  calculate(data: ScoringData): ModuleScore {
    let contractCount = 0

    data.projectData.entries.forEach((entry: any) => {
      contractCount += entry.initialContracts?.length || 0
      contractCount += entry.discoveredContracts?.length || 0
      // Don't count EOAs
    })

    // TEMPORARY PLACEHOLDER THRESHOLDS - will be replaced with proper V2 logic
    const grade = this.countToGrade(contractCount)

    return { grade, inventory: contractCount }
  }

  private countToGrade(count: number): LetterGrade {
    if (count < 5) return 'AAA'
    if (count < 10) return 'AA'
    if (count < 15) return 'A'
    if (count < 20) return 'BBB'
    if (count < 25) return 'BB'
    if (count < 30) return 'B'
    if (count < 35) return 'CCC'
    if (count < 40) return 'CC'
    if (count < 50) return 'C'
    return 'D'
  }
}

/**
 * Function Inventory Module
 * Scores permissioned functions based on Impact × Likelihood
 * Module grade = worst function grade
 * Provides detailed breakdown of functions by grade
 */
class FunctionInventoryModule implements ScoringModule {
  name = 'functions'

  calculate(data: ScoringData): FunctionModuleScore {
    const breakdown: Record<LetterGrade, FunctionDetail[]> = {
      D: [],
      C: [],
      CC: [],
      CCC: [],
      B: [],
      BB: [],
      BBB: [],
      A: [],
      AA: [],
      AAA: [],
      Unscored: [],
    }

    let functionCount = 0
    let unscoredCount = 0
    let worstGrade: LetterGrade = 'AAA'
    const ownerResolutionCache = new Map<string, string[]>()

    if (data.permissionOverrides?.contracts) {
      Object.entries(data.permissionOverrides.contracts).forEach(
        ([contractAddress, contractData]: [string, any]) => {
          contractData.functions?.forEach((func: any) => {
            if (func.isPermissioned === true) {
              functionCount++

              // Skip if function doesn't have impact
              if (!func.score || func.score === 'unscored') {
                return
              }

              // Map score field to Impact
              const impactMap: Record<string, Impact> = {
                'low-risk': 'low',
                'medium-risk': 'medium',
                'high-risk': 'high',
                critical: 'critical',
              }

              const impact = impactMap[func.score]
              if (!impact) return

              // Determine effective likelihood: function likelihood OR owner likelihood
              let effectiveLikelihood: Likelihood | undefined = func.likelihood

              // If no function likelihood, try to get owner likelihood
              if (
                !effectiveLikelihood &&
                func.ownerDefinitions &&
                func.ownerDefinitions.length > 0
              ) {
                // Create cache key from owner definitions
                const cacheKey = JSON.stringify(func.ownerDefinitions)

                // Check cache first
                let adminAddresses = ownerResolutionCache.get(cacheKey)
                if (!adminAddresses) {
                  // Cache miss - resolve and store
                  const resolved = resolveOwnersFromDiscovered(
                    data.paths,
                    data.projectName,
                    contractAddress,
                    func.ownerDefinitions,
                  )
                  // Extract all addresses from resolved owners
                  adminAddresses = extractAddressesFromResolvedOwners(resolved)
                  ownerResolutionCache.set(cacheKey, adminAddresses)
                }

                // Use worst-case (highest risk) likelihood among all owners
                // For security analysis, if ANY owner has high likelihood, the function inherits that risk
                if (adminAddresses && adminAddresses.length > 0) {
                  const likelihoodPriority: Record<Likelihood, number> = {
                    high: 4,
                    medium: 3,
                    low: 2,
                    mitigated: 1,
                  }

                  let worstLikelihood: Likelihood | undefined = undefined
                  let worstPriority = 0

                  for (const ownerAddr of adminAddresses) {
                    const normalizedAddr = ownerAddr.toLowerCase()
                    const tag = data.contractTags?.tags?.find(
                      (tag: any) =>
                        tag.contractAddress.toLowerCase() === normalizedAddr,
                    )

                    if (tag?.likelihood) {
                      const likelihood = tag.likelihood as Likelihood
                      const priority = likelihoodPriority[likelihood]
                      if (priority > worstPriority) {
                        worstPriority = priority
                        worstLikelihood = likelihood
                      }
                    }
                  }

                  effectiveLikelihood = worstLikelihood
                }
              }

              // Resolve contract name from projectData
              const contractName = this.getContractName(
                data.projectData,
                contractAddress,
              )

              // If we have both impact and likelihood, calculate grade
              if (effectiveLikelihood) {
                const severity = getSeverityLevel(impact, effectiveLikelihood)
                const grade = getSeverityGrade(impact, effectiveLikelihood)

                // Add to breakdown
                breakdown[grade].push({
                  contractAddress,
                  contractName,
                  functionName: func.functionName,
                  impact,
                  likelihood: effectiveLikelihood,
                  severity,
                  grade,
                })

                // Track worst grade (excluding Unscored)
                if (
                  this.gradeToNumeric(grade) < this.gradeToNumeric(worstGrade)
                ) {
                  worstGrade = grade
                }
              } else {
                // Has impact but no likelihood source - add to Unscored
                unscoredCount++
                breakdown['Unscored'].push({
                  contractAddress,
                  contractName,
                  functionName: func.functionName,
                  impact,
                  likelihood: 'low', // Placeholder for type compatibility
                  severity: 'informational',
                  grade: 'Unscored',
                })
              }
            }
          })
        },
      )
    }

    // If no functions have been scored, use count-based fallback
    const scoredCount = Object.entries(breakdown)
      .filter(([grade]) => grade !== 'Unscored')
      .flatMap(([_, functions]) => functions).length

    if (scoredCount === 0 && unscoredCount === 0) {
      worstGrade = this.countToGrade(functionCount)
    }

    return {
      grade: worstGrade,
      inventory: functionCount,
      breakdown,
      unscoredCount,
    }
  }

  private getContractName(projectData: any, contractAddress: string): string {
    if (!projectData?.entries) return contractAddress

    // Normalize address for comparison (remove eth: prefix if present)
    const normalizedAddress = contractAddress.replace('eth:', '')

    for (const entry of projectData.entries) {
      // Check both initialContracts and discoveredContracts
      const contracts = [
        ...(entry.initialContracts || []),
        ...(entry.discoveredContracts || []),
      ]

      for (const contract of contracts) {
        const entryAddress = contract.address.replace('eth:', '')
        if (entryAddress === normalizedAddress) {
          return contract.name || contractAddress
        }
      }
    }

    return contractAddress
  }

  private gradeToNumeric(grade: LetterGrade): number {
    const map: Record<LetterGrade, number> = {
      AAA: 10,
      AA: 9,
      A: 8,
      BBB: 7,
      BB: 6,
      B: 5,
      CCC: 4,
      CC: 3,
      C: 2,
      D: 1,
      Unscored: 0,
    }
    return map[grade]
  }

  private countToGrade(count: number): LetterGrade {
    if (count < 3) return 'AAA'
    if (count < 6) return 'AA'
    if (count < 10) return 'A'
    if (count < 15) return 'BBB'
    if (count < 20) return 'BB'
    if (count < 25) return 'B'
    if (count < 30) return 'CCC'
    if (count < 35) return 'CC'
    if (count < 45) return 'C'
    return 'D'
  }
}

/**
 * Dependency Inventory Module
 * Analyzes functions that depend on external contracts
 * Combines function impact × dependency likelihood to calculate grades
 *
 * Overall grade = worst grade among all function-dependency combinations
 */
class DependencyInventoryModule {
  name = 'dependencies'

  /**
   * Convert score field to Impact type
   * score: 'low-risk' | 'medium-risk' | 'high-risk' | 'critical' | 'unscored'
   * impact: 'low' | 'medium' | 'high' | 'critical'
   */
  private scoreToImpact(score?: string): Impact | undefined {
    if (!score || score === 'unscored') return undefined

    switch (score) {
      case 'low-risk':
        return 'low'
      case 'medium-risk':
        return 'medium'
      case 'high-risk':
        return 'high'
      case 'critical':
        return 'critical'
      default:
        return undefined
    }
  }

  calculate(data: ScoringData): DependencyModuleScore {
    // Build contract name lookup map
    const contractNameMap = new Map<string, string>()
    data.projectData.entries?.forEach((entry: any) => {
      const allContracts = [
        ...(entry.initialContracts || []),
        ...(entry.discoveredContracts || []),
      ]
      allContracts.forEach((contract: any) => {
        contractNameMap.set(
          contract.address,
          contract.name || 'Unknown Contract',
        )
      })
    })

    // Process dependencies: group by external contract
    const dependenciesMap = new Map<string, DependencyDetail>()
    const allGrades: LetterGrade[] = []

    if (data.functions?.contracts) {
      Object.entries(data.functions.contracts).forEach(
        ([contractAddress, contractData]: [string, any]) => {
          contractData.functions.forEach((func: any) => {
            // Convert score to impact
            const impact = this.scoreToImpact(func.score)

            // Only process functions that have dependencies and impact
            if (func.dependencies && func.dependencies.length > 0 && impact) {
              func.dependencies.forEach((dep: { contractAddress: string }) => {
                const depAddress = dep.contractAddress

                // Get likelihood from contract tags
                const normalizedDepAddress = depAddress.toLowerCase()
                const tag = data.contractTags?.tags?.find(
                  (tag: any) =>
                    tag.contractAddress.toLowerCase() === normalizedDepAddress,
                )

                // Skip if not external or no likelihood
                if (!tag?.isExternal || !tag.likelihood) {
                  return
                }

                // Calculate grade for this function-dependency combination
                const grade = getSeverityGrade(impact, tag.likelihood)
                allGrades.push(grade)

                // Get or create dependency entry
                if (!dependenciesMap.has(depAddress)) {
                  dependenciesMap.set(depAddress, {
                    dependencyAddress: depAddress,
                    dependencyName:
                      contractNameMap.get(depAddress) || 'Unknown Contract',
                    likelihood: tag.likelihood,
                    functions: [],
                  })
                }

                // Add function to dependency
                const depData = dependenciesMap.get(depAddress)!
                depData.functions.push({
                  contractAddress,
                  contractName:
                    contractNameMap.get(contractAddress) || 'Unknown Contract',
                  functionName: func.functionName,
                  impact: impact,
                  grade,
                })
              })
            }
          })
        },
      )
    }

    const breakdown = Array.from(dependenciesMap.values())

    // Overall grade = worst grade among all function-dependency combinations
    const overallGrade =
      allGrades.length > 0 ? this.getWorstGrade(allGrades) : 'AAA' // No dependencies = best grade

    // Count total external contracts that have functions depending on them
    const dependencyCount = breakdown.length

    return {
      grade: overallGrade,
      inventory: dependencyCount,
      breakdown,
    }
  }

  private getWorstGrade(grades: LetterGrade[]): LetterGrade {
    const gradeValues: Record<LetterGrade, number> = {
      AAA: 10,
      AA: 9,
      A: 8,
      BBB: 7,
      BB: 6,
      B: 5,
      CCC: 4,
      CC: 3,
      C: 2,
      D: 1,
      Unscored: 0,
    }

    const numericGrades = grades.map((g) => gradeValues[g])
    const worstNumeric = Math.min(...numericGrades)

    const entry = Object.entries(gradeValues).find(
      ([_, value]) => value === worstNumeric,
    )
    return entry ? (entry[0] as LetterGrade) : 'D'
  }
}

/**
 * Admin Inventory Module
 *
 * Resolves permission owners from ownerDefinitions and groups functions by admin address.
 * Calculates Impact × Likelihood scores for each admin-function combination.
 */
class AdminInventoryModule implements ScoringModule {
  name = 'admins'

  calculate(data: ScoringData): AdminModuleScore {
    // Build contract name and type lookup maps
    const contractNameMap = new Map<string, string>()
    const contractTypeMap = new Map<string, ApiAddressType>()

    data.projectData.entries?.forEach((entry: any) => {
      const allContracts = [
        ...(entry.initialContracts || []),
        ...(entry.discoveredContracts || []),
      ]
      allContracts.forEach((contract: any) => {
        contractNameMap.set(
          contract.address,
          contract.name || 'Unknown Contract',
        )
        contractTypeMap.set(contract.address, contract.type || 'Contract')
      })

      // Also add EOAs
      entry.eoas?.forEach((eoa: any) => {
        contractNameMap.set(eoa.address, eoa.name || 'Unknown EOA')
        contractTypeMap.set(eoa.address, eoa.type || 'EOA')
      })
    })

    // Group functions by admin address with caching optimization
    const adminsMap = new Map<string, AdminDetail>()
    const allGrades: LetterGrade[] = []
    const ownerResolutionCache = new Map<string, string[]>()

    if (data.functions?.contracts) {
      Object.entries(data.functions.contracts).forEach(
        ([contractAddress, contractData]: [string, any]) => {
          contractData.functions.forEach((func: any) => {
            // Only process permissioned functions
            if (
              !func.isPermissioned ||
              !func.ownerDefinitions ||
              func.ownerDefinitions.length === 0
            ) {
              return
            }

            // Convert score to impact
            const impact = this.scoreToImpact(func.score)

            // Create cache key from owner definitions
            const cacheKey = JSON.stringify(func.ownerDefinitions)

            // Check cache first
            let adminAddresses = ownerResolutionCache.get(cacheKey)
            if (!adminAddresses) {
              // Cache miss - resolve and store
              const resolved = resolveOwnersFromDiscovered(
                data.paths,
                data.projectName,
                contractAddress,
                func.ownerDefinitions,
              )
              // Extract all addresses from resolved owners
              adminAddresses = extractAddressesFromResolvedOwners(resolved)
              ownerResolutionCache.set(cacheKey, adminAddresses)
            }

            // Process each admin address
            adminAddresses.forEach((adminAddr: string) => {
              // Get or create admin entry
              if (!adminsMap.has(adminAddr)) {
                // Look up likelihood from contract tags
                const normalizedAddr = adminAddr.toLowerCase()
                const tag = data.contractTags?.tags?.find(
                  (tag: any) =>
                    tag.contractAddress.toLowerCase() === normalizedAddr,
                )

                adminsMap.set(adminAddr, {
                  adminAddress: adminAddr,
                  adminName: contractNameMap.get(adminAddr) || adminAddr,
                  adminType: contractTypeMap.get(adminAddr) || 'Unknown',
                  likelihood: tag?.likelihood,
                  functions: [],
                })
              }

              const admin = adminsMap.get(adminAddr)!

              // Calculate grade if both impact and likelihood exist
              let grade: LetterGrade | undefined = undefined
              if (impact && admin.likelihood) {
                grade = getSeverityGrade(impact, admin.likelihood)
                allGrades.push(grade)
              }

              // Add function to admin's list
              admin.functions.push({
                contractAddress,
                contractName:
                  contractNameMap.get(contractAddress) || 'Unknown Contract',
                functionName: func.functionName,
                impact: impact || 'low', // Default to low if no impact set
                grade,
              })
            })
          })
        },
      )
    }

    // Calculate worst grade and count
    const worstGrade =
      allGrades.length > 0
        ? allGrades.reduce((worst, current) =>
            GRADE_TO_NUMERIC[current] < GRADE_TO_NUMERIC[worst]
              ? current
              : worst,
          )
        : 'AAA' // Default grade if no graded admins

    return {
      grade: worstGrade,
      inventory: adminsMap.size,
      breakdown: Array.from(adminsMap.values()),
    }
  }

  /**
   * Convert score string to Impact type
   */
  private scoreToImpact(score: string | undefined): Impact | undefined {
    if (!score) return undefined

    switch (score) {
      case 'low-risk':
        return 'low'
      case 'medium-risk':
        return 'medium'
      case 'high-risk':
        return 'high'
      case 'critical':
        return 'critical'
      default:
        return undefined
    }
  }
}

// ============================================================================
// Score Calculator
// ============================================================================

export class ScoreCalculator {
  private contractModule: ContractInventoryModule
  private functionModule: FunctionInventoryModule
  private dependencyModule: DependencyInventoryModule
  private adminModule: AdminInventoryModule
  private paths: DiscoveryPaths
  private configReader: ConfigReader
  private templateService: TemplateService

  constructor(
    paths: DiscoveryPaths,
    configReader: ConfigReader,
    templateService: TemplateService,
  ) {
    this.paths = paths
    this.configReader = configReader
    this.templateService = templateService
    this.contractModule = new ContractInventoryModule()
    this.functionModule = new FunctionInventoryModule()
    this.dependencyModule = new DependencyInventoryModule()
    this.adminModule = new AdminInventoryModule()
  }

  /**
   * Calculate V2 score for a project
   */
  calculate(projectName: string): V2ScoreResult {
    // Load all data sources
    const projectData = getProject(
      this.configReader,
      this.templateService,
      projectName,
    )
    const permissionOverrides = getFunctions(this.paths, projectName)
    const contractTags = getContractTags(this.paths, projectName)
    const functions = getFunctions(this.paths, projectName)

    const data: ScoringData = {
      projectData,
      permissionOverrides,
      contractTags,
      functions,
      paths: this.paths,
      projectName,
    }

    // Calculate each module score
    const moduleScores = {
      contracts: this.contractModule.calculate(data),
      functions: this.functionModule.calculate(data),
      dependencies: this.dependencyModule.calculate(data),
      admins: this.adminModule.calculate(data),
    }

    // Aggregate to final score
    const allGrades = Object.values(moduleScores).map((score) => score.grade)
    const finalScore = aggregateGrades(allGrades)

    return {
      inventory: moduleScores,
      finalScore,
    }
  }
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Calculate V2 score for a project
 */
export function calculateV2Score(
  paths: DiscoveryPaths,
  configReader: ConfigReader,
  templateService: TemplateService,
  projectName: string,
): V2ScoreResult {
  const calculator = new ScoreCalculator(paths, configReader, templateService)
  return calculator.calculate(projectName)
}
