import type { DiscoveryPaths } from '@l2beat/discovery'
import {
  buildExternalAddressSet,
  buildTagsByAddress,
  findTag,
  getCallGraphContractName,
  getCallGraphData,
  isExternalAddress,
  traverseWithPaths,
} from './callGraph'
import { getContractTags } from './contractTags'
import { getFunctions } from './functions'
import { getFundsData } from './fundsData'
import type {
  ApiCallGraphResponse,
  ApiFunctionAnalysisResponse,
  ApiFunctionsResponse,
  ApiFundsDataResponse,
  ContractTag,
  FunctionAnalysis,
  FunctionDependencyEntry,
  FunctionImpactEntry,
} from './types'

/**
 * Compute per-function impact and dependency analysis for a project.
 *
 * - Impact (permissioned functions only): reachable contracts with funds
 * - Dependencies (all functions): auto-detected external + manual
 */
export function computeFunctionAnalysis(
  paths: DiscoveryPaths,
  projectName: string,
): ApiFunctionAnalysisResponse {
  const functionsData = getFunctions(paths, projectName)
  const callGraphData = getCallGraphData(paths, projectName)
  const fundsData = getFundsData(paths, projectName)
  const contractTagsData = getContractTags(paths, projectName)

  // Build lookup maps
  const externalAddresses = buildExternalAddressSet(contractTagsData.tags)
  const tagsByAddress = buildTagsByAddress(contractTagsData.tags)

  const contracts: Record<string, Record<string, FunctionAnalysis>> = {}

  if (!functionsData.contracts) {
    return {
      version: '1.0',
      lastModified: new Date().toISOString(),
      contracts: {},
    }
  }

  for (const [contractAddress, contractData] of Object.entries(
    functionsData.contracts,
  )) {
    for (const func of contractData.functions) {
      // Run call graph traversal with path tracking
      const traversalResult = traverseWithPaths(
        callGraphData,
        contractAddress,
        func.functionName,
      )

      // --- Impact (permissioned functions only) ---
      let impact: FunctionAnalysis['impact'] = null
      if (func.isPermissioned) {
        impact = computeImpact(
          contractAddress,
          traversalResult,
          fundsData,
          functionsData,
        )
      }

      // --- Dependencies (all functions) ---
      const dependencies = computeDependencies(
        func.dependencies,
        contractAddress,
        traversalResult,
        externalAddresses,
        tagsByAddress,
        callGraphData,
      )

      // Only include functions that have impact data or dependencies
      if (impact !== null || dependencies.entries.length > 0) {
        if (!contracts[contractAddress]) {
          contracts[contractAddress] = {}
        }
        contracts[contractAddress][func.functionName] = {
          impact,
          dependencies,
        }
      }
    }
  }

  return {
    version: '1.0',
    lastModified: new Date().toISOString(),
    contracts,
  }
}

// ============================================================================
// Impact Computation
// ============================================================================

function computeImpact(
  startContractAddress: string,
  traversalResult: ReturnType<typeof traverseWithPaths>,
  fundsData: ApiFundsDataResponse,
  functionsData: ApiFunctionsResponse,
): FunctionAnalysis['impact'] {
  const reachableContracts: FunctionImpactEntry[] = []

  for (const [addr, data] of traversalResult.reachableContracts) {
    // Skip self-reference
    if (addr.toLowerCase() === startContractAddress.toLowerCase()) continue

    const fundsUsd = getContractFunds(fundsData, addr)
    const tokenValueUsd = getContractTokenValue(fundsData, addr)

    // Only include contracts with funds or token value
    if (fundsUsd <= 0 && tokenValueUsd <= 0) continue

    const calledFunctions = Array.from(data.calledFunctions)
    const permissionedFunctions = calledFunctions.filter((fn) =>
      isFunctionPermissioned(functionsData, addr, fn),
    )

    reachableContracts.push({
      contractAddress: addr,
      contractName: data.contractName ?? 'Unknown',
      viewOnlyPath: data.viewOnlyPath,
      calledFunctions,
      permissionedFunctions,
      fundsUsd,
      tokenValueUsd,
      callPath: data.shortestPath,
    })
  }

  // Also check direct contract funds
  const directFunds = getContractFunds(fundsData, startContractAddress)
  const directTokenValue = getContractTokenValue(
    fundsData,
    startContractAddress,
  )

  // Sort by total value descending
  reachableContracts.sort(
    (a, b) => b.fundsUsd + b.tokenValueUsd - (a.fundsUsd + a.tokenValueUsd),
  )

  const totalFundsAtRisk =
    directFunds + reachableContracts.reduce((sum, c) => sum + c.fundsUsd, 0)
  const totalTokenValueAtRisk =
    directTokenValue +
    reachableContracts.reduce((sum, c) => sum + c.tokenValueUsd, 0)

  return {
    reachableContracts,
    totalFundsAtRisk,
    totalTokenValueAtRisk,
    unresolvedCallsCount: traversalResult.unresolvedCalls.length,
  }
}

// ============================================================================
// Dependencies Computation
// ============================================================================

function computeDependencies(
  manualDeps: { contractAddress: string }[] | undefined,
  startContractAddress: string,
  traversalResult: ReturnType<typeof traverseWithPaths>,
  externalAddresses: Set<string>,
  tagsByAddress: Map<string, ContractTag>,
  callGraphData: ApiCallGraphResponse,
): { entries: FunctionDependencyEntry[] } {
  const entries: FunctionDependencyEntry[] = []
  const seenAddresses = new Set<string>()

  // 1. Auto-detected: external contracts reachable via call graph
  for (const [addr, data] of traversalResult.reachableContracts) {
    // Skip self-reference
    if (addr.toLowerCase() === startContractAddress.toLowerCase()) continue

    // Only include external contracts
    if (!isExternalAddress(addr, externalAddresses)) continue

    const normalized = addr.toLowerCase()
    if (seenAddresses.has(normalized)) continue
    seenAddresses.add(normalized)

    const tag = findTag(tagsByAddress, addr)
    const contractName =
      data.contractName ??
      getCallGraphContractName(callGraphData, addr) ??
      'Unknown'

    entries.push({
      contractAddress: addr,
      contractName,
      isAutoDetected: true,
      viewOnlyPath: data.viewOnlyPath,
      calledFunctions: Array.from(data.calledFunctions),
      entity: tag?.entity,
      mitigations: undefined,
      callPath: data.shortestPath,
    })
  }

  // 2. Manual dependencies (from functions.json)
  if (manualDeps) {
    for (const dep of manualDeps) {
      const normalized = dep.contractAddress.toLowerCase()
      if (seenAddresses.has(normalized)) continue
      seenAddresses.add(normalized)

      const tag = findTag(tagsByAddress, dep.contractAddress)

      entries.push({
        contractAddress: dep.contractAddress,
        contractName:
          getCallGraphContractName(callGraphData, dep.contractAddress) ??
          'Unknown',
        isAutoDetected: false,
        viewOnlyPath: false,
        calledFunctions: [],
        entity: tag?.entity,
        mitigations: undefined,
        callPath: [], // No path info for manual deps
      })
    }
  }

  return { entries }
}

// ============================================================================
// Helpers (specific to function analysis)
// ============================================================================

function getContractFunds(
  fundsData: ApiFundsDataResponse,
  contractAddress: string,
): number {
  if (!fundsData?.contracts) return 0
  const normalizedAddress = contractAddress.toLowerCase()
  const fundsEntry = Object.entries(fundsData.contracts).find(
    ([key]) => key.toLowerCase() === normalizedAddress,
  )
  if (!fundsEntry) return 0
  const funds = fundsEntry[1]
  return (
    (funds.balances?.totalUsdValue ?? 0) + (funds.positions?.totalUsdValue ?? 0)
  )
}

function getContractTokenValue(
  fundsData: ApiFundsDataResponse,
  contractAddress: string,
): number {
  if (!fundsData?.contracts) return 0
  const normalizedAddress = contractAddress.toLowerCase()
  const fundsEntry = Object.entries(fundsData.contracts).find(
    ([key]) => key.toLowerCase() === normalizedAddress,
  )
  if (!fundsEntry) return 0
  return fundsEntry[1].tokenInfo?.tokenValue ?? 0
}

function isFunctionPermissioned(
  functionsData: ApiFunctionsResponse,
  contractAddress: string,
  functionName: string,
): boolean {
  if (!functionsData.contracts) return false
  const normalizedAddress = contractAddress.toLowerCase()
  const contractEntry = Object.entries(functionsData.contracts).find(
    ([key]) => key.toLowerCase() === normalizedAddress,
  )
  if (!contractEntry) return false
  const func = contractEntry[1].functions.find(
    (f) => f.functionName === functionName,
  )
  return func?.isPermissioned === true
}
