import type { DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import { addressesEqual, normalizeChainAddress } from './addressUtils'
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
  ApiContractTagsResponse,
  ApiFunctionAnalysisResponse,
  ApiFunctionsResponse,
  ApiFundsDataResponse,
  ContractFundsData,
  ContractTag,
  FunctionAnalysis,
  FunctionDependencyEntry,
  FunctionEntry,
  FunctionImpactEntry,
} from './types'

// ============================================================================
// ABI Write Function Extraction
// ============================================================================

const READ_MARKERS = [' view ', ' pure ']
const FUNCTION_NAME_REGEX = /^function\s+(\w+)\s*\(/

/**
 * Extract all write function names from an ABI entry list.
 * Mirrors the frontend logic in PermissionsDisplay.tsx: filters out
 * events, errors, and functions containing ' view ' or ' pure '.
 */
function extractWriteFunctionNames(abiEntries: string[]): string[] {
  const names: string[] = []
  for (const entry of abiEntries) {
    // Skip non-function entries (events, errors, constructors)
    if (
      entry.startsWith('event') ||
      entry.startsWith('error') ||
      entry.startsWith('constructor')
    ) {
      continue
    }
    // Skip view/pure functions
    if (READ_MARKERS.some((marker) => entry.includes(marker))) continue
    // Extract function name
    const match = entry.match(FUNCTION_NAME_REGEX)
    if (match?.[1]) {
      names.push(match[1])
    }
  }
  return names
}

/**
 * Build the set of all write functions per contract from discovered.json ABIs.
 * For each contract entry, finds the corresponding ABI (using the contract's
 * own address, plus implementation addresses for proxies) and extracts write functions.
 *
 * Returns Record<contractAddress, Set<functionName>>.
 */
function buildWriteFunctionsFromAbis(
  discoveredPath: string,
): Record<string, Set<string>> {
  if (!fs.existsSync(discoveredPath)) {
    return {}
  }

  try {
    const fileContent = fs.readFileSync(discoveredPath, 'utf8')
    const discovered = JSON.parse(fileContent)

    const abis: Record<string, string[]> = discovered.abis ?? {}
    const entries: any[] = discovered.entries ?? []
    const result: Record<string, Set<string>> = {}

    for (const entry of entries) {
      if (entry.type !== 'Contract') continue

      const contractAddress: string = entry.address
      const functionNames = new Set<string>()

      // Collect ABI addresses: the contract itself + any implementations
      const abiAddresses: string[] = [contractAddress]
      const implValue = entry.values?.$implementation
      if (typeof implValue === 'string') {
        abiAddresses.push(implValue)
      } else if (Array.isArray(implValue)) {
        abiAddresses.push(
          ...implValue.filter((v: any) => typeof v === 'string'),
        )
      }

      // Extract write functions from each ABI
      for (const abiAddr of abiAddresses) {
        const abiEntries = abis[abiAddr]
        if (!abiEntries) continue
        for (const name of extractWriteFunctionNames(abiEntries)) {
          functionNames.add(name)
        }
      }

      if (functionNames.size > 0) {
        result[contractAddress] = functionNames
      }
    }

    return result
  } catch (error) {
    console.error('Error reading discovered.json for ABI extraction:', error)
    return {}
  }
}

// ============================================================================
// Main Analysis
// ============================================================================

/**
 * Pre-loaded data that can be passed to avoid redundant file I/O.
 * When provided, `computeFunctionAnalysis` skips loading these from disk.
 */
export interface FunctionAnalysisPreloadedData {
  functionsData?: ApiFunctionsResponse
  callGraphData?: ApiCallGraphResponse
  fundsData?: ApiFundsDataResponse
  contractTagsData?: ApiContractTagsResponse
}

/**
 * Compute per-function impact and dependency analysis for a project.
 *
 * Iterates over ALL write functions from discovered.json ABIs (same set shown
 * in the UI's permissions section). functions.json provides metadata overlay
 * (isPermissioned, manual dependencies, scores, etc.).
 *
 * - Impact (permissioned functions or functions with dependencies): reachable contracts with funds
 * - Dependencies (all functions): auto-detected external + manual
 */
export function computeFunctionAnalysis(
  paths: DiscoveryPaths,
  projectName: string,
  preloaded?: FunctionAnalysisPreloadedData,
): ApiFunctionAnalysisResponse {
  const functionsData =
    preloaded?.functionsData ?? getFunctions(paths, projectName)
  const callGraphData =
    preloaded?.callGraphData ?? getCallGraphData(paths, projectName)
  const fundsData = preloaded?.fundsData ?? getFundsData(paths, projectName)
  const contractTagsData =
    preloaded?.contractTagsData ?? getContractTags(paths, projectName)

  // Build lookup maps
  const externalAddresses = buildExternalAddressSet(contractTagsData.tags)
  const tagsByAddress = buildTagsByAddress(contractTagsData.tags)

  // Build normalized funds lookup for O(1) access
  const fundsLookup = buildFundsLookup(fundsData)

  // Build a normalized lookup for functions.json metadata
  const functionsMetadata = buildFunctionsMetadataLookup(functionsData)

  const contracts: Record<string, Record<string, FunctionAnalysis>> = {}

  // Build the canonical set of write functions from ABIs
  const discoveredPath = path.join(
    paths.discovery,
    projectName,
    'discovered.json',
  )
  const writeFunctionsByContract = buildWriteFunctionsFromAbis(discoveredPath)

  // Iterate over all write functions from ABIs
  for (const [contractAddress, functionNames] of Object.entries(
    writeFunctionsByContract,
  )) {
    for (const functionName of functionNames) {
      // Look up metadata from functions.json (if any)
      const metadata = lookupFunctionMetadata(
        functionsMetadata,
        contractAddress,
        functionName,
      )

      // Run call graph traversal with path tracking
      const traversalResult = traverseWithPaths(
        callGraphData,
        contractAddress,
        functionName,
      )

      // --- Dependencies (all functions) ---
      const dependencies = computeDependencies(
        metadata?.dependencies,
        contractAddress,
        traversalResult,
        externalAddresses,
        tagsByAddress,
        callGraphData,
      )

      // --- Impact (permissioned functions OR functions with dependencies) ---
      let impact: FunctionAnalysis['impact'] = null
      if (metadata?.isPermissioned || dependencies.entries.length > 0) {
        impact = computeImpact(
          contractAddress,
          traversalResult,
          fundsLookup,
          functionsMetadata,
        )
      }

      // Only include functions that have impact data or dependencies
      if (impact !== null || dependencies.entries.length > 0) {
        if (!contracts[contractAddress]) {
          contracts[contractAddress] = {}
        }
        contracts[contractAddress][functionName] = {
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
// Functions.json Metadata Lookup
// ============================================================================

type FunctionsMetadataMap = Map<string, Map<string, FunctionEntry>>

/**
 * Build a normalized lookup: contractAddress -> functionName -> FunctionEntry
 */
function buildFunctionsMetadataLookup(
  functionsData: ApiFunctionsResponse,
): FunctionsMetadataMap {
  const lookup: FunctionsMetadataMap = new Map()
  if (!functionsData.contracts) return lookup

  for (const [contractAddress, contractData] of Object.entries(
    functionsData.contracts,
  )) {
    const normalized = normalizeChainAddress(contractAddress)
    let funcMap = lookup.get(normalized)
    if (!funcMap) {
      funcMap = new Map()
      lookup.set(normalized, funcMap)
    }
    for (const func of contractData.functions) {
      funcMap.set(func.functionName, func)
    }
  }
  return lookup
}

/**
 * Look up function metadata from functions.json by contract address and function name.
 */
function lookupFunctionMetadata(
  metadata: FunctionsMetadataMap,
  contractAddress: string,
  functionName: string,
): FunctionEntry | undefined {
  const normalized = normalizeChainAddress(contractAddress)
  return metadata.get(normalized)?.get(functionName)
}

// ============================================================================
// Impact Computation
// ============================================================================

type FundsLookup = Map<string, ContractFundsData>

function computeImpact(
  startContractAddress: string,
  traversalResult: ReturnType<typeof traverseWithPaths>,
  fundsLookup: FundsLookup,
  functionsMetadata: FunctionsMetadataMap,
): FunctionAnalysis['impact'] {
  const reachableContracts: FunctionImpactEntry[] = []

  for (const [addr, data] of traversalResult.reachableContracts) {
    // Skip self-reference
    if (addressesEqual(addr, startContractAddress)) continue

    const fundsUsd = getFundsFromLookup(fundsLookup, addr)
    const tokenValueUsd = getTokenValueFromLookup(fundsLookup, addr)

    // Only include contracts with funds or token value
    if (fundsUsd <= 0 && tokenValueUsd <= 0) continue

    const calledFunctions = Array.from(data.calledFunctions)
    const permissionedFunctions = calledFunctions.filter((fn) => {
      const meta = lookupFunctionMetadata(functionsMetadata, addr, fn)
      return meta?.isPermissioned === true
    })

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
  const directFunds = getFundsFromLookup(fundsLookup, startContractAddress)
  const directTokenValue = getTokenValueFromLookup(
    fundsLookup,
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
    if (addressesEqual(addr, startContractAddress)) continue

    // Only include external contracts
    if (!isExternalAddress(addr, externalAddresses)) continue

    const normalized = normalizeChainAddress(addr)
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
      const normalized = normalizeChainAddress(dep.contractAddress)
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
// Funds Lookup Helpers (O(1) access via pre-built normalized map)
// ============================================================================

function buildFundsLookup(fundsData: ApiFundsDataResponse): FundsLookup {
  const lookup: FundsLookup = new Map()
  for (const [addr, data] of Object.entries(fundsData.contracts ?? {})) {
    lookup.set(normalizeChainAddress(addr), data)
  }
  return lookup
}

function getFundsFromLookup(
  fundsLookup: FundsLookup,
  contractAddress: string,
): number {
  const data = fundsLookup.get(normalizeChainAddress(contractAddress))
  if (!data) return 0
  return (
    (data.balances?.totalUsdValue ?? 0) + (data.positions?.totalUsdValue ?? 0)
  )
}

function getTokenValueFromLookup(
  fundsLookup: FundsLookup,
  contractAddress: string,
): number {
  const data = fundsLookup.get(normalizeChainAddress(contractAddress))
  if (!data) return 0
  return data.tokenInfo?.tokenValue ?? 0
}
