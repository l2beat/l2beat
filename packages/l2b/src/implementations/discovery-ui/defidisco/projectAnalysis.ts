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
import {
  buildEnhancedGraph,
  buildIndices,
  deduplicateTerminals,
  type EnhancedGraph,
  traverse,
  type TraversalContext,
} from './enhancedTraversal'
import { computeFunctionAnalysis } from './functionAnalysis'
import {
  extractAddressesFromResolvedOwners,
  getFunctions,
  resolveDelayFromDiscovered,
  resolveOwnersFromDiscovered,
} from './functions'
import { getFundsData } from './fundsData'
import { DiscoveredDataAccess } from './ownerResolution'
import {
  isUpgradeFunction,
  type AdminDetail,
  type ApiAddressType,
  type ApiCallGraphResponse,
  type ApiContractTagsResponse,
  type ApiFunctionAnalysisResponse,
  type ApiFunctionsResponse,
  type ApiFundsDataResponse,
  type FunctionCapitalAnalysis,
  type Impact,
  type Mitigation,
  type OwnershipChainStep,
  type ReachableContract,
  type TraversalTerminal,
} from './types'

// ============================================================================
// Response Types
// ============================================================================

export interface ApiAdminsResponse {
  totals: {
    adminCount: number
    totalCapitalAtRisk: number
    totalTokenValueAtRisk: number
  }
  admins: AdminEntry[]
}

export interface AdminEntry {
  address: string
  name: string
  type: ApiAddressType
  isExternal: boolean
  isGovernance: boolean
  entity: string | null
  functions: AdminFunctionEntry[]
  totalDirectCapital: number
  totalDirectTokenValue: number
  totalReachableCapital: number
  totalReachableTokenValue: number
  uniqueContractsAffected: number
}

export interface AdminFunctionEntry {
  contractAddress: string
  contractName: string
  functionName: string
  impact: Impact
  mitigations?: Mitigation[]
  isUpgrade?: boolean
  chains: CollapsedChain[]
  directFundsUsd: number
  directTokenValueUsd: number
  reachableContracts: ReachableContract[]
  totalReachableFundsUsd: number
  totalReachableTokenValueUsd: number
  unresolvedCallsCount: number
}

export interface CollapsedChain {
  steps: CollapsedChainStep[]
  hasPublicFunction: boolean
}

export interface CollapsedChainStep {
  contractAddress: string
  contractName: string
  contractType: ApiAddressType
  edgeType: 'permission' | 'callgraph'
  functionNames: string[]
}

export interface ApiDependenciesResponse {
  totals: {
    dependencyCount: number
  }
  dependencies: DependencyEntry[]
}

export interface DependencyEntry {
  address: string
  name: string
  entity: string | null
  isAutoDetected: boolean
  dependencyType: 'callgraph' | 'write' | undefined
  viewOnlyPath: boolean
  calledFunctions: string[]
  functions: DependencyFunctionEntry[]
  totalFundsAtRisk: number
  totalTokenValueAtRisk: number
}

export interface DependencyFunctionEntry {
  contractAddress: string
  contractName: string
  functionName: string
  impact: Impact
  viewOnlyPath: boolean
  calledFunctions: string[]
  mitigations?: Mitigation[]
  directFundsUsd: number
  directTokenValueUsd: number
  reachableContracts: ReachableContract[]
}

export interface ProjectSummary {
  contractCount: number
  permissionedFunctionCount: number
  adminCount: number
  dependencyCount: number
}

// ============================================================================
// Helpers
// ============================================================================

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

/**
 * Maps raw admin types to user-facing types based on proxy information.
 * Same logic as v2Scoring.ts mapAdminType.
 */
function mapAdminType(
  rawType: ApiAddressType,
  normalizedAddress: string,
  proxyTypeMap: Map<string, string>,
): ApiAddressType {
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
 * Builds a merged mitigations list for a function.
 * Same logic as v2Scoring.ts buildMergedMitigations.
 */
function buildMergedMitigations(
  func: any,
  paths: DiscoveryPaths,
  projectName: string,
): Mitigation[] | undefined {
  const mitigations: Mitigation[] = []

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

  if (func.mitigations && func.mitigations.length > 0) {
    mitigations.push(...func.mitigations)
  }

  return mitigations.length > 0 ? mitigations : undefined
}

/**
 * Collapse chains that share the same contract-address sequence.
 * Groups function names per step. Same logic as FunctionFolder.tsx collapseChains.
 */
function collapseChains(terminals: TraversalTerminal[]): {
  chains: CollapsedChain[]
  hasPublicFunction: boolean
} {
  // Group terminals by their contract-address sequence
  const groups = new Map<
    string,
    {
      steps: OwnershipChainStep[][]
      hasPublicFunction: boolean
    }
  >()

  let anyHasPublicFunction = false

  for (const terminal of terminals) {
    if (terminal.hasPublicFunction) anyHasPublicFunction = true

    // Build chain key from contract address sequence
    const key = terminal.chain
      .map((s) => normalizeChainAddress(s.contractAddress))
      .join('\u2192')

    const existing = groups.get(key)
    if (existing) {
      existing.steps.push(terminal.chain)
      if (terminal.hasPublicFunction) existing.hasPublicFunction = true
    } else {
      groups.set(key, {
        steps: [terminal.chain],
        hasPublicFunction: terminal.hasPublicFunction,
      })
    }
  }

  const chains: CollapsedChain[] = []
  for (const group of groups.values()) {
    // Merge function names per step position
    const stepCount = group.steps[0]!.length
    const collapsed: CollapsedChainStep[] = []

    for (let i = 0; i < stepCount; i++) {
      const functionNames = new Set<string>()
      for (const chainSteps of group.steps) {
        if (chainSteps[i]?.functionName) {
          functionNames.add(chainSteps[i]!.functionName!)
        }
      }
      const representative = group.steps[0]![i]!
      collapsed.push({
        contractAddress: representative.contractAddress,
        contractName: representative.contractName,
        contractType: representative.contractType,
        edgeType: representative.edgeType,
        functionNames: Array.from(functionNames),
      })
    }

    chains.push({
      steps: collapsed,
      hasPublicFunction: group.hasPublicFunction,
    })
  }

  return { chains, hasPublicFunction: anyHasPublicFunction }
}

// ============================================================================
// ProjectAnalysis
// ============================================================================

/**
 * Unified project analysis class that computes admin and dependency data
 * from the enhanced graph traversal, capital analysis, and function analysis.
 *
 * Replaces the separate v2Scoring, enhancedTraversal endpoint, and
 * functionAnalysis endpoint with a single coherent computation.
 */
export class ProjectAnalysis {
  private paths: DiscoveryPaths
  private configReader: ConfigReader
  private templateService: TemplateService
  private projectName: string

  // Lazily loaded data sources
  private _projectData: any | null = null
  private _functionsData: ApiFunctionsResponse | null = null
  private _callGraphData: ApiCallGraphResponse | null = null
  private _contractTags: ApiContractTagsResponse | null = null
  private _fundsData: ApiFundsDataResponse | null = null
  private _functionAnalysis: ApiFunctionAnalysisResponse | null = null
  private _discovered: any | null = null

  // Lazily built lookup maps
  private _contractNameMap: Map<string, string> | null = null
  private _contractTypeMap: Map<string, ApiAddressType> | null = null
  private _proxyTypeMap: Map<string, string> | null = null
  private _implToProxyMap: Map<string, string> | null = null
  private _proxyToImplsMap: Map<string, string[]> | null = null
  private _tagsByAddress: Map<string, any> | null = null
  private _enhancedGraph: EnhancedGraph | null = null
  private _capitalCalculator: CapitalAnalysisCalculator | null = null
  private _mitigationsLookup: Map<string, Mitigation[]> | null = null
  private _transitiveMitigationsLookup: Map<string, Mitigation[]> | null = null

  constructor(
    paths: DiscoveryPaths,
    configReader: ConfigReader,
    templateService: TemplateService,
    projectName: string,
  ) {
    this.paths = paths
    this.configReader = configReader
    this.templateService = templateService
    this.projectName = projectName
  }

  // ===========================================================================
  // Lazy Data Loading
  // ===========================================================================

  private get projectData(): any {
    if (!this._projectData) {
      this._projectData = getProject(
        this.configReader,
        this.templateService,
        this.projectName,
      )
    }
    return this._projectData
  }

  private get functionsData(): ApiFunctionsResponse {
    if (!this._functionsData) {
      this._functionsData = getFunctions(this.paths, this.projectName)
    }
    return this._functionsData
  }

  private get callGraphData(): ApiCallGraphResponse {
    if (!this._callGraphData) {
      this._callGraphData = getCallGraphData(this.paths, this.projectName)
    }
    return this._callGraphData
  }

  private get contractTags(): ApiContractTagsResponse {
    if (!this._contractTags) {
      this._contractTags = getContractTags(this.paths, this.projectName)
    }
    return this._contractTags
  }

  private get fundsData(): ApiFundsDataResponse {
    if (!this._fundsData) {
      this._fundsData = getFundsData(this.paths, this.projectName)
    }
    return this._fundsData
  }

  private get functionAnalysis(): ApiFunctionAnalysisResponse {
    if (!this._functionAnalysis) {
      this._functionAnalysis = computeFunctionAnalysis(
        this.paths,
        this.projectName,
        {
          functionsData: this.functionsData,
          callGraphData: this.callGraphData,
          fundsData: this.fundsData,
          contractTagsData: this.contractTags,
        },
      )
    }
    return this._functionAnalysis
  }

  private get discovered(): any {
    if (this._discovered === null) {
      const discoveredPath = path.join(
        this.paths.discovery,
        this.projectName,
        'discovered.json',
      )
      try {
        this._discovered = JSON.parse(fs.readFileSync(discoveredPath, 'utf8'))
      } catch {
        this._discovered = { contracts: [], entries: [] }
      }
    }
    return this._discovered
  }

  // ===========================================================================
  // Lazy Lookup Maps
  // ===========================================================================

  private get contractNameMap(): Map<string, string> {
    if (!this._contractNameMap) {
      this.buildLookupMaps()
    }
    return this._contractNameMap!
  }

  private get contractTypeMap(): Map<string, ApiAddressType> {
    if (!this._contractTypeMap) {
      this.buildLookupMaps()
    }
    return this._contractTypeMap!
  }

  private get proxyTypeMap(): Map<string, string> {
    if (!this._proxyTypeMap) {
      this.buildLookupMaps()
    }
    return this._proxyTypeMap!
  }

  private get implToProxyMap(): Map<string, string> {
    if (!this._implToProxyMap) {
      this.buildImplProxyMaps()
    }
    return this._implToProxyMap!
  }

  private get proxyToImplsMap(): Map<string, string[]> {
    if (!this._proxyToImplsMap) {
      this.buildImplProxyMaps()
    }
    return this._proxyToImplsMap!
  }

  private get tagsByAddress(): Map<string, any> {
    if (!this._tagsByAddress) {
      this._tagsByAddress = new Map()
      for (const tag of this.contractTags.tags ?? []) {
        this._tagsByAddress.set(normalizeChainAddress(tag.contractAddress), tag)
      }
    }
    return this._tagsByAddress
  }

  private get enhancedGraph(): EnhancedGraph {
    if (!this._enhancedGraph) {
      const dataAccess = new DiscoveredDataAccess(this.discovered)
      const { edges } = buildEnhancedGraph(
        this.callGraphData,
        this.functionsData,
        dataAccess,
      )
      this._enhancedGraph = buildIndices(edges)
    }
    return this._enhancedGraph
  }

  private get capitalCalculator(): CapitalAnalysisCalculator {
    if (!this._capitalCalculator) {
      this._capitalCalculator = new CapitalAnalysisCalculator(
        this.enhancedGraph,
        this.fundsData,
        this.functionsData,
        this.contractNameMap,
        this.implToProxyMap,
      )
    }
    return this._capitalCalculator
  }

  private get mitigationsLookup(): Map<string, Mitigation[]> {
    if (!this._mitigationsLookup) {
      this._mitigationsLookup = this.buildMitigationsLookup()
    }
    return this._mitigationsLookup
  }

  private get transitiveMitigationsLookup(): Map<string, Mitigation[]> {
    if (!this._transitiveMitigationsLookup) {
      this._transitiveMitigationsLookup =
        this.buildTransitiveMitigationsLookup()
    }
    return this._transitiveMitigationsLookup
  }

  private buildLookupMaps(): void {
    this._contractNameMap = new Map()
    this._contractTypeMap = new Map()
    this._proxyTypeMap = new Map()

    this.projectData.entries?.forEach((entry: any) => {
      const allContracts = [
        ...(entry.initialContracts || []),
        ...(entry.discoveredContracts || []),
      ]
      allContracts.forEach((contract: any) => {
        const addr = normalizeChainAddress(contract.address)
        this._contractNameMap!.set(addr, contract.name || 'Unknown Contract')
        this._contractTypeMap!.set(addr, contract.type || 'Contract')
        if (contract.proxyType) {
          this._proxyTypeMap!.set(addr, contract.proxyType)
        }
      })

      entry.eoas?.forEach((eoa: any) => {
        this._contractNameMap!.set(
          normalizeChainAddress(eoa.address),
          eoa.name || 'Unknown EOA',
        )
        this._contractTypeMap!.set(
          normalizeChainAddress(eoa.address),
          eoa.type || 'EOA',
        )
      })
    })

    // Map implementation addresses to their proxy's name
    const implToProxy = buildImplementationToProxyMap(this.discovered)
    for (const [implAddr, proxyAddr] of implToProxy) {
      if (!this._contractNameMap!.has(implAddr)) {
        const proxyName = this._contractNameMap!.get(proxyAddr)
        if (proxyName) {
          this._contractNameMap!.set(implAddr, proxyName)
        }
      }
    }
  }

  private buildImplProxyMaps(): void {
    this._implToProxyMap = new Map()
    this._proxyToImplsMap = new Map()

    this.projectData.entries?.forEach((entry: any) => {
      const allContracts = [
        ...(entry.initialContracts || []),
        ...(entry.discoveredContracts || []),
      ]
      allContracts.forEach((contract: any) => {
        if (contract.implementationNames) {
          const proxyAddr = normalizeChainAddress(contract.address)
          const impls: string[] = []
          for (const implAddr of Object.keys(contract.implementationNames)) {
            const implNormalized = normalizeChainAddress(implAddr)
            if (implNormalized !== proxyAddr) {
              this._implToProxyMap!.set(implNormalized, contract.address)
              impls.push(implAddr)
            }
          }
          if (impls.length > 0) {
            this._proxyToImplsMap!.set(proxyAddr, impls)
          }
        }
      })
    })
  }

  /**
   * Check if a contract address matches the filter, considering impl→proxy mapping.
   * FunctionFolder may pass an implementation address, but functions.json
   * keys use proxy addresses (or vice versa).
   */
  private matchesContractFilter(
    contractAddress: string,
    filter: string,
  ): boolean {
    if (addressesEqual(contractAddress, filter)) return true

    // Check if filter is an impl address → resolve to proxy and compare
    const filterNorm = normalizeChainAddress(filter)
    const filterProxy = this.implToProxyMap.get(filterNorm)
    if (filterProxy && addressesEqual(contractAddress, filterProxy)) {
      return true
    }

    // Check if contractAddress is an impl address → resolve to proxy and compare
    const contractNorm = normalizeChainAddress(contractAddress)
    const contractProxy = this.implToProxyMap.get(contractNorm)
    if (contractProxy && addressesEqual(contractProxy, filter)) {
      return true
    }

    // Check if filter is a proxy → match any of its implementations
    const filterImpls = this.proxyToImplsMap.get(filterNorm)
    if (filterImpls) {
      for (const impl of filterImpls) {
        if (addressesEqual(contractAddress, impl)) return true
      }
    }

    return false
  }

  // ===========================================================================
  // Public API
  // ===========================================================================

  /**
   * Get admin analysis, optionally filtered by contract address.
   * Groups permissioned functions by their resolved admin addresses,
   * includes capital analysis and ownership chains.
   */
  getAdmins(contractFilter?: string): ApiAdminsResponse {
    // Step 1: Group functions by admin address (same as v2Scoring AdminInventoryModule)
    const adminsMap = new Map<string, AdminDetail>()
    const ownerResolutionCache = new Map<string, string[]>()

    if (this.functionsData?.contracts) {
      for (const [contractAddress, contractData] of Object.entries(
        this.functionsData.contracts,
      )) {
        // Apply contract filter if provided (with impl→proxy resolution)
        if (
          contractFilter &&
          !this.matchesContractFilter(contractAddress, contractFilter)
        ) {
          continue
        }

        for (const func of contractData.functions) {
          // Include functions that have owner definitions, regardless of
          // isPermissioned — FunctionFolder resolves and displays owners
          // for any function with ownerDefinitions.
          if (!func.ownerDefinitions || func.ownerDefinitions.length === 0) {
            continue
          }

          // Resolve owners with caching
          // Cache key must include contractAddress because $self paths
          // resolve differently per contract
          const cacheKey = `${contractAddress}|${JSON.stringify(func.ownerDefinitions)}`
          let adminAddresses = ownerResolutionCache.get(cacheKey)
          if (!adminAddresses) {
            const resolved = resolveOwnersFromDiscovered(
              this.paths,
              this.projectName,
              contractAddress,
              func.ownerDefinitions,
            )
            adminAddresses = [
              ...new Set(extractAddressesFromResolvedOwners(resolved)),
            ]
            ownerResolutionCache.set(cacheKey, adminAddresses)
          }

          // Group by admin
          const funcImpact: Impact =
            func.score === 'no-impact' ? 'no-impact' : 'critical'

          for (const adminAddr of adminAddresses) {
            const normalizedAdmin = normalizeChainAddress(adminAddr)
            if (!adminsMap.has(normalizedAdmin)) {
              const rawType =
                this.contractTypeMap.get(normalizedAdmin) || 'Unknown'
              const adminType = mapAdminType(
                rawType,
                normalizedAdmin,
                this.proxyTypeMap,
              )
              adminsMap.set(normalizedAdmin, {
                adminAddress: normalizedAdmin,
                adminName:
                  this.contractNameMap.get(normalizedAdmin) || normalizedAdmin,
                adminType,
                functions: [],
              })
            }

            adminsMap.get(normalizedAdmin)!.functions.push({
              contractAddress,
              contractName:
                this.contractNameMap.get(
                  normalizeChainAddress(contractAddress),
                ) || 'Unknown Contract',
              functionName: func.functionName,
              impact: funcImpact,
              mitigations: this.getMitigationsForOwner(
                contractAddress,
                func.functionName,
                normalizedAdmin,
                'admin',
              ),
            })
          }
        }
      }
    }

    // Step 2: Get enhanced traversal data for chains
    // We import the traversal results for chain data
    const traversalContracts = this.computeTraversalForChains(contractFilter)

    // Step 3: Run capital analysis and build AdminEntry[]
    const hasCallGraphData =
      Object.keys(this.callGraphData.contracts).length > 0
    const hasFundsData = Object.keys(this.fundsData?.contracts ?? {}).length > 0
    const canDoCapital = hasCallGraphData && hasFundsData

    const admins: AdminEntry[] = []

    for (const admin of adminsMap.values()) {
      const tag = this.tagsByAddress.get(
        normalizeChainAddress(admin.adminAddress),
      )

      // Run capital analysis if possible
      let capitalData: {
        functionsWithCapital: FunctionCapitalAnalysis[]
        totalDirectCapital: number
        totalDirectTokenValue: number
        totalReachableCapital: number
        totalReachableTokenValue: number
        uniqueContractsAffected: number
      } | null = null

      if (canDoCapital) {
        const adminWithCapital =
          this.capitalCalculator.analyzeAdminCapital(admin)
        capitalData = {
          functionsWithCapital: adminWithCapital.functionsWithCapital,
          totalDirectCapital: adminWithCapital.totalDirectCapital,
          totalDirectTokenValue: adminWithCapital.totalDirectTokenValue,
          totalReachableCapital: adminWithCapital.totalReachableCapital,
          totalReachableTokenValue: adminWithCapital.totalReachableTokenValue,
          uniqueContractsAffected: adminWithCapital.uniqueContractsAffected,
        }
      }

      // Build AdminFunctionEntry[] with chains and capital
      // Per-function capital data comes from capitalAnalysis (enhanced graph
      // forward BFS), which combines call graph + permission edges for richer
      // reachable contract data than functionAnalysis alone.
      const capitalFuncMap = new Map<string, FunctionCapitalAnalysis>()
      if (capitalData) {
        for (const fc of capitalData.functionsWithCapital) {
          const key = `${normalizeChainAddress(fc.contractAddress)}|${fc.functionName}`
          capitalFuncMap.set(key, fc)
        }
      }

      const functions: AdminFunctionEntry[] = admin.functions.map((f) => {
        // Get chains for this function from traversal data
        const chains = this.getChainsForAdmin(
          traversalContracts,
          f.contractAddress,
          f.functionName,
          admin.adminAddress,
        )

        // Look up per-function capital from capitalAnalysis (enhanced graph)
        const key = `${normalizeChainAddress(f.contractAddress)}|${f.functionName}`
        const capitalFunc = capitalFuncMap.get(key)

        return {
          contractAddress: f.contractAddress,
          contractName: f.contractName,
          functionName: f.functionName,
          impact: f.impact,
          mitigations: f.mitigations,
          chains,
          isUpgrade:
            capitalFunc?.isUpgrade ||
            isUpgradeFunction(f.functionName) ||
            undefined,
          directFundsUsd: capitalFunc?.directFundsUsd ?? 0,
          directTokenValueUsd: capitalFunc?.directTokenValueUsd ?? 0,
          reachableContracts: capitalFunc?.reachableContracts ?? [],
          totalReachableFundsUsd: capitalFunc?.totalReachableFundsUsd ?? 0,
          totalReachableTokenValueUsd:
            capitalFunc?.totalReachableTokenValueUsd ?? 0,
          unresolvedCallsCount: capitalFunc?.unresolvedCallsCount ?? 0,
        }
      })

      admins.push({
        address: admin.adminAddress,
        name: admin.adminName,
        type: admin.adminType,
        isExternal: tag?.isExternal ?? false,
        isGovernance: tag?.isGovernance ?? false,
        entity: tag?.entity ?? null,
        functions,
        totalDirectCapital: capitalData?.totalDirectCapital ?? 0,
        totalDirectTokenValue: capitalData?.totalDirectTokenValue ?? 0,
        totalReachableCapital: capitalData?.totalReachableCapital ?? 0,
        totalReachableTokenValue: capitalData?.totalReachableTokenValue ?? 0,
        uniqueContractsAffected: capitalData?.uniqueContractsAffected ?? 0,
      })
    }

    // Step 4: Compute project-wide totals (deduplicated capital)
    const totals = this.computeAdminTotals(admins, canDoCapital)

    return { totals, admins }
  }

  /**
   * Get dependency analysis, optionally filtered by contract address.
   * Groups external dependencies by dependency address with capital data.
   */
  getDependencies(contractFilter?: string): ApiDependenciesResponse {
    const analysis = this.functionAnalysis

    // Build funds lookup
    const fundsLookup = new Map<string, any>()
    for (const [addr, data] of Object.entries(this.fundsData.contracts ?? {})) {
      fundsLookup.set(normalizeChainAddress(addr), data)
    }

    // Group dependencies by external contract address
    const depMap = new Map<
      string,
      {
        address: string
        name: string
        entity: string | undefined
        isAutoDetected: boolean
        dependencyType: 'callgraph' | 'write' | undefined
        calledFunctions: Set<string>
        functions: DependencyFunctionEntry[]
      }
    >()

    for (const [contractAddr, contractFuncs] of Object.entries(
      analysis.contracts,
    )) {
      // Apply contract filter if provided (with impl→proxy resolution)
      if (
        contractFilter &&
        !this.matchesContractFilter(contractAddr, contractFilter)
      ) {
        continue
      }

      for (const [funcName, funcAnalysis] of Object.entries(contractFuncs)) {
        for (const dep of funcAnalysis.dependencies.entries) {
          const key = normalizeChainAddress(dep.contractAddress)
          let existing = depMap.get(key)
          if (!existing) {
            existing = {
              address: dep.contractAddress,
              name: dep.contractName,
              entity: dep.entity,
              isAutoDetected: dep.isAutoDetected,
              dependencyType: dep.dependencyType,
              calledFunctions: new Set(dep.calledFunctions),
              functions: [],
            }
            depMap.set(key, existing)
          }

          if (dep.isAutoDetected) existing.isAutoDetected = true
          if (!existing.entity && dep.entity) existing.entity = dep.entity
          for (const cf of dep.calledFunctions) {
            existing.calledFunctions.add(cf)
          }

          // Avoid duplicate function entries
          const alreadyAdded = existing.functions.some(
            (f) =>
              addressesEqual(f.contractAddress, contractAddr) &&
              f.functionName === funcName,
          )
          if (!alreadyAdded) {
            const impact = funcAnalysis.impact
            const contractFunds = fundsLookup.get(
              normalizeChainAddress(contractAddr),
            )
            const directFunds = impact
              ? (contractFunds?.balances?.totalUsdValue ?? 0) +
                (contractFunds?.positions?.totalUsdValue ?? 0)
              : 0
            const directTokenValue = impact
              ? (contractFunds?.tokenInfo?.tokenValue ?? 0)
              : 0

            existing.functions.push({
              contractAddress: contractAddr,
              contractName:
                this.contractNameMap.get(normalizeChainAddress(contractAddr)) ??
                'Unknown Contract',
              functionName: funcName,
              impact: this.getFunctionImpact(contractAddr, funcName),
              viewOnlyPath: dep.viewOnlyPath,
              calledFunctions: dep.calledFunctions,
              mitigations: this.getMitigationsForOwner(
                contractAddr,
                funcName,
                dep.contractAddress,
                'dependency',
              ),
              directFundsUsd: directFunds,
              directTokenValueUsd: directTokenValue,
              reachableContracts: (impact?.reachableContracts ?? []).map(
                (r) => ({
                  contractAddress: r.contractAddress,
                  contractName: r.contractName,
                  viewOnlyPath: r.viewOnlyPath,
                  calledFunctions: r.calledFunctions,
                  fundsUsd: r.fundsUsd,
                  tokenValueUsd: r.tokenValueUsd,
                  fundsAtRisk: r.calledFunctions.some(
                    (fn) =>
                      this.getFunctionImpact(r.contractAddress, fn) !==
                      'no-impact',
                  ),
                }),
              ),
            })
          }
        }
      }
    }

    // Build final dependencies with aggregated capital
    const dependencies: DependencyEntry[] = []
    for (const dep of depMap.values()) {
      // Compute aggregated funds at risk (deduplicated by contract)
      const mergedContracts = new Map<
        string,
        { funds: number; tokenValue: number }
      >()
      for (const fn of dep.functions) {
        if (fn.directFundsUsd > 0 || fn.directTokenValueUsd > 0) {
          const addr = normalizeChainAddress(fn.contractAddress)
          const ex = mergedContracts.get(addr)
          mergedContracts.set(addr, {
            funds: Math.max(ex?.funds ?? 0, fn.directFundsUsd),
            tokenValue: Math.max(ex?.tokenValue ?? 0, fn.directTokenValueUsd),
          })
        }
        for (const rc of fn.reachableContracts) {
          if (rc.fundsUsd <= 0 && rc.tokenValueUsd <= 0) continue
          const addr = normalizeChainAddress(rc.contractAddress)
          const ex = mergedContracts.get(addr)
          mergedContracts.set(addr, {
            funds: Math.max(ex?.funds ?? 0, rc.fundsUsd),
            tokenValue: Math.max(ex?.tokenValue ?? 0, rc.tokenValueUsd),
          })
        }
      }
      let totalFundsAtRisk = 0
      let totalTokenValueAtRisk = 0
      for (const { funds, tokenValue } of mergedContracts.values()) {
        totalFundsAtRisk += funds
        totalTokenValueAtRisk += tokenValue
      }

      dependencies.push({
        address: dep.address,
        name: dep.name,
        entity: dep.entity ?? null,
        isAutoDetected: dep.isAutoDetected,
        dependencyType: dep.dependencyType,
        viewOnlyPath:
          dep.functions.length > 0 &&
          dep.functions.every((f) => f.viewOnlyPath),
        calledFunctions: Array.from(dep.calledFunctions),
        functions: dep.functions,
        totalFundsAtRisk,
        totalTokenValueAtRisk,
      })
    }

    return {
      totals: { dependencyCount: dependencies.length },
      dependencies,
    }
  }

  /**
   * Get lightweight summary counts.
   */
  getSummary(): ProjectSummary {
    let contractCount = 0
    this.projectData.entries?.forEach((entry: any) => {
      contractCount += entry.initialContracts?.length || 0
      contractCount += entry.discoveredContracts?.length || 0
    })

    let permissionedFunctionCount = 0
    if (this.functionsData?.contracts) {
      for (const contractData of Object.values(this.functionsData.contracts)) {
        for (const func of contractData.functions) {
          if (func.isPermissioned) permissionedFunctionCount++
        }
      }
    }

    const admins = this.getAdmins()
    const deps = this.getDependencies()

    return {
      contractCount,
      permissionedFunctionCount,
      adminCount: admins.totals.adminCount,
      dependencyCount: deps.totals.dependencyCount,
    }
  }

  // ===========================================================================
  // Private Helpers
  // ===========================================================================

  /**
   * Compute traversal results for building ownership chains.
   * Reuses the same backward BFS logic as resolveEnhancedTraversal.
   */
  private computeTraversalForChains(
    contractFilter?: string,
  ): Record<string, Record<string, { terminals: TraversalTerminal[] }>> {
    const dataAccess = new DiscoveredDataAccess(this.discovered)
    const { edges, constructionErrors } = buildEnhancedGraph(
      this.callGraphData,
      this.functionsData,
      dataAccess,
    )
    const graph = buildIndices(edges)

    const ctx: TraversalContext = {
      functionsData: this.functionsData,
      graph,
      contractNameMap: this.contractNameMap,
      contractTypeMap: this.contractTypeMap,
      implToProxyMap: this.implToProxyMap,
      proxyToImplsMap: this.proxyToImplsMap,
      constructionErrors,
      memo: new Map(),
    }

    const contracts: Record<
      string,
      Record<string, { terminals: TraversalTerminal[] }>
    > = {}

    if (this.functionsData.contracts) {
      for (const [contractAddress, contractData] of Object.entries(
        this.functionsData.contracts,
      )) {
        if (
          contractFilter &&
          !this.matchesContractFilter(contractAddress, contractFilter)
        ) {
          continue
        }

        for (const func of contractData.functions) {
          if (!func.ownerDefinitions || func.ownerDefinitions.length === 0) {
            continue
          }

          const visited = new Set<string>()
          const result = traverse(
            ctx,
            contractAddress,
            func.functionName,
            visited,
            [],
            0,
            false,
          )

          const terminals = deduplicateTerminals(result.terminals)

          if (!contracts[contractAddress]) {
            contracts[contractAddress] = {}
          }
          contracts[contractAddress][func.functionName] = { terminals }
        }
      }
    }

    return contracts
  }

  /**
   * Get collapsed chains for a specific admin→function relationship.
   */
  private getChainsForAdmin(
    traversalContracts: Record<
      string,
      Record<string, { terminals: TraversalTerminal[] }>
    >,
    contractAddress: string,
    functionName: string,
    adminAddress: string,
  ): CollapsedChain[] {
    // Find the traversal result for this contract+function
    const contractEntry = Object.entries(traversalContracts).find(([addr]) =>
      addressesEqual(addr, contractAddress),
    )
    if (!contractEntry) return []

    const funcResult = contractEntry[1][functionName]
    if (!funcResult) return []

    // Filter terminals to only those that match the admin address
    const adminTerminals = funcResult.terminals.filter((t) =>
      addressesEqual(t.address, adminAddress),
    )
    if (adminTerminals.length === 0) return []

    return collapseChains(adminTerminals).chains
  }

  /**
   * Compute deduplicated project-wide capital totals across all admins.
   */
  private computeAdminTotals(
    admins: AdminEntry[],
    canDoCapital: boolean,
  ): ApiAdminsResponse['totals'] {
    if (!canDoCapital) {
      return {
        adminCount: admins.length,
        totalCapitalAtRisk: 0,
        totalTokenValueAtRisk: 0,
      }
    }

    // Same deduplication logic as v2Scoring AdminInventoryModule
    const contractCapitalMap = new Map<
      string,
      { funds: number; tokenValue: number }
    >()
    const resolveAddr = (raw: string): string => {
      const norm = normalizeChainAddress(raw)
      return this.implToProxyMap.get(norm) ?? norm
    }

    for (const admin of admins) {
      for (const func of admin.functions) {
        if (func.directFundsUsd > 0 || func.directTokenValueUsd > 0) {
          const addr = resolveAddr(func.contractAddress)
          if (!contractCapitalMap.has(addr)) {
            contractCapitalMap.set(addr, {
              funds: func.directFundsUsd,
              tokenValue: func.directTokenValueUsd,
            })
          }
        }
        for (const rc of func.reachableContracts) {
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
      adminCount: admins.length,
      totalCapitalAtRisk,
      totalTokenValueAtRisk,
    }
  }

  /**
   * Build mitigations lookup from functions.json.
   */
  private buildMitigationsLookup(): Map<string, Mitigation[]> {
    const lookup = new Map<string, Mitigation[]>()
    if (!this.functionsData?.contracts) return lookup

    for (const [contractAddr, contractData] of Object.entries(
      this.functionsData.contracts,
    )) {
      for (const func of contractData.functions) {
        const mitigations = buildMergedMitigations(
          func,
          this.paths,
          this.projectName,
        )
        if (mitigations) {
          const key = `${normalizeChainAddress(contractAddr)}|${func.functionName}`
          lookup.set(key, mitigations)
        }
      }
    }
    return lookup
  }

  /**
   * Build transitive mitigations lookup via forward BFS through call graph.
   * For each function, follows call graph edges forward and collects scoped
   * mitigations from downstream functions where scopedTo.address matches
   * a contract on the call path.
   */
  private buildTransitiveMitigationsLookup(): Map<string, Mitigation[]> {
    const transitiveLookup = new Map<string, Mitigation[]>()

    // Collect all unique (contract, function) pairs that have outgoing
    // call graph edges. We must iterate the enhanced graph — not just
    // functionsData — because many caller contracts (e.g. StablecoinBridge)
    // are not in functionsData but DO have call graph edges to downstream
    // functions that carry scoped mitigations.
    const seen = new Set<string>()
    for (const [, edges] of this.enhancedGraph.forwardIndex) {
      for (const edge of edges) {
        if (edge.edgeType !== 'callgraph' || !edge.sourceFunction) continue
        const key = `${normalizeChainAddress(edge.sourceContract)}|${edge.sourceFunction}`
        if (seen.has(key)) continue
        seen.add(key)

        const transitiveMits = this.collectDownstreamScopedMitigations(
          edge.sourceContract,
          edge.sourceFunction,
        )
        if (transitiveMits.length > 0) {
          transitiveLookup.set(key, transitiveMits)
        }
      }
    }

    return transitiveLookup
  }

  /**
   * Forward BFS through call graph edges from (startContract, startFunction).
   * At each downstream function, collects scoped mitigations where
   * scopedTo.address matches any contract on the call path from the start.
   *
   * Example: StablecoinBridge.mint() -> Frankencoin.mint()
   *   Frankencoin.mint() has mitigation scopedTo: StablecoinBridge
   *   -> collected because StablecoinBridge is on the path
   */
  private collectDownstreamScopedMitigations(
    startContract: string,
    startFunction: string,
  ): Mitigation[] {
    const collected: Mitigation[] = []
    const visited = new Set<string>()
    const directLookup = this.mitigationsLookup

    const queue: Array<{
      contract: string
      function: string
      pathContracts: Set<string>
    }> = [
      {
        contract: startContract,
        function: startFunction,
        pathContracts: new Set([normalizeChainAddress(startContract)]),
      },
    ]

    while (queue.length > 0) {
      const { contract, function: func, pathContracts } = queue.shift()!

      const visitKey = `${normalizeChainAddress(contract)}:${func}`
      if (visited.has(visitKey)) continue
      visited.add(visitKey)

      const normalizedContract = normalizeChainAddress(contract)
      const edges = this.enhancedGraph.forwardIndex.get(normalizedContract)
      if (!edges) continue

      for (const edge of edges) {
        // Only follow call graph edges, not permission edges
        if (edge.edgeType !== 'callgraph') continue
        // Only follow edges from the current function
        if (edge.sourceFunction !== func) continue

        const targetNorm = normalizeChainAddress(edge.targetContract)
        const targetKey = `${targetNorm}|${edge.targetFunction}`

        // Collect mitigations from downstream functions that are relevant
        // to callers going through this path:
        // - Global mitigations (no scopedTo): always propagate — a delay
        //   or limit on a downstream function protects all upstream callers
        // - Scoped mitigations: only if scopedTo.address matches a contract
        //   on the call path from the start
        const targetMitigations = directLookup.get(targetKey)
        if (targetMitigations) {
          for (const m of targetMitigations) {
            if (!m.scopedTo) {
              collected.push(m)
            } else if (
              pathContracts.has(normalizeChainAddress(m.scopedTo.address))
            ) {
              collected.push(m)
            }
          }
        }

        // Continue BFS with updated path
        const newPathContracts = new Set(pathContracts)
        newPathContracts.add(targetNorm)
        queue.push({
          contract: edge.targetContract,
          function: edge.targetFunction,
          pathContracts: newPathContracts,
        })
      }
    }

    // Deduplicate by (type, description, scopedTo.address)
    const seen = new Set<string>()
    const deduped: Mitigation[] = []
    for (const m of collected) {
      const key = `${m.type}:${m.description}:${m.scopedTo?.address ?? ''}`
      if (!seen.has(key)) {
        seen.add(key)
        deduped.push(m)
      }
    }
    return deduped
  }

  /**
   * Get mitigations for a function (direct + transitive), filtered for a
   * specific owner address. Single source of truth for mitigation resolution.
   */
  private getMitigationsForOwner(
    contractAddress: string,
    functionName: string,
    ownerAddress: string,
    ownerType: 'admin' | 'dependency',
  ): Mitigation[] | undefined {
    const key = `${normalizeChainAddress(contractAddress)}|${functionName}`
    const direct = this.mitigationsLookup.get(key)
    const transitive = this.transitiveMitigationsLookup.get(key)

    // Filter direct mitigations by owner (global ones pass, scoped ones
    // must match the owner address)
    const filteredDirect = filterMitigationsForOwner(
      direct,
      ownerAddress,
      ownerType,
    )

    // Transitive mitigations are NOT re-filtered: their scopedTo was already
    // validated during BFS collection (scopedTo.address matched a contract
    // on the call path). They apply to all callers going through that path.
    if (!filteredDirect && !transitive) return undefined
    if (!filteredDirect) return transitive
    if (!transitive) return filteredDirect
    return [...filteredDirect, ...transitive]
  }

  /**
   * Get function impact from functions.json.
   */
  private getFunctionImpact(contractAddr: string, funcName: string): Impact {
    const normalizedAddr = normalizeChainAddress(contractAddr)
    const contractEntry = Object.entries(
      this.functionsData?.contracts ?? {},
    ).find(([key]) => normalizeChainAddress(key) === normalizedAddr)
    if (!contractEntry) return 'critical'
    const func = contractEntry[1].functions.find(
      (f) => f.functionName === funcName,
    )
    return func?.score === 'no-impact' ? 'no-impact' : 'critical'
  }
}
