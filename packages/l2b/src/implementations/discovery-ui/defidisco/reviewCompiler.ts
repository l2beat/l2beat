import {
  ConfigReader,
  type DiscoveryOutput,
  type DiscoveryPaths,
  TemplateService,
} from '@l2beat/discovery'
import type {
  ApiContractTagsResponse,
  ApiFunctionsResponse,
  ContractFundsData,
  ApiFundsDataResponse,
  Impact,
  Mitigation,
  ResourceEntry,
  ReviewConfig,
} from './types'
import { getFunctions, resolveDelayFromDiscovered } from './functions'
import { getFundsData } from './fundsData'
import { getContractTags } from './contractTags'
import {
  normalizeChainAddress,
  addressesEqual,
  filterMitigationsForOwner,
  getFromAddressRecord,
  buildImplementationToProxyMap,
} from './addressUtils'
import { getProject } from '../getProject'
import {
  ProjectAnalysis,
  type ApiAdminsResponse,
  type ApiDependenciesResponse,
} from './projectAnalysis'
import * as fs from 'fs'
import * as path from 'path'

// ============================================================================
// Compiled Review Types
// ============================================================================

export interface CompiledReview {
  version: '1.0'
  compiledAt: string
  project: string

  metadata: {
    protocolName: string
    protocolSlug: string
    chain: string
    projectType: string
    tokenName: string
    description: string
  }

  totals: {
    contractCount: number
    permissionedFunctionCount: number
    scoredFunctionCount: number
    adminCount: number
    dependencyCount: number
    totalCapitalAtRisk: number
    totalTokenValueAtRisk: number
    totalTokenValue: number
  }

  admins: CompiledAdmin[]
  dependencies: CompiledDependency[]
  funds: CompiledFundHolder[]
  functions: CompiledFunction[]
  contracts: CompiledContract[]
  resources: CompiledResourceEntry[]
  activity?: ActivityEvent[]

  sections: Record<string, unknown>
}

export interface CompiledAdmin {
  address: string
  name: string
  description: string
  adminType: string
  isGovernance: boolean
  functions: CompiledAdminFunction[]
  totalDirectCapital: number
  totalDirectTokenValue: number
  totalReachableCapital: number
  totalReachableTokenValue: number
}

export interface CompiledAdminFunction {
  contractAddress: string
  contractName: string
  functionName: string
  impact: Impact
  directFundsUsd: number
  directTokenValueUsd: number
  reachableContracts: CompiledReachableContract[]
  mitigations?: Mitigation[]
}

export interface CompiledReachableContract {
  address: string
  name: string
  viewOnlyPath: boolean
  calledFunctions: string[]
  fundsUsd: number
  tokenValueUsd: number
  fundsAtRisk: boolean
}

export interface CompiledDependencyFunction {
  contractAddress: string
  contractName: string
  functionName: string
  viewOnlyPath: boolean
  /** Funds on the function's own contract */
  directFundsUsd: number
  directTokenValueUsd: number
  /** Contracts reachable via call graph from this function that hold funds */
  reachableContracts: CompiledReachableContract[]
  mitigations?: Mitigation[]
}

export interface CompiledDependency {
  address: string
  name: string
  description: string
  entity: string | null
  isAutoDetected: boolean
  viewOnlyPath: boolean
  calledFunctions: string[]
  functions: CompiledDependencyFunction[]
  /** Aggregated funds at risk across all functions that use this dependency (deduplicated by contract) */
  totalFundsAtRisk: number
  /** Aggregated token value at risk across all functions that use this dependency (deduplicated by contract) */
  totalTokenValueAtRisk: number
  /** How this dependency was detected: 'callgraph' (code calls), 'write' (permission-owner) */
  dependencyType?: 'callgraph' | 'write'
}

export interface CompiledFundHolder {
  address: string
  name: string
  description: string
  balances: { totalUsdValue: number } | null
  positions: { totalUsdValue: number } | null
  tokenInfo: {
    symbol: string
    price: number
    totalSupply: string
    tokenValue: number
  } | null
  aggregate?: {
    totalUsdValue: number
    contractCount: number
    handlerName: string
    label?: string
  } | null
}

export interface CompiledFunction {
  contractAddress: string
  contractName: string
  functionName: string
  impact: Impact
  mitigations?: Mitigation[]
}

export interface CompiledContract {
  address: string
  name: string
  isExternal: boolean
  isGovernance: boolean
  entity: string | null
  proxyType: string | null
}

export type CompiledResourceEntry = ResourceEntry

// ============================================================================
// Activity Feed Types
// ============================================================================

export interface UpgradeEvent {
  type: 'upgrade'
  timestamp: string
  contractAddress: string
  contractName: string
  txHash: string
  implementations: string[]
}

export type ActivityEvent = UpgradeEvent

// ============================================================================
// Compilation Result
// ============================================================================

export type CompileResult =
  | { status: 'success'; path: string }
  | { status: 'skipped'; reason: 'no-review-config' | 'no-call-graph' }
  | { status: 'error'; error: string }

// ============================================================================
// ReviewCompiler
// ============================================================================

/**
 * Compiles all project data into a self-contained review JSON artifact.
 *
 * The compiled review is the exact data a frontend needs to render a protocol
 * review page. It joins V2 scoring data with human-written descriptions from
 * review-config.json, resolves template variables, and writes a single file.
 *
 * Guard conditions:
 * - review-config.json must exist (researcher has written descriptions)
 * - call-graph-data.json must exist (researcher has run Slither analysis)
 *
 * If either is missing, compilation is skipped and the caller is notified
 * so they can send a Discord warning.
 */
export class ReviewCompiler {
  constructor(
    private readonly paths: DiscoveryPaths,
    private readonly log: (msg: string) => void = console.log,
  ) {}

  /**
   * Returns the default output directory for compiled reviews:
   * <repo-root>/packages/defiscan-frontend/public/data
   */
  getDefaultOutputDir(): string {
    return path.join(
      this.paths.root,
      'packages',
      'defiscan-frontend',
      'public',
      'data',
    )
  }

  compile(project: string, outputDir?: string): CompileResult {
    const projectDir = path.join(this.paths.discovery, project)

    // Guard: review-config.json must exist
    const reviewConfigPath = path.join(projectDir, 'review-config.json')
    if (!fs.existsSync(reviewConfigPath)) {
      this.log(`No review-config.json found for ${project}`)
      return { status: 'skipped', reason: 'no-review-config' }
    }

    // Guard: call-graph-data.json must exist
    const callGraphPath = path.join(projectDir, 'call-graph-data.json')
    if (!fs.existsSync(callGraphPath)) {
      this.log(`No call-graph-data.json found for ${project}`)
      return { status: 'skipped', reason: 'no-call-graph' }
    }

    try {
      // 1. Read review config
      const reviewConfig = JSON.parse(
        fs.readFileSync(reviewConfigPath, 'utf8'),
      ) as ReviewConfig

      // 2. Build unified analysis via ProjectAnalysis
      const configReader = new ConfigReader(this.paths.discovery)
      const templateService = new TemplateService(this.paths.discovery)
      const analysis = new ProjectAnalysis(
        this.paths,
        configReader,
        templateService,
        project,
      )
      const adminsResult = analysis.getAdmins()
      const depsResult = analysis.getDependencies()

      // 3. Read funds data
      const fundsData = getFundsData(this.paths, project)

      // 4. Read contract tags
      const contractTags = getContractTags(this.paths, project)

      // 5. Read functions data (for mitigations)
      const functionsData = getFunctions(this.paths, project)

      // 6. Load project data for contract names (applies config name overrides + multisig formatting)
      const projectData = getProject(configReader, templateService, project)

      // 6b. Read discovery output for $pastUpgrades (activity feed)
      const discovery = configReader.readDiscovery(project)

      // 7. Build flat list of contracts with names from getProject
      const allProjectContracts: {
        name: string
        address: string
        type: string
        proxyType?: string
      }[] = []
      for (const entry of projectData.entries) {
        for (const contract of [
          ...(entry.initialContracts ?? []),
          ...(entry.discoveredContracts ?? []),
        ]) {
          allProjectContracts.push({
            name: contract.name || contract.address,
            address: contract.address,
            type: contract.type,
            proxyType: contract.proxyType,
          })
        }
        for (const eoa of entry.eoas ?? []) {
          allProjectContracts.push({
            name: eoa.address,
            address: eoa.address,
            type: 'EOA',
            proxyType: 'EOA',
          })
        }
      }

      // 8. Collect admin addresses from admins result
      const adminAddresses = new Set<string>()
      for (const admin of adminsResult.admins) {
        adminAddresses.add(normalizeChainAddress(admin.address))
      }

      // 9. Filter out non-admin EOAs
      const discoveryEntries = allProjectContracts.filter((e) => {
        const norm = normalizeChainAddress(e.address)
        if (e.type === 'EOA' && !adminAddresses.has(norm)) return false
        return true
      })

      // 10. Build the compiled review
      const compiled = this.buildCompiledReview(
        project,
        reviewConfig,
        adminsResult,
        depsResult,
        fundsData,
        contractTags,
        functionsData,
        discoveryEntries,
        discovery,
      )

      // 11. Resolve template variables in all description fields
      this.resolveTemplateVariables(compiled, reviewConfig.dataKeys, {
        adminsResult,
        fundsData,
      })

      // 12. Write compiled-review.json to defiscan-frontend/public/data/<slug>/
      const targetDir = outputDir ?? this.getDefaultOutputDir()
      const slug = reviewConfig.protocolSlug
      const slugDir = path.join(targetDir, slug)
      fs.mkdirSync(slugDir, { recursive: true })

      const outputPath = path.join(slugDir, 'compiled-review.json')
      fs.writeFileSync(outputPath, JSON.stringify(compiled, null, 2))

      this.log(`Review compiled successfully: ${outputPath}`)

      return { status: 'success', path: outputPath }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      this.log(`Review compilation error for ${project}: ${errorMessage}`)
      return { status: 'error', error: errorMessage }
    }
  }

  private buildCompiledReview(
    project: string,
    reviewConfig: ReviewConfig,
    adminsResult: ApiAdminsResponse,
    depsResult: ApiDependenciesResponse,
    fundsData: ApiFundsDataResponse,
    contractTags: ApiContractTagsResponse,
    functionsData: ApiFunctionsResponse,
    discoveryEntries: { name?: string; address: string; proxyType?: string }[],
    discovery: DiscoveryOutput,
  ): CompiledReview {
    // Build mitigations lookup: (contractAddress|functionName) → merged Mitigation[]
    const mitigationsLookup = new Map<string, Mitigation[]>()
    if (functionsData?.contracts) {
      for (const [contractAddr, contractData] of Object.entries(
        functionsData.contracts,
      )) {
        for (const func of contractData.functions) {
          const mitigations: Mitigation[] = []
          // Include delay as a delay-type mitigation
          if (func.delay) {
            const resolved = resolveDelayFromDiscovered(
              this.paths,
              project,
              func.delay,
            )
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
          if (mitigations.length > 0) {
            const key = `${normalizeChainAddress(contractAddr)}|${func.functionName}`
            mitigationsLookup.set(key, mitigations)
          }
        }
      }
    }

    const getMitigationsForFunction = (
      contractAddress: string,
      functionName: string,
    ): Mitigation[] | undefined => {
      const key = `${normalizeChainAddress(contractAddress)}|${functionName}`
      return mitigationsLookup.get(key)
    }

    const tagsByAddress = new Map<
      string,
      ApiContractTagsResponse['tags'][number]
    >()
    for (const tag of contractTags.tags ?? []) {
      tagsByAddress.set(normalizeChainAddress(tag.contractAddress), tag)
    }

    // Case-insensitive lookup for funds data with eth: prefix normalization
    const fundsLookup = new Map<string, ContractFundsData>()
    for (const [addr, data] of Object.entries(fundsData.contracts ?? {})) {
      fundsLookup.set(normalizeChainAddress(addr), data)
    }

    // Build admins from ProjectAnalysis admins result
    const admins: CompiledAdmin[] = []
    for (const admin of adminsResult.admins) {
      // Skip admins that are tagged as external — they belong to
      // external dependencies and are not protocol admins
      if (admin.isExternal) continue

      const desc = getFromAddressRecord(reviewConfig.admins, admin.address)

      admins.push({
        address: admin.address,
        name: desc?.name ?? admin.name,
        description: desc?.description ?? '',
        adminType: admin.type,
        isGovernance: admin.isGovernance,
        functions: admin.functions.map((f) => ({
          contractAddress: f.contractAddress,
          contractName: f.contractName,
          functionName: f.functionName,
          impact: f.impact,
          directFundsUsd: f.directFundsUsd,
          directTokenValueUsd: f.directTokenValueUsd,
          reachableContracts: (f.reachableContracts ?? []).map((r) => ({
            address: r.contractAddress,
            name: r.contractName,
            viewOnlyPath: r.viewOnlyPath,
            calledFunctions: r.calledFunctions,
            fundsUsd: r.fundsUsd,
            tokenValueUsd: r.tokenValueUsd,
            fundsAtRisk: r.fundsAtRisk,
          })),
          mitigations:
            f.mitigations ??
            getMitigationsForFunction(f.contractAddress, f.functionName),
        })),
        totalDirectCapital: admin.totalDirectCapital,
        totalDirectTokenValue: admin.totalDirectTokenValue,
        totalReachableCapital: admin.totalReachableCapital,
        totalReachableTokenValue: admin.totalReachableTokenValue,
      })
    }

    // Build contract name lookup from discovery entries (covers all contracts)
    const contractNameMap = new Map<string, string>()
    for (const entry of discoveryEntries) {
      if (entry.name) {
        contractNameMap.set(normalizeChainAddress(entry.address), entry.name)
      }
    }

    // Map implementation addresses to their proxy's name so that
    // functions keyed by implementation address resolve correctly
    const implToProxy = buildImplementationToProxyMap(discovery)
    for (const [implAddr, proxyAddr] of implToProxy) {
      if (!contractNameMap.has(implAddr)) {
        const proxyName = contractNameMap.get(proxyAddr)
        if (proxyName) {
          contractNameMap.set(implAddr, proxyName)
        }
      }
    }

    // Build dependencies from ProjectAnalysis dependencies result
    const dependencies: CompiledDependency[] = []
    for (const dep of depsResult.dependencies) {
      const desc = getFromAddressRecord(reviewConfig.dependencies, dep.address)

      dependencies.push({
        address: dep.address,
        name: desc?.name ?? dep.name,
        description: desc?.description ?? '',
        entity: dep.entity ?? null,
        isAutoDetected: dep.isAutoDetected,
        viewOnlyPath: dep.viewOnlyPath,
        calledFunctions: dep.calledFunctions,
        functions: dep.functions.map((f) => ({
          contractAddress: f.contractAddress,
          contractName: f.contractName,
          functionName: f.functionName,
          viewOnlyPath: f.viewOnlyPath,
          directFundsUsd: f.directFundsUsd,
          directTokenValueUsd: f.directTokenValueUsd,
          reachableContracts: (f.reachableContracts ?? []).map((r) => ({
            address: r.contractAddress,
            name: r.contractName,
            viewOnlyPath: r.viewOnlyPath,
            calledFunctions: r.calledFunctions,
            fundsUsd: r.fundsUsd,
            tokenValueUsd: r.tokenValueUsd,
            fundsAtRisk: r.fundsAtRisk,
          })),
          mitigations:
            f.mitigations ??
            getMitigationsForFunction(f.contractAddress, f.functionName),
        })),
        totalFundsAtRisk: dep.totalFundsAtRisk,
        totalTokenValueAtRisk: dep.totalTokenValueAtRisk,
        dependencyType: dep.dependencyType,
      })
    }

    // Build fund holders from funds data + review config descriptions
    const funds: CompiledFundHolder[] = []
    for (const [address, desc] of Object.entries(reviewConfig.funds ?? {})) {
      const normalizedAddr = normalizeChainAddress(address)
      const contractFunds = fundsLookup.get(normalizedAddr)

      const tag = tagsByAddress.get(normalizedAddr)

      funds.push({
        address: normalizedAddr,
        name: desc.name ?? address,
        description: desc.description ?? '',
        balances: contractFunds?.balances
          ? { totalUsdValue: contractFunds.balances.totalUsdValue }
          : null,
        positions: contractFunds?.positions
          ? { totalUsdValue: contractFunds.positions.totalUsdValue }
          : null,
        tokenInfo: contractFunds?.tokenInfo
          ? {
              symbol: contractFunds.tokenInfo.symbol,
              price: contractFunds.tokenInfo.price,
              totalSupply: contractFunds.tokenInfo.totalSupply,
              tokenValue: contractFunds.tokenInfo.tokenValue,
            }
          : null,
        aggregate: contractFunds?.aggregate
          ? {
              totalUsdValue: contractFunds.aggregate.totalUsdValue,
              contractCount: contractFunds.aggregate.contractCount,
              handlerName: contractFunds.aggregate.handlerName,
              label: tag?.aggregateLabel,
            }
          : tag?.fetchAggregate
            ? {
                totalUsdValue: 0,
                contractCount: 0,
                handlerName: tag.aggregateHandler ?? 'unknown',
                label: tag.aggregateLabel,
              }
            : null,
      })
    }

    // Add aggregate-tagged contracts not already in reviewConfig.funds
    const fundsAddressSet = new Set(
      Object.keys(reviewConfig.funds ?? {}).map((a) =>
        normalizeChainAddress(a),
      ),
    )
    for (const tag of contractTags.tags) {
      if (!tag.fetchAggregate) continue
      const normalizedAddr = normalizeChainAddress(tag.contractAddress)
      if (fundsAddressSet.has(normalizedAddr)) continue
      const contractFunds = fundsLookup.get(normalizedAddr)
      const contractName = tag.aggregateLabel ?? tag.contractAddress
      funds.push({
        address: tag.contractAddress,
        name: contractName,
        description: '',
        balances: null,
        positions: null,
        tokenInfo: null,
        aggregate: contractFunds?.aggregate
          ? {
              totalUsdValue: contractFunds.aggregate.totalUsdValue,
              contractCount: contractFunds.aggregate.contractCount,
              handlerName: contractFunds.aggregate.handlerName,
              label: tag.aggregateLabel,
            }
          : {
              totalUsdValue: 0,
              contractCount: 0,
              handlerName: tag.aggregateHandler ?? 'unknown',
              label: tag.aggregateLabel,
            },
      })
    }

    // Build functions from admins data, only including functions controlled by
    // meaningful admins (EOA, Multisig, Governance, Upgradeable)
    // governance is checked with isGovernance flag, not the set
    const meaningfulAdminTypes = new Set(['EOA', 'Multisig', 'Upgradeable'])
    const functions: CompiledFunction[] = []
    const seenFunctions = new Set<string>()
    for (const admin of admins) {
      if (!meaningfulAdminTypes.has(admin.adminType) && !admin.isGovernance) {
        continue
      }
      for (const fn of admin.functions) {
        const key = `${normalizeChainAddress(fn.contractAddress)}:${fn.functionName}`
        if (!seenFunctions.has(key)) {
          seenFunctions.add(key)
          functions.push({
            contractAddress: normalizeChainAddress(fn.contractAddress),
            contractName: fn.contractName,
            functionName: fn.functionName,
            impact: fn.impact,
            mitigations:
              fn.mitigations ??
              getMitigationsForFunction(fn.contractAddress, fn.functionName),
          })
        }
      }
    }

    // Build contracts list from discovery entries, enriched with tag data
    // Build review-config name lookup (admins, dependencies, funds all have name overrides)
    const configNameMap = new Map<string, string>()
    for (const section of [
      reviewConfig.admins,
      reviewConfig.dependencies,
      reviewConfig.funds,
    ]) {
      for (const [addr, desc] of Object.entries(section ?? {})) {
        if (desc?.name) {
          configNameMap.set(normalizeChainAddress(addr), desc.name)
        }
      }
    }

    const contracts: CompiledContract[] = []
    for (const entry of discoveryEntries) {
      const addrNorm = normalizeChainAddress(entry.address)
      const tag = tagsByAddress.get(addrNorm)

      // Resolve name: review-config override > cleaned getProject name > address
      let name = configNameMap.get(addrNorm) ?? entry.name ?? entry.address
      // Clean up multisig names: "5/8 63% Safe" → "5/8 Multisig"
      if (entry.proxyType === 'gnosis safe' && !configNameMap.has(addrNorm)) {
        name = name
          .replace(/\s+\d+%/, '') // remove percentage
          .replace(/\b(GnosisSafe|Safe)\b/, 'Multisig') // replace Safe/GnosisSafe with Multisig
      }

      contracts.push({
        address: entry.address,
        name,
        isExternal: tag?.isExternal ?? false,
        isGovernance: tag?.isGovernance ?? false,
        entity: tag?.entity ?? null,
        proxyType: entry.proxyType ?? null,
      })
    }

    // Build activity feed from $pastUpgrades in discovery entries
    const activity: ActivityEvent[] = []
    for (const entry of discovery.entries) {
      const pastUpgrades = entry.values?.['$pastUpgrades']
      if (!Array.isArray(pastUpgrades)) continue

      // Skip external contracts
      const addrNorm = normalizeChainAddress(entry.address)
      const tag = tagsByAddress.get(addrNorm)
      if (tag?.isExternal) continue

      const name = contractNameMap.get(addrNorm) ?? entry.name ?? entry.address

      for (const upgrade of pastUpgrades) {
        if (!Array.isArray(upgrade) || upgrade.length < 3) continue
        const [timestamp, txHash, implementations] = upgrade as [
          string,
          string,
          string[],
        ]
        activity.push({
          type: 'upgrade',
          timestamp: String(timestamp),
          contractAddress: entry.address,
          contractName: name,
          txHash: String(txHash),
          implementations: Array.isArray(implementations)
            ? implementations.map(String)
            : [],
        })
      }
    }

    // Sort newest first
    activity.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )

    return {
      version: '1.0',
      compiledAt: new Date().toISOString(),
      project,

      metadata: {
        protocolName: reviewConfig.protocolName,
        protocolSlug: reviewConfig.protocolSlug,
        chain: reviewConfig.chain,
        projectType: reviewConfig.projectType,
        tokenName: reviewConfig.tokenName,
        description: reviewConfig.description,
      },

      totals: {
        contractCount: this.countContracts(discoveryEntries),
        permissionedFunctionCount:
          this.countPermissionedFunctions(functionsData),
        scoredFunctionCount: this.countScoredFunctions(functionsData),
        adminCount: adminsResult.totals.adminCount,
        dependencyCount: depsResult.totals.dependencyCount,
        totalCapitalAtRisk:
          (adminsResult.totals.totalCapitalAtRisk ?? 0) +
          funds.reduce((sum, f) => sum + (f.aggregate?.totalUsdValue ?? 0), 0),
        totalTokenValueAtRisk: adminsResult.totals.totalTokenValueAtRisk ?? 0,
        totalTokenValue: funds.reduce(
          (sum, f) => sum + (f.tokenInfo?.tokenValue ?? 0),
          0,
        ),
      },

      admins,
      dependencies,
      funds,
      functions,
      contracts,
      resources: reviewConfig.resources ?? [],
      activity: activity.length > 0 ? activity : undefined,
      sections: reviewConfig.sections ?? {},
    }
  }

  /**
   * Resolves {{templateVar}} placeholders in all description fields.
   *
   * Walks the dataKeys map from review-config.json, evaluates each path
   * against the v2 score and funds data, formats numeric values as USD
   * strings, and replaces all occurrences in description fields.
   */
  private resolveTemplateVariables(
    compiled: CompiledReview,
    dataKeys: Record<string, string>,
    sources: {
      adminsResult: ApiAdminsResponse
      fundsData: ApiFundsDataResponse
    },
  ): void {
    if (!dataKeys || Object.keys(dataKeys).length === 0) return

    // Build resolved values map
    const resolved = new Map<string, string>()
    for (const [varName, dataPath] of Object.entries(dataKeys)) {
      const value = this.resolveDataPath(dataPath, sources)
      if (value === null) {
        resolved.set(varName, '(N/A)')
      } else {
        // Infer format from variable name: "Count" suffix → plain integer
        const isCount = /count$/i.test(varName)
        resolved.set(
          varName,
          isCount ? String(Math.round(value)) : formatUsdValue(value),
        )
      }
    }

    // Replace in metadata.description
    compiled.metadata.description = this.replaceTemplateVars(
      compiled.metadata.description,
      resolved,
    )

    // Replace in admin descriptions
    for (const admin of compiled.admins) {
      admin.description = this.replaceTemplateVars(admin.description, resolved)
    }

    // Replace in dependency descriptions
    for (const dep of compiled.dependencies) {
      dep.description = this.replaceTemplateVars(dep.description, resolved)
    }

    // Replace in fund descriptions
    for (const fund of compiled.funds) {
      fund.description = this.replaceTemplateVars(fund.description, resolved)
    }
  }

  private replaceTemplateVars(
    text: string,
    resolved: Map<string, string>,
  ): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return resolved.get(varName) ?? match
    })
  }

  /**
   * Evaluates a data path like "fundsdata.contracts[\"eth:0x...\"].balances.totalUsdValue"
   * against the available data sources.
   */
  private resolveDataPath(
    dataPath: string,
    sources: {
      adminsResult: ApiAdminsResponse
      fundsData: ApiFundsDataResponse
    },
  ): number | null {
    try {
      let root: any
      let remainingPath: string

      if (dataPath.startsWith('v2score.')) {
        // Backward compatibility: map v2score.* paths to adminsResult
        return this.resolveV2ScorePath(dataPath, sources.adminsResult)
      } else if (dataPath.startsWith('fundsdata.')) {
        // Normalize contract address keys for case-insensitive matching
        const fundsData = { ...sources.fundsData }
        if (fundsData.contracts) {
          const normalized: Record<string, any> = {}
          for (const [k, v] of Object.entries(fundsData.contracts)) {
            normalized[normalizeChainAddress(k)] = v
          }
          fundsData.contracts = normalized as any
        }
        root = fundsData
        remainingPath = dataPath.slice('fundsdata.'.length)
      } else {
        return null
      }

      return this.navigatePath(root, remainingPath)
    } catch {
      return null
    }
  }

  /**
   * Maps v2score.* template variable paths to the new adminsResult data.
   * Supports:
   *   v2score.inventory.admins.totalCapitalAtRisk
   *   v2score.inventory.admins.totalTokenValueAtRisk
   *   v2score.inventory.admins.breakdown["eth:0x..."].totalDirectCapital
   *   v2score.inventory.admins.breakdown["eth:0x..."].totalReachableCapital
   */
  private resolveV2ScorePath(
    dataPath: string,
    adminsResult: ApiAdminsResponse,
  ): number | null {
    // v2score.inventory.admins.totalCapitalAtRisk
    if (dataPath === 'v2score.inventory.admins.totalCapitalAtRisk') {
      return adminsResult.totals.totalCapitalAtRisk
    }
    // v2score.inventory.admins.totalTokenValueAtRisk
    if (dataPath === 'v2score.inventory.admins.totalTokenValueAtRisk') {
      return adminsResult.totals.totalTokenValueAtRisk
    }

    // v2score.inventory.admins.breakdown["eth:0x..."].field
    const match = dataPath.match(
      /v2score\.inventory\.admins\.breakdown\["([^"]+)"\]\.(\w+)/,
    )
    if (!match) return null

    const [, address, field] = match
    const admin = adminsResult.admins.find((a) =>
      addressesEqual(a.address, address),
    )
    if (!admin) return null

    // Map field names from v2Score admin shape to AdminEntry shape
    const fieldMap: Record<string, number | undefined> = {
      totalDirectCapital: admin.totalDirectCapital,
      totalDirectTokenValue: admin.totalDirectTokenValue,
      totalReachableCapital: admin.totalReachableCapital,
      totalReachableTokenValue: admin.totalReachableTokenValue,
    }
    const value = fieldMap[field]
    return typeof value === 'number' ? value : null
  }

  private countContracts(
    discoveryEntries: { name?: string; address: string; proxyType?: string }[],
  ): number {
    return discoveryEntries.filter((e) => e.proxyType !== 'EOA').length
  }

  private countPermissionedFunctions(
    functionsData: ApiFunctionsResponse,
  ): number {
    let count = 0
    if (functionsData?.contracts) {
      for (const contractData of Object.values(functionsData.contracts)) {
        for (const func of contractData.functions) {
          if (func.isPermissioned) count++
        }
      }
    }
    return count
  }

  private countScoredFunctions(functionsData: ApiFunctionsResponse): number {
    let count = 0
    if (functionsData?.contracts) {
      for (const contractData of Object.values(functionsData.contracts)) {
        for (const func of contractData.functions) {
          if (func.isPermissioned && func.score && func.score !== 'unscored')
            count++
        }
      }
    }
    return count
  }

  private navigatePath(obj: any, pathStr: string): number | null {
    // Handle bracket notation: contracts["eth:0x..."].balances.totalUsdValue
    const parts: string[] = []
    let current = ''
    let inBracket = false

    for (let i = 0; i < pathStr.length; i++) {
      const char = pathStr[i]
      if (char === '[' && !inBracket) {
        if (current) parts.push(current)
        current = ''
        inBracket = true
      } else if (char === ']' && inBracket) {
        // Strip surrounding quotes
        const key = current.replace(/^["']|["']$/g, '')
        parts.push(key)
        current = ''
        inBracket = false
      } else if (char === '.' && !inBracket) {
        if (current) parts.push(current)
        current = ''
      } else {
        current += char
      }
    }
    if (current) parts.push(current)

    let value = obj
    for (const part of parts) {
      if (value === null || value === undefined) return null
      value = value[part]
    }

    return typeof value === 'number' ? value : null
  }
}

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Formats a USD value for display in descriptions.
 * Backend equivalent of formatUsdValue() from scoringShared.tsx.
 */
function formatUsdValue(value: number): string {
  if (value === 0) return '$0'

  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''

  if (abs >= 1_000_000_000) {
    return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`
  }
  if (abs >= 1_000_000) {
    return `${sign}$${(abs / 1_000_000).toFixed(2)}M`
  }
  if (abs >= 1_000) {
    return `${sign}$${(abs / 1_000).toFixed(2)}K`
  }
  return `${sign}$${abs.toFixed(2)}`
}
