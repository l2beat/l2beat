import {
  ConfigReader,
  type DiscoveryPaths,
  TemplateService,
} from '@l2beat/discovery'
import { calculateV2Score, type V2ScoreResult } from './v2Scoring'
import type {
  AdminDetailWithCapital,
  ApiContractTagsResponse,
  ContractFundsData,
  ApiFunctionAnalysisResponse,
  ApiFundsDataResponse,
  ReviewConfig,
} from './types'
import { computeFunctionAnalysis } from './functionAnalysis'
import { getFundsData } from './fundsData'
import { getContractTags } from './contractTags'
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
  }

  admins: CompiledAdmin[]
  dependencies: CompiledDependency[]
  funds: CompiledFundHolder[]
  functions: CompiledFunction[]
  contracts: CompiledContract[]

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
  impact: 'critical'
  directFundsUsd: number
  directTokenValueUsd: number
  reachableContracts: CompiledReachableContract[]
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

export interface CompiledDependency {
  address: string
  name: string
  description: string
  entity: string | null
  isAutoDetected: boolean
  viewOnlyPath: boolean
  calledFunctions: string[]
  functions: {
    contractAddress: string
    contractName: string
    functionName: string
    viewOnlyPath: boolean
  }[]
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
}

export interface CompiledFunction {
  contractAddress: string
  contractName: string
  functionName: string
  impact: 'critical'
}

export interface CompiledContract {
  address: string
  name: string
  isExternal: boolean
  isGovernance: boolean
  entity: string | null
  proxyType: string | null
}

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

  compile(project: string): CompileResult {
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

      // 2. Calculate V2 score
      const configReader = new ConfigReader(this.paths.discovery)
      const templateService = new TemplateService(this.paths.discovery)
      const v2Score = calculateV2Score(
        this.paths,
        configReader,
        templateService,
        project,
      )

      // 3. Read funds data
      const fundsData = getFundsData(this.paths, project)

      // 4. Read contract tags
      const contractTags = getContractTags(this.paths, project)

      // 5. Compute function analysis (rich dependency data with viewOnlyPath)
      const functionAnalysis = computeFunctionAnalysis(this.paths, project)

      // 6. Build the compiled review
      const compiled = this.buildCompiledReview(
        project,
        reviewConfig,
        v2Score,
        fundsData,
        contractTags,
        functionAnalysis,
      )

      // 7. Resolve template variables in all description fields
      this.resolveTemplateVariables(compiled, reviewConfig.dataKeys, {
        v2Score,
        fundsData,
      })

      // 8. Write compiled-review.json
      const outputPath = path.join(projectDir, 'compiled-review.json')
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
    v2Score: V2ScoreResult,
    fundsData: ApiFundsDataResponse,
    contractTags: ApiContractTagsResponse,
    functionAnalysis: ApiFunctionAnalysisResponse,
  ): CompiledReview {
    const tagsByAddress = new Map<
      string,
      ApiContractTagsResponse['tags'][number]
    >()
    for (const tag of contractTags.tags ?? []) {
      tagsByAddress.set(tag.contractAddress.toLowerCase(), tag)
    }

    // Case-insensitive lookup for funds data with eth: prefix normalization
    const fundsLookup = new Map<string, ContractFundsData>()
    for (const [addr, data] of Object.entries(fundsData.contracts ?? {})) {
      fundsLookup.set(addr.replace(/^eth:/i, '').toLowerCase(), data)
    }

    // Build admins from v2 scoring breakdown
    const admins: CompiledAdmin[] = []
    if (v2Score.inventory.admins.breakdown) {
      for (const admin of v2Score.inventory.admins.breakdown) {
        const desc =
          reviewConfig.admins[admin.adminAddress] ??
          reviewConfig.admins[admin.adminAddress.toLowerCase()]
        const tag = tagsByAddress.get(
          admin.adminAddress.replace(/^eth:/i, '').toLowerCase(),
        )

        const withCapital = admin as AdminDetailWithCapital
        const hasCapital = 'totalDirectCapital' in withCapital

        admins.push({
          address: admin.adminAddress,
          name: desc?.name ?? admin.adminName,
          description: desc?.description ?? '',
          adminType: admin.adminType,
          isGovernance: tag?.isGovernance ?? false,
          functions: hasCapital
            ? (withCapital.functionsWithCapital ?? []).map((f) => ({
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
              }))
            : admin.functions.map((f) => ({
                contractAddress: f.contractAddress,
                contractName: f.contractName,
                functionName: f.functionName,
                impact: f.impact,
                directFundsUsd: 0,
                directTokenValueUsd: 0,
                reachableContracts: [],
              })),
          totalDirectCapital: hasCapital ? withCapital.totalDirectCapital : 0,
          totalDirectTokenValue: hasCapital
            ? withCapital.totalDirectTokenValue
            : 0,
          totalReachableCapital: hasCapital
            ? withCapital.totalReachableCapital
            : 0,
          totalReachableTokenValue: hasCapital
            ? withCapital.totalReachableTokenValue
            : 0,
        })
      }
    }

    // Build contract name lookup from v2Score admin functions
    const contractNameMap = new Map<string, string>()
    if (v2Score.inventory.admins.breakdown) {
      for (const admin of v2Score.inventory.admins.breakdown) {
        for (const fn of admin.functions) {
          contractNameMap.set(fn.contractAddress.toLowerCase(), fn.contractName)
        }
      }
    }

    // Build dependencies from function analysis (richer data than v2Score)
    const depMap = new Map<
      string,
      {
        address: string
        name: string
        entity: string | undefined
        isAutoDetected: boolean
        calledFunctions: Set<string>
        functions: {
          contractAddress: string
          contractName: string
          functionName: string
          viewOnlyPath: boolean
        }[]
      }
    >()

    for (const [contractAddr, contractFuncs] of Object.entries(
      functionAnalysis.contracts,
    )) {
      for (const [funcName, analysis] of Object.entries(contractFuncs)) {
        for (const dep of analysis.dependencies.entries) {
          const key = dep.contractAddress.toLowerCase()
          let existing = depMap.get(key)
          if (!existing) {
            existing = {
              address: dep.contractAddress,
              name: dep.contractName,
              entity: dep.entity,
              isAutoDetected: dep.isAutoDetected,
              calledFunctions: new Set(dep.calledFunctions),
              functions: [],
            }
            depMap.set(key, existing)
          }
          // Merge: auto-detected if ANY path is auto
          if (dep.isAutoDetected) existing.isAutoDetected = true
          // Keep entity if first entry was undefined but a later one has a value
          if (!existing.entity && dep.entity) existing.entity = dep.entity
          for (const cf of dep.calledFunctions) existing.calledFunctions.add(cf)
          // Add caller function (deduplicate)
          const alreadyAdded = existing.functions.some(
            (f) =>
              f.contractAddress.toLowerCase() === contractAddr.toLowerCase() &&
              f.functionName === funcName,
          )
          if (!alreadyAdded) {
            existing.functions.push({
              contractAddress: contractAddr,
              contractName:
                contractNameMap.get(contractAddr.toLowerCase()) ??
                'Unknown Contract',
              functionName: funcName,
              viewOnlyPath: dep.viewOnlyPath,
            })
          }
        }
      }
    }

    // Build final CompiledDependency[] with review-config descriptions
    const dependencies: CompiledDependency[] = []
    for (const dep of depMap.values()) {
      const desc =
        reviewConfig.dependencies[dep.address] ??
        reviewConfig.dependencies[dep.address.toLowerCase()]

      dependencies.push({
        address: dep.address,
        name: desc?.name ?? dep.name,
        description: desc?.description ?? '',
        entity: dep.entity ?? null,
        isAutoDetected: dep.isAutoDetected,
        viewOnlyPath:
          dep.functions.length > 0 &&
          dep.functions.every((f) => f.viewOnlyPath),
        calledFunctions: Array.from(dep.calledFunctions),
        functions: dep.functions,
      })
    }

    // Build fund holders from funds data + review config descriptions
    const funds: CompiledFundHolder[] = []
    for (const [address, desc] of Object.entries(reviewConfig.funds ?? {})) {
      const contractFunds = fundsLookup.get(
        address.replace(/^eth:/i, '').toLowerCase(),
      )

      funds.push({
        address,
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
      })
    }

    // Build functions from v2 scoring breakdown
    const functions: CompiledFunction[] = []
    if (v2Score.inventory.functions.breakdown) {
      for (const func of v2Score.inventory.functions.breakdown) {
        functions.push({
          contractAddress: func.contractAddress,
          contractName: func.contractName,
          functionName: func.functionName,
          impact: func.impact,
        })
      }
    }

    // Build contracts list (stub — uses tag data)
    const contracts: CompiledContract[] = []
    for (const tag of contractTags.tags ?? []) {
      contracts.push({
        address: tag.contractAddress,
        name: tag.contractAddress, // Name resolved from discovery if available
        isExternal: tag.isExternal ?? false,
        isGovernance: tag.isGovernance ?? false,
        entity: tag.entity ?? null,
        proxyType: null,
      })
    }

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
        contractCount: v2Score.inventory.contracts.inventory,
        permissionedFunctionCount: v2Score.inventory.functions.inventory,
        scoredFunctionCount: v2Score.inventory.functions.breakdown?.length ?? 0,
        adminCount: v2Score.inventory.admins.inventory,
        dependencyCount: v2Score.inventory.dependencies.inventory,
        totalCapitalAtRisk: v2Score.inventory.admins.totalCapitalAtRisk ?? 0,
        totalTokenValueAtRisk:
          v2Score.inventory.admins.totalTokenValueAtRisk ?? 0,
      },

      admins,
      dependencies,
      funds,
      functions,
      contracts,
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
    sources: { v2Score: V2ScoreResult; fundsData: ApiFundsDataResponse },
  ): void {
    if (!dataKeys || Object.keys(dataKeys).length === 0) return

    // Build resolved values map
    const resolved = new Map<string, string>()
    for (const [varName, dataPath] of Object.entries(dataKeys)) {
      const value = this.resolveDataPath(dataPath, sources)
      resolved.set(varName, value !== null ? formatUsdValue(value) : '(N/A)')
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
    sources: { v2Score: V2ScoreResult; fundsData: ApiFundsDataResponse },
  ): number | null {
    try {
      let root: any
      let remainingPath: string

      if (dataPath.startsWith('v2score.')) {
        root = { inventory: sources.v2Score.inventory }
        remainingPath = dataPath.slice('v2score.'.length)

        // Special handling: admin breakdown is an array, dataKeys reference by address
        // e.g., v2score.inventory.admins.breakdown["eth:0x..."].totalDirectCapital
        if (remainingPath.includes('breakdown[')) {
          return this.resolveBreakdownPath(root, remainingPath)
        }
      } else if (dataPath.startsWith('fundsdata.')) {
        root = sources.fundsData
        remainingPath = dataPath.slice('fundsdata.'.length)
      } else {
        return null
      }

      return this.navigatePath(root, remainingPath)
    } catch {
      return null
    }
  }

  private resolveBreakdownPath(root: any, pathStr: string): number | null {
    // Parse: inventory.admins.breakdown["eth:0x..."].totalDirectCapital
    const match = pathStr.match(
      /inventory\.admins\.breakdown\["([^"]+)"\]\.(\w+)/,
    )
    if (!match) return null

    const [, address, field] = match
    const breakdown = root.inventory?.admins?.breakdown
    if (!Array.isArray(breakdown)) return null

    const admin = breakdown.find(
      (a: any) => a.adminAddress?.toLowerCase() === address.toLowerCase(),
    )
    if (!admin) return null

    const value = admin[field]
    return typeof value === 'number' ? value : null
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
