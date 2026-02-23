import type { DiscoveryPaths } from '@l2beat/discovery'
import { getCallGraphData } from './callGraph'
import { getContractTags } from './contractTags'
import { getFunctions } from './functions'
import { getFundsData } from './fundsData'
import type {
  ApiCallGraphResponse,
  ApiFunctionAnalysisResponse,
  ApiFunctionsResponse,
  ApiFundsDataResponse,
  CallPathStep,
  ContractTag,
  ExternalCall,
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
// BFS with Path Tracking
// ============================================================================

interface TraversalEntry {
  contractName?: string
  viewOnlyPath: boolean
  calledFunctions: Set<string>
  /** Shortest path from the start to this contract (BFS guarantees shortest) */
  shortestPath: CallPathStep[]
}

interface TraversalWithPathsResult {
  reachableContracts: Map<string, TraversalEntry>
  unresolvedCalls: {
    storageVariable: string
    interfaceType: string
    calledFunction: string
  }[]
}

/**
 * BFS traversal that tracks the shortest path to each reachable contract.
 * Similar to CallGraphTraverser but also records parent pointers for path reconstruction.
 */
function traverseWithPaths(
  callGraphData: ApiCallGraphResponse,
  startContract: string,
  startFunction: string,
): TraversalWithPathsResult {
  const visited = new Set<string>()
  const reachableContracts = new Map<string, TraversalEntry>()
  const unresolvedCalls: TraversalWithPathsResult['unresolvedCalls'] = []

  const queue: Array<{
    contract: string
    function: string
    pathIsViewOnly: boolean
    /** Path taken to reach this (contract, function) pair */
    path: CallPathStep[]
  }> = [
    {
      contract: startContract,
      function: startFunction,
      pathIsViewOnly: true,
      path: [],
    },
  ]

  while (queue.length > 0) {
    const { contract, function: func, pathIsViewOnly, path } = queue.shift()!

    const visitKey = `${contract.toLowerCase()}:${func}`
    if (visited.has(visitKey)) continue
    visited.add(visitKey)

    // Find call graph for this contract
    const contractGraph = findContractGraph(callGraphData, contract)
    if (!contractGraph) continue

    // Filter calls by caller function
    const functionCalls = contractGraph.externalCalls.filter(
      (call) => call.callerFunction === func,
    )

    for (const call of functionCalls) {
      const isViewCall = call.isViewCall === true || call.callerIsView === true

      if (!call.resolvedAddress) {
        const alreadyTracked = unresolvedCalls.some(
          (u) =>
            u.storageVariable === call.storageVariable &&
            u.calledFunction === call.calledFunction,
        )
        if (!alreadyTracked) {
          unresolvedCalls.push({
            storageVariable: call.storageVariable,
            interfaceType: call.interfaceType,
            calledFunction: call.calledFunction,
          })
        }
        continue
      }

      const newPathIsViewOnly = pathIsViewOnly && isViewCall

      // Build the path to this call's target
      const newPath: CallPathStep[] = [
        ...path,
        {
          contractAddress: contract,
          contractName: contractGraph.name ?? 'Unknown',
          functionName: func,
          isViewCall,
        },
      ]

      // Update reachable contracts
      const existingEntry = reachableContracts.get(call.resolvedAddress)
      if (existingEntry) {
        if (!newPathIsViewOnly) {
          existingEntry.viewOnlyPath = false
        }
        existingEntry.calledFunctions.add(call.calledFunction)
        // Keep shortest path (BFS guarantees first visit is shortest)
      } else {
        reachableContracts.set(call.resolvedAddress, {
          contractName: call.resolvedContractName,
          viewOnlyPath: newPathIsViewOnly,
          calledFunctions: new Set([call.calledFunction]),
          shortestPath: newPath,
        })
      }

      // Queue the called function for further traversal
      queue.push({
        contract: call.resolvedAddress,
        function: call.calledFunction,
        pathIsViewOnly: newPathIsViewOnly,
        path: newPath,
      })
    }
  }

  return { reachableContracts, unresolvedCalls }
}

/** Find contract graph with case-insensitive lookup */
function findContractGraph(
  callGraphData: ApiCallGraphResponse,
  contract: string,
) {
  const direct = callGraphData.contracts[contract]
  if (direct) return direct
  const entry = Object.entries(callGraphData.contracts).find(
    ([addr]) => addr.toLowerCase() === contract.toLowerCase(),
  )
  return entry ? entry[1] : undefined
}

// ============================================================================
// Impact Computation
// ============================================================================

function computeImpact(
  startContractAddress: string,
  traversalResult: TraversalWithPathsResult,
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
  traversalResult: TraversalWithPathsResult,
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
      centralization: tag?.centralization,
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
        centralization: tag?.centralization,
        mitigations: undefined,
        callPath: [], // No path info for manual deps
      })
    }
  }

  return { entries }
}

// ============================================================================
// Helpers
// ============================================================================

function buildExternalAddressSet(tags: ContractTag[]): Set<string> {
  const set = new Set<string>()
  for (const tag of tags) {
    if (tag.isExternal) {
      set.add(tag.contractAddress.toLowerCase())
    }
  }
  return set
}

function buildTagsByAddress(tags: ContractTag[]): Map<string, ContractTag> {
  const map = new Map<string, ContractTag>()
  for (const tag of tags) {
    map.set(tag.contractAddress.toLowerCase(), tag)
  }
  return map
}

function isExternalAddress(
  address: string,
  externalAddresses: Set<string>,
): boolean {
  const normalized = address.toLowerCase()
  if (externalAddresses.has(normalized)) return true
  if (externalAddresses.has(normalized.replace('eth:', ''))) return true
  if (externalAddresses.has(`eth:${normalized}`)) return true
  return false
}

function findTag(
  tagsByAddress: Map<string, ContractTag>,
  address: string,
): ContractTag | undefined {
  const normalized = address.toLowerCase()
  return (
    tagsByAddress.get(normalized) ??
    tagsByAddress.get(normalized.replace('eth:', '')) ??
    tagsByAddress.get(`eth:${normalized}`)
  )
}

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

function getCallGraphContractName(
  callGraphData: ApiCallGraphResponse,
  address: string,
): string | undefined {
  const normalizedAddress = address.toLowerCase()
  const entry = Object.entries(callGraphData.contracts).find(
    ([key]) => key.toLowerCase() === normalizedAddress,
  )
  return entry?.[1]?.name
}
