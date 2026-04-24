import type {
  ConfigReader,
  DiscoveryPaths,
  TemplateService,
} from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import { getProject } from '../getProject'
import {
  addressesEqual,
  buildImplementationToProxyMap,
  filterMitigationsForOwner,
  normalizeChainAddress,
  stripChainPrefix,
} from './addressUtils'
import { getCallGraphData } from './callGraph'
import { CapitalAnalysisCalculator } from './capitalAnalysis'
import { getContractTags } from './contractTags'
import { buildEnhancedGraph, buildIndices } from './enhancedTraversal'
import {
  extractAddressesFromResolvedOwners,
  getFunctions,
  resolveDelayFromDiscovered,
  resolveOwnersFromDiscovered,
} from './functions'
import { computeFunctionAnalysis } from './functionAnalysis'
import { getFundsData } from './fundsData'
import { DiscoveredDataAccess } from './ownerResolution'
import type {
  AdminDetail,
  AdminDetailWithCapital,
  ApiAddressType,
  ApiFunctionAnalysisResponse,
  ApiCallGraphResponse,
  DependencyDetail,
  FunctionDetail,
  Impact,
  Mitigation,
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
  contractTags: any
  functions: any
  paths: DiscoveryPaths
  projectName: string
  callGraphData: ApiCallGraphResponse
  functionAnalysis: ApiFunctionAnalysisResponse
}

// ============================================================================
// Mitigation Helpers
// ============================================================================

/**
 * Builds a merged mitigations list for a function.
 * Combines the existing delay field (as a delay-type mitigation) with
 * explicitly stored mitigations from functions.json.
 */
function buildMergedMitigations(
  func: any,
  paths: DiscoveryPaths,
  projectName: string,
): Mitigation[] | undefined {
  const mitigations: Mitigation[] = []

  // Include delay as a delay-type mitigation
  if (func.delay) {
    const resolved = resolveDelayFromDiscovered(paths, projectName, func.delay)
    mitigations.push({
      type: 'delay',
      description: 'Delay before execution',
      delayRef: {
        contractAddress: func.delay.contractAddress,
        fieldName: func.delay.fieldName,
      },
      delaySeconds: resolved.isResolved ? resolved.seconds : undefined,
    })
  }

  // Include explicitly stored mitigations
  if (func.mitigations && func.mitigations.length > 0) {
    mitigations.push(...func.mitigations)
  }

  return mitigations.length > 0 ? mitigations : undefined
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

    if (data.functions?.contracts) {
      Object.entries(data.functions.contracts).forEach(
        ([contractAddress, contractData]: [string, any]) => {
          contractData.functions?.forEach((func: any) => {
            if (func.isPermissioned === true) {
              functionCount++

              // Skip unscored functions (not yet reviewed)
              if (!func.score || func.score === 'unscored') {
                return
              }

              const impact: Impact =
                func.score === 'no-impact' ? 'no-impact' : 'critical'

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
                mitigations: buildMergedMitigations(
                  func,
                  data.paths,
                  data.projectName,
                ),
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

    // Normalize address for comparison (remove eth: prefix, checksummed for case-insensitive match)
    const normalizedAddress = stripChainPrefix(contractAddress)

    for (const entry of projectData.entries) {
      // Check both initialContracts and discoveredContracts
      const contracts = [
        ...(entry.initialContracts || []),
        ...(entry.discoveredContracts || []),
      ]

      for (const contract of contracts) {
        const entryAddress = stripChainPrefix(contract.address)
        if (addressesEqual(entryAddress, normalizedAddress)) {
          return contract.name || contractAddress
        }
      }
    }

    return contractAddress
  }
}

/**
 * Dependency Inventory Module
 * Consumes pre-computed function analysis to group dependencies by external contract.
 */
class DependencyInventoryModule {
  name = 'dependencies'

  calculate(data: ScoringData): DependencyModuleScore {
    // Build contract name lookup map (normalized keys for case-insensitive lookup)
    const contractNameMap = new Map<string, string>()
    data.projectData.entries?.forEach((entry: any) => {
      const allContracts = [
        ...(entry.initialContracts || []),
        ...(entry.discoveredContracts || []),
      ]
      allContracts.forEach((contract: any) => {
        contractNameMap.set(
          normalizeChainAddress(contract.address),
          contract.name || 'Unknown Contract',
        )
      })
    })

    // Build a lookup for function scores from functions.json
    const getFunctionScore = (
      contractAddr: string,
      funcName: string,
    ): Impact => {
      const normalizedAddr = normalizeChainAddress(contractAddr)
      const contractEntry = Object.entries(
        data.functions?.contracts ?? {},
      ).find(([key]) => normalizeChainAddress(key) === normalizedAddr)
      if (!contractEntry) return 'critical'
      const contractFunctions = contractEntry[1] as any
      const func = contractFunctions.functions.find(
        (f: any) => f.functionName === funcName,
      )
      return func?.score === 'no-impact' ? 'no-impact' : 'critical'
    }

    // Group dependencies from pre-computed function analysis by external contract
    const dependenciesMap = new Map<string, DependencyDetail>()

    for (const [contractAddress, functions] of Object.entries(
      data.functionAnalysis.contracts,
    )) {
      for (const [functionName, analysis] of Object.entries(functions)) {
        if (!analysis.dependencies?.entries) continue

        for (const dep of analysis.dependencies.entries) {
          const normalizedDep = normalizeChainAddress(dep.contractAddress)

          // Get or create dependency entry
          if (!dependenciesMap.has(normalizedDep)) {
            dependenciesMap.set(normalizedDep, {
              dependencyAddress: dep.contractAddress,
              dependencyName: dep.contractName || 'Unknown Contract',
              entity: dep.entity,
              functions: [],
            })
          }

          // Add function to dependency (avoid duplicates)
          const depData = dependenciesMap.get(normalizedDep)!
          const alreadyAdded = depData.functions.some(
            (f) =>
              addressesEqual(f.contractAddress, contractAddress) &&
              f.functionName === functionName,
          )
          if (!alreadyAdded) {
            depData.functions.push({
              contractAddress,
              contractName:
                contractNameMap.get(normalizeChainAddress(contractAddress)) ||
                'Unknown Contract',
              functionName,
              impact: getFunctionScore(contractAddress, functionName),
            })
          }
        }
      }
    }

    const breakdown = Array.from(dependenciesMap.values())

    return {
      inventory: breakdown.length,
      breakdown,
    }
  }
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

/**
 * Maps raw admin types to user-facing types based on proxy information.
 * - Zero address → 'Revoked'
 * - Any type + immutable proxyType → 'Immutable'
 * - Untemplatized/Unknown + non-immutable proxyType → 'Upgradeable'
 */
function mapAdminType(
  rawType: ApiAddressType,
  normalizedAddress: string,
  proxyTypeMap: Map<string, string>,
): ApiAddressType {
  // Strip chain prefix for zero address comparison
  const bareAddress = stripChainPrefix(normalizedAddress)
  if (bareAddress === ZERO_ADDRESS) {
    return 'Revoked'
  }

  const proxyType = proxyTypeMap.get(normalizedAddress)
  if (proxyType === 'immutable') {
    return 'Immutable'
  }

  if (rawType === 'Untemplatized' || rawType === 'Unknown') {
    if (proxyType !== undefined) {
      return 'Upgradeable'
    }
  }

  return rawType
}

/**
 * Admin Inventory Module
 *
 * Resolves permission owners from ownerDefinitions and groups functions by admin address.
 */
class AdminInventoryModule {
  name = 'admins'

  calculate(data: ScoringData): AdminModuleScore {
    // Build contract name, type, and proxy type lookup maps (normalized keys for case-insensitive lookup)
    const contractNameMap = new Map<string, string>()
    const contractTypeMap = new Map<string, ApiAddressType>()
    const proxyTypeMap = new Map<string, string>()

    data.projectData.entries?.forEach((entry: any) => {
      const allContracts = [
        ...(entry.initialContracts || []),
        ...(entry.discoveredContracts || []),
      ]
      allContracts.forEach((contract: any) => {
        const addr = normalizeChainAddress(contract.address)
        contractNameMap.set(addr, contract.name || 'Unknown Contract')
        contractTypeMap.set(addr, contract.type || 'Contract')
        if (contract.proxyType) {
          proxyTypeMap.set(addr, contract.proxyType)
        }
      })

      // Also add EOAs
      entry.eoas?.forEach((eoa: any) => {
        contractNameMap.set(
          normalizeChainAddress(eoa.address),
          eoa.name || 'Unknown EOA',
        )
        contractTypeMap.set(
          normalizeChainAddress(eoa.address),
          eoa.type || 'EOA',
        )
      })
    })

    // Map implementation addresses to their proxy's name so that
    // functions keyed by implementation address resolve correctly
    const discoveredPath = path.join(
      data.paths.discovery,
      data.projectName,
      'discovered.json',
    )
    let discovered: any = null
    try {
      const fileContent = fs.readFileSync(discoveredPath, 'utf8')
      discovered = JSON.parse(fileContent)
      const implToProxy = buildImplementationToProxyMap(discovered)
      for (const [implAddr, proxyAddr] of implToProxy) {
        if (!contractNameMap.has(implAddr)) {
          const proxyName = contractNameMap.get(proxyAddr)
          if (proxyName) {
            contractNameMap.set(implAddr, proxyName)
          }
        }
      }
    } catch {
      // discovered.json not available — implementation names won't resolve
    }

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
              const normalizedAdmin = normalizeChainAddress(adminAddr)
              // Get or create admin entry
              if (!adminsMap.has(adminAddr)) {
                const rawType =
                  contractTypeMap.get(normalizedAdmin) || 'Unknown'
                const adminType = mapAdminType(
                  rawType,
                  normalizedAdmin,
                  proxyTypeMap,
                )
                adminsMap.set(adminAddr, {
                  adminAddress: adminAddr,
                  adminName: contractNameMap.get(normalizedAdmin) || adminAddr,
                  adminType,
                  functions: [],
                })
              }

              const admin = adminsMap.get(adminAddr)!

              // Add function to admin's list
              const funcImpact: Impact =
                func.score === 'no-impact' ? 'no-impact' : 'critical'
              admin.functions.push({
                contractAddress,
                contractName:
                  contractNameMap.get(normalizeChainAddress(contractAddress)) ||
                  'Unknown Contract',
                functionName: func.functionName,
                impact: funcImpact,
                mitigations: filterMitigationsForOwner(
                  buildMergedMitigations(func, data.paths, data.projectName),
                  adminAddr,
                  'admin',
                ),
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
      // Build enhanced graph (call graph + permission edges) for capital traversal
      const dataAccess = discovered
        ? new DiscoveredDataAccess(discovered)
        : new DiscoveredDataAccess({ contracts: [] })

      const { edges } = buildEnhancedGraph(
        data.callGraphData,
        data.functions,
        dataAccess,
        discovered,
      )
      const enhancedGraph = buildIndices(edges)

      // Build impl→proxy map for deduplication across proxy/implementation
      const implToProxyMap = discovered
        ? buildImplementationToProxyMap(discovered)
        : new Map<string, string>()

      // Perform capital analysis using enhanced graph (follows permission chains)
      const capitalCalculator = new CapitalAnalysisCalculator(
        enhancedGraph,
        fundsData,
        data.functions,
        contractNameMap,
        implToProxyMap,
      )

      const adminsWithCapital: AdminDetailWithCapital[] = []

      for (const admin of adminsMap.values()) {
        const adminWithCapital = capitalCalculator.analyzeAdminCapital(admin)
        adminsWithCapital.push(adminWithCapital)
      }

      // Deduplicate capital across all admins by contract address.
      // Implementation addresses in funcAnalysis.contractAddress (from admin
      // function lists) are resolved to proxy. Reachable contract addresses
      // are already proxy-resolved by traverseForward.
      const contractCapitalMap = new Map<
        string,
        { funds: number; tokenValue: number }
      >()
      const resolveAddr = (raw: string): string => {
        const norm = normalizeChainAddress(raw)
        return implToProxyMap.get(norm) ?? norm
      }
      for (const admin of adminsWithCapital) {
        // Direct contracts from per-function capital analysis (respects no-impact)
        for (const funcAnalysis of admin.functionsWithCapital) {
          if (
            funcAnalysis.directFundsUsd <= 0 &&
            funcAnalysis.directTokenValueUsd <= 0
          )
            continue
          const addr = resolveAddr(funcAnalysis.contractAddress)
          if (!contractCapitalMap.has(addr)) {
            contractCapitalMap.set(addr, {
              funds: funcAnalysis.directFundsUsd,
              tokenValue: funcAnalysis.directTokenValueUsd,
            })
          }
        }
        // Reachable contracts from capital analysis (already proxy-resolved)
        for (const funcAnalysis of admin.functionsWithCapital) {
          for (const rc of funcAnalysis.reachableContracts) {
            if (!rc.fundsAtRisk) continue
            const addr = normalizeChainAddress(rc.contractAddress)
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
    const functions = getFunctions(this.paths, projectName)
    const contractTags = getContractTags(this.paths, projectName)
    const callGraphData = getCallGraphData(this.paths, projectName)
    const functionAnalysis = computeFunctionAnalysis(this.paths, projectName, {
      functionsData: functions,
      callGraphData,
      contractTagsData: contractTags,
    })

    const data: ScoringData = {
      projectData,
      contractTags,
      functions,
      paths: this.paths,
      projectName,
      callGraphData,
      functionAnalysis,
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
