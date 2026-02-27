import type {
  ConfigReader,
  DiscoveryPaths,
  TemplateService,
} from '@l2beat/discovery'
import { getProject } from '../getProject'
import {
  buildExternalAddressSet,
  buildTagsByAddress,
  findTag,
  getCallGraphContractName,
  getCallGraphData,
  isExternalAddress,
  traverseWithPaths,
} from './callGraph'
import { CapitalAnalysisCalculator } from './capitalAnalysis'
import { getContractTags } from './contractTags'
import {
  extractAddressesFromResolvedOwners,
  getFunctions,
  resolveOwnersFromDiscovered,
} from './functions'
import { getFundsData } from './fundsData'
import type {
  AdminDetail,
  AdminDetailWithCapital,
  ApiAddressType,
  ApiCallGraphResponse,
  DependencyDetail,
  FunctionDetail,
  Impact,
} from './types'

// ============================================================================
// Type Definitions
// ============================================================================

export interface ModuleScore {
  inventory: number
}

export interface FunctionModuleScore extends ModuleScore {
  breakdown?: FunctionDetail[]
}

export interface DependencyModuleScore extends ModuleScore {
  breakdown?: DependencyDetail[]
}

export interface AdminModuleScore extends ModuleScore {
  breakdown?: AdminDetail[] | AdminDetailWithCapital[]
  // Total capital at risk across all admins (when capital analysis is available)
  totalCapitalAtRisk?: number
  // Total token market cap at risk across all admins
  totalTokenValueAtRisk?: number
}

export interface V2ScoreResult {
  inventory: {
    contracts: ModuleScore
    functions: FunctionModuleScore
    dependencies: DependencyModuleScore
    admins: AdminModuleScore
  }
}

interface ScoringData {
  projectData: any
  permissionOverrides: any
  contractTags: any
  functions: any
  paths: DiscoveryPaths
  projectName: string
  callGraphData: ApiCallGraphResponse
}

// ============================================================================
// Scoring Modules
// ============================================================================

/**
 * Contract Inventory Module
 * Counts total contracts (initial + discovered, excluding EOAs)
 */
class ContractInventoryModule {
  name = 'contracts'

  calculate(data: ScoringData): ModuleScore {
    let contractCount = 0

    data.projectData.entries.forEach((entry: any) => {
      contractCount += entry.initialContracts?.length || 0
      contractCount += entry.discoveredContracts?.length || 0
    })

    return { inventory: contractCount }
  }
}

/**
 * Function Inventory Module
 * Collects permissioned functions with their impact scores
 */
class FunctionInventoryModule {
  name = 'functions'

  calculate(data: ScoringData): FunctionModuleScore {
    const breakdown: FunctionDetail[] = []
    let functionCount = 0

    if (data.permissionOverrides?.contracts) {
      Object.entries(data.permissionOverrides.contracts).forEach(
        ([contractAddress, contractData]: [string, any]) => {
          contractData.functions?.forEach((func: any) => {
            if (func.isPermissioned === true) {
              functionCount++

              // Skip if function doesn't have impact (unscored)
              if (!func.score || func.score === 'unscored') {
                return
              }

              // All scored functions are treated as critical (binary scoring)
              const impact: Impact = 'critical'

              // Resolve contract name from projectData
              const contractName = this.getContractName(
                data.projectData,
                contractAddress,
              )

              breakdown.push({
                contractAddress,
                contractName,
                functionName: func.functionName,
                impact,
              })
            }
          })
        },
      )
    }

    return {
      inventory: functionCount,
      breakdown,
    }
  }

  private getContractName(projectData: any, contractAddress: string): string {
    if (!projectData?.entries) return contractAddress

    // Normalize address for comparison (remove eth: prefix, lowercase for case-insensitive match)
    const normalizedAddress = contractAddress.replace('eth:', '').toLowerCase()

    for (const entry of projectData.entries) {
      // Check both initialContracts and discoveredContracts
      const contracts = [
        ...(entry.initialContracts || []),
        ...(entry.discoveredContracts || []),
      ]

      for (const contract of contracts) {
        const entryAddress = contract.address.replace('eth:', '').toLowerCase()
        if (entryAddress === normalizedAddress) {
          return contract.name || contractAddress
        }
      }
    }

    return contractAddress
  }
}

/**
 * Dependency Inventory Module
 * Analyzes functions that depend on external contracts using call graph BFS
 * and manual dependencies from functions.json.
 */
class DependencyInventoryModule {
  name = 'dependencies'

  calculate(data: ScoringData): DependencyModuleScore {
    // Build contract name lookup map (lowercase keys for case-insensitive lookup)
    const contractNameMap = new Map<string, string>()
    data.projectData.entries?.forEach((entry: any) => {
      const allContracts = [
        ...(entry.initialContracts || []),
        ...(entry.discoveredContracts || []),
      ]
      allContracts.forEach((contract: any) => {
        contractNameMap.set(
          contract.address.toLowerCase(),
          contract.name || 'Unknown Contract',
        )
      })
    })

    // Build external address set and tag lookup from contract tags
    const tags = data.contractTags?.tags ?? []
    const externalAddresses = buildExternalAddressSet(tags)
    const tagsByAddress = buildTagsByAddress(tags)

    // Process dependencies: group by external contract
    const dependenciesMap = new Map<string, DependencyDetail>()

    if (data.functions?.contracts) {
      Object.entries(data.functions.contracts).forEach(
        ([contractAddress, contractData]: [string, any]) => {
          contractData.functions.forEach((func: any) => {
            // Process all functions for dependency detection (not just scored ones)
            // Dependencies are structural — they exist regardless of score status

            // Run BFS traversal from this function through the call graph
            const traversalResult = traverseWithPaths(
              data.callGraphData,
              contractAddress,
              func.functionName,
            )

            // 1. Auto-detected: external contracts reachable via call graph
            for (const [addr] of traversalResult.reachableContracts) {
              if (addr.toLowerCase() === contractAddress.toLowerCase()) continue
              if (!isExternalAddress(addr, externalAddresses)) continue

              this.addDependency(
                dependenciesMap,
                addr,
                contractNameMap,
                tagsByAddress,
                data.callGraphData,
                contractAddress,
                func.functionName,
              )
            }

            // 2. Manual dependencies from functions.json
            if (func.dependencies && func.dependencies.length > 0) {
              for (const dep of func.dependencies) {
                const depAddress = dep.contractAddress
                if (!isExternalAddress(depAddress, externalAddresses)) continue

                this.addDependency(
                  dependenciesMap,
                  depAddress,
                  contractNameMap,
                  tagsByAddress,
                  data.callGraphData,
                  contractAddress,
                  func.functionName,
                )
              }
            }
          })
        },
      )
    }

    const breakdown = Array.from(dependenciesMap.values())

    return {
      inventory: breakdown.length,
      breakdown,
    }
  }

  private addDependency(
    dependenciesMap: Map<string, DependencyDetail>,
    depAddress: string,
    contractNameMap: Map<string, string>,
    tagsByAddress: Map<string, import('./types').ContractTag>,
    callGraphData: ApiCallGraphResponse,
    callerContractAddress: string,
    callerFunctionName: string,
  ) {
    const normalizedDep = depAddress.toLowerCase()

    // Get or create dependency entry
    if (!dependenciesMap.has(normalizedDep)) {
      const tag = findTag(tagsByAddress, depAddress)
      dependenciesMap.set(normalizedDep, {
        dependencyAddress: depAddress,
        dependencyName:
          contractNameMap.get(normalizedDep) ||
          getCallGraphContractName(callGraphData, depAddress) ||
          'Unknown Contract',
        entity: tag?.entity,
        functions: [],
      })
    }

    // Add function to dependency (avoid duplicates)
    const depData = dependenciesMap.get(normalizedDep)!
    const alreadyAdded = depData.functions.some(
      (f) =>
        f.contractAddress === callerContractAddress &&
        f.functionName === callerFunctionName,
    )
    if (!alreadyAdded) {
      depData.functions.push({
        contractAddress: callerContractAddress,
        contractName:
          contractNameMap.get(callerContractAddress.toLowerCase()) ||
          'Unknown Contract',
        functionName: callerFunctionName,
        impact: 'critical' as Impact,
      })
    }
  }
}

/**
 * Admin Inventory Module
 *
 * Resolves permission owners from ownerDefinitions and groups functions by admin address.
 */
class AdminInventoryModule {
  name = 'admins'

  calculate(data: ScoringData): AdminModuleScore {
    // Build contract name and type lookup maps (lowercase keys for case-insensitive lookup)
    const contractNameMap = new Map<string, string>()
    const contractTypeMap = new Map<string, ApiAddressType>()

    data.projectData.entries?.forEach((entry: any) => {
      const allContracts = [
        ...(entry.initialContracts || []),
        ...(entry.discoveredContracts || []),
      ]
      allContracts.forEach((contract: any) => {
        contractNameMap.set(
          contract.address.toLowerCase(),
          contract.name || 'Unknown Contract',
        )
        contractTypeMap.set(
          contract.address.toLowerCase(),
          contract.type || 'Contract',
        )
      })

      // Also add EOAs
      entry.eoas?.forEach((eoa: any) => {
        contractNameMap.set(
          eoa.address.toLowerCase(),
          eoa.name || 'Unknown EOA',
        )
        contractTypeMap.set(eoa.address.toLowerCase(), eoa.type || 'EOA')
      })
    })

    // Group functions by admin address with caching optimization
    const adminsMap = new Map<string, AdminDetail>()
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
              // Extract all addresses from resolved owners (deduplicate to avoid
              // pushing the same function multiple times per admin)
              adminAddresses = [
                ...new Set(extractAddressesFromResolvedOwners(resolved)),
              ]
              ownerResolutionCache.set(cacheKey, adminAddresses)
            }

            // Process each admin address
            adminAddresses.forEach((adminAddr: string) => {
              const normalizedAdmin = adminAddr.toLowerCase()
              // Get or create admin entry
              if (!adminsMap.has(adminAddr)) {
                adminsMap.set(adminAddr, {
                  adminAddress: adminAddr,
                  adminName: contractNameMap.get(normalizedAdmin) || adminAddr,
                  adminType: contractTypeMap.get(normalizedAdmin) || 'Unknown',
                  functions: [],
                })
              }

              const admin = adminsMap.get(adminAddr)!

              // Add function to admin's list
              admin.functions.push({
                contractAddress,
                contractName:
                  contractNameMap.get(contractAddress.toLowerCase()) ||
                  'Unknown Contract',
                functionName: func.functionName,
                impact: 'critical' as Impact,
              })
            })
          })
        },
      )
    }

    // =========================================================================
    // Capital Analysis Integration
    // =========================================================================
    const fundsData = getFundsData(data.paths, data.projectName)

    // Check if we have data for capital analysis
    const hasCallGraphData =
      Object.keys(data.callGraphData.contracts).length > 0
    const hasFundsData = Object.keys(fundsData?.contracts ?? {}).length > 0

    if (hasCallGraphData && hasFundsData) {
      // Perform capital analysis for each admin
      // Pass functions data so we can check impact scores of called functions
      const capitalCalculator = new CapitalAnalysisCalculator(
        data.callGraphData,
        fundsData,
        data.functions,
      )

      const adminsWithCapital: AdminDetailWithCapital[] = []

      for (const admin of adminsMap.values()) {
        const adminWithCapital = capitalCalculator.analyzeAdminCapital(admin)
        adminsWithCapital.push(adminWithCapital)
      }

      // Deduplicate capital across all admins by contract address
      const contractCapitalMap = new Map<
        string,
        { funds: number; tokenValue: number }
      >()
      for (const admin of adminsWithCapital) {
        // Direct contracts (all functions, including those without call graph)
        for (const func of admin.functions) {
          const addr = func.contractAddress.toLowerCase()
          if (!contractCapitalMap.has(addr)) {
            contractCapitalMap.set(addr, {
              funds: capitalCalculator.getContractFunds(addr),
              tokenValue: capitalCalculator.getContractTokenValue(addr),
            })
          }
        }
        // Reachable contracts from capital analysis
        for (const funcAnalysis of admin.functionsWithCapital) {
          for (const rc of funcAnalysis.reachableContracts) {
            if (!rc.fundsAtRisk) continue
            const addr = rc.contractAddress.toLowerCase()
            if (!contractCapitalMap.has(addr)) {
              contractCapitalMap.set(addr, {
                funds: rc.fundsUsd,
                tokenValue: rc.tokenValueUsd,
              })
            }
          }
        }
      }
      let totalCapitalAtRisk = 0
      let totalTokenValueAtRisk = 0
      for (const { funds, tokenValue } of contractCapitalMap.values()) {
        totalCapitalAtRisk += funds
        totalTokenValueAtRisk += tokenValue
      }

      return {
        inventory: adminsMap.size,
        breakdown: adminsWithCapital,
        totalCapitalAtRisk,
        totalTokenValueAtRisk,
      }
    }

    // Fallback: return without capital analysis
    return {
      inventory: adminsMap.size,
      breakdown: Array.from(adminsMap.values()),
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
    const callGraphData = getCallGraphData(this.paths, projectName)

    const data: ScoringData = {
      projectData,
      permissionOverrides,
      contractTags,
      functions,
      paths: this.paths,
      projectName,
      callGraphData,
    }

    // Calculate each module score
    const moduleScores = {
      contracts: this.contractModule.calculate(data),
      functions: this.functionModule.calculate(data),
      dependencies: this.dependencyModule.calculate(data),
      admins: this.adminModule.calculate(data),
    }

    return {
      inventory: moduleScores,
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
