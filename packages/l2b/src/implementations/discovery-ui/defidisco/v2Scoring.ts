import type { ConfigReader, DiscoveryPaths, TemplateService } from '@l2beat/discovery'
import { getProject } from '../getProject'
import { getFunctions } from './functions'
import { getContractTags } from './contractTags'
import type { Impact, Likelihood, Severity } from './types'

// ============================================================================
// Type Definitions
// ============================================================================

export type LetterGrade = 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'CC' | 'C' | 'D'

export interface ModuleScore {
  grade: LetterGrade
  inventory: number
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
export function getSeverityLevel(impact: Impact, likelihood: Likelihood): Severity {
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
export function getSeverityGrade(impact: Impact, likelihood: Likelihood): LetterGrade {
  return SEVERITY_GRADE_MAP[impact][likelihood]
}

export interface V2ScoreResult {
  inventory: {
    contracts: ModuleScore
    functions: ModuleScore
    dependencies: ModuleScore
    admins: ModuleScore
  }
  finalScore: LetterGrade
}

interface ScoringData {
  projectData: any
  permissionOverrides: any
  contractTags: any
}

// ============================================================================
// Grade Utility Functions
// ============================================================================

const GRADE_TO_NUMERIC: Record<LetterGrade, number> = {
  'AAA': 10,
  'AA': 9,
  'A': 8,
  'BBB': 7,
  'BB': 6,
  'B': 5,
  'CCC': 4,
  'CC': 3,
  'C': 2,
  'D': 1,
}

const NUMERIC_TO_GRADE: LetterGrade[] = [
  'D',   // 0-1
  'D',   // 1-2
  'C',   // 2-3
  'CC',  // 3-4
  'CCC', // 4-5
  'B',   // 5-6
  'BB',  // 6-7
  'BBB', // 7-8
  'A',   // 8-9
  'AA',  // 9-10
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
  calculate(data: ScoringData): ModuleScore
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
 * Counts permissioned functions (where isPermissioned = true)
 * Scoring: fewer permissioned functions = better grade
 *
 * NOTE: Thresholds below are TEMPORARY PLACEHOLDER logic and will be replaced
 * with proper V2 framework scoring criteria in the future.
 */
class FunctionInventoryModule implements ScoringModule {
  name = 'functions'

  calculate(data: ScoringData): ModuleScore {
    let functionCount = 0

    if (data.permissionOverrides?.contracts) {
      Object.values(data.permissionOverrides.contracts).forEach((contractData: any) => {
        contractData.functions?.forEach((func: any) => {
          if (func.isPermissioned === true) {
            functionCount++
          }
        })
      })
    }

    // TEMPORARY PLACEHOLDER THRESHOLDS - will be replaced with proper V2 logic
    const grade = this.countToGrade(functionCount)

    return { grade, inventory: functionCount }
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
 * Counts external contracts (marked as isExternal = true)
 * Scoring: fewer external dependencies = better grade
 *
 * NOTE: Thresholds below are TEMPORARY PLACEHOLDER logic and will be replaced
 * with proper V2 framework scoring criteria in the future.
 */
class DependencyInventoryModule implements ScoringModule {
  name = 'dependencies'

  calculate(data: ScoringData): ModuleScore {
    let dependencyCount = 0

    if (data.contractTags?.tags) {
      data.contractTags.tags.forEach((tag: any) => {
        if (tag.isExternal === true) {
          dependencyCount++
        }
      })
    }

    // TEMPORARY PLACEHOLDER THRESHOLDS - will be replaced with proper V2 logic
    const grade = this.countToGrade(dependencyCount)

    return { grade, inventory: dependencyCount }
  }

  private countToGrade(count: number): LetterGrade {
    if (count < 2) return 'AAA'
    if (count < 5) return 'AA'
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
 * Admin Inventory Module
 * Counts unique admin addresses from owner definitions in permissioned functions
 * Scoring: fewer unique admins = better grade (more centralized but simpler)
 *
 * NOTE: This currently uses PLACEHOLDER logic that counts contracts with permissioned
 * functions as a proxy for admin count. Full owner resolution requires walking the
 * data structure which would duplicate logic from frontend/report generation.
 *
 * TODO: Implement proper admin resolution or share the resolution logic.
 *
 * NOTE: Thresholds below are TEMPORARY PLACEHOLDER logic and will be replaced
 * with proper V2 framework scoring criteria in the future.
 */
class AdminInventoryModule implements ScoringModule {
  name = 'admins'

  calculate(data: ScoringData): ModuleScore {
    // PLACEHOLDER LOGIC: count contracts with permissioned functions as proxy for admin count
    // In reality, would need to resolve owner definitions to unique addresses
    const uniqueAdmins = new Set<string>()

    if (data.permissionOverrides?.contracts) {
      Object.keys(data.permissionOverrides.contracts).forEach((contractAddress: string) => {
        const contractData = data.permissionOverrides.contracts[contractAddress]
        const hasPermissionedFunctions = contractData.functions?.some(
          (func: any) => func.isPermissioned === true
        )

        if (hasPermissionedFunctions) {
          // Placeholder: treat each contract with permissioned functions as having an admin
          uniqueAdmins.add(contractAddress)
        }
      })
    }

    const adminCount = uniqueAdmins.size

    // TEMPORARY PLACEHOLDER THRESHOLDS - will be replaced with proper V2 logic
    const grade = this.countToGrade(adminCount)

    return { grade, inventory: adminCount }
  }

  private countToGrade(count: number): LetterGrade {
    if (count < 2) return 'AAA'
    if (count < 3) return 'AA'
    if (count < 5) return 'A'
    if (count < 8) return 'BBB'
    if (count < 12) return 'BB'
    if (count < 16) return 'B'
    if (count < 20) return 'CCC'
    if (count < 25) return 'CC'
    if (count < 35) return 'C'
    return 'D'
  }
}

// ============================================================================
// Score Calculator
// ============================================================================

export class ScoreCalculator {
  private modules: ScoringModule[]
  private paths: DiscoveryPaths
  private configReader: ConfigReader
  private templateService: TemplateService

  constructor(paths: DiscoveryPaths, configReader: ConfigReader, templateService: TemplateService) {
    this.paths = paths
    this.configReader = configReader
    this.templateService = templateService
    this.modules = [
      new ContractInventoryModule(),
      new FunctionInventoryModule(),
      new DependencyInventoryModule(),
      new AdminInventoryModule(),
    ]
  }

  /**
   * Calculate V2 score for a project
   */
  calculate(projectName: string): V2ScoreResult {
    // Load all data sources
    const projectData = getProject(this.configReader, this.templateService, projectName)
    const permissionOverrides = getFunctions(this.paths, projectName)
    const contractTags = getContractTags(this.paths, projectName)

    const data: ScoringData = {
      projectData,
      permissionOverrides,
      contractTags,
    }

    // Calculate each module score
    const moduleScores = {
      contracts: this.modules[0].calculate(data),
      functions: this.modules[1].calculate(data),
      dependencies: this.modules[2].calculate(data),
      admins: this.modules[3].calculate(data),
    }

    // Aggregate to final score
    const allGrades = Object.values(moduleScores).map(score => score.grade)
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
  projectName: string
): V2ScoreResult {
  const calculator = new ScoreCalculator(paths, configReader, templateService)
  return calculator.calculate(projectName)
}
