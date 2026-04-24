import type { DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import {
  addressesEqual,
  buildProxyToImplsMap,
  normalizeChainAddress,
} from './addressUtils'
import {
  buildExternalAddressSet,
  buildTagsByAddress,
  findContractGraph,
  findTag,
  getCallGraphContractName,
  getCallGraphData,
  isExternalAddress,
  traverseWithPaths,
} from './callGraph'
import { getContractTags } from './contractTags'
import {
  extractAddressesFromResolvedOwners,
  getFunctions,
  resolveOwnersWithDataAccess,
} from './functions'
import { getFundsData } from './fundsData'
import { DiscoveredDataAccess, resolvePathExpression } from './ownerResolution'
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
  FunctionDependencyRef,
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
 * Build the set of all write functions per contract from parsed discovered.json.
 * For each contract entry, finds the corresponding ABI (using the contract's
 * own address, plus implementation addresses for proxies) and extracts write functions.
 *
 * Returns Record<contractAddress, Set<functionName>>.
 */
function buildWriteFunctionsFromParsed(
  discovered: any,
): Record<string, Set<string>> {
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
      abiAddresses.push(...implValue.filter((v: any) => typeof v === 'string'))
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
}

/**
 * Build a name lookup from discovered.json entries.
 * Returns Map<normalizedAddress, contractName>.
 */
function buildContractNameMap(discovered: any): Map<string, string> {
  const nameMap = new Map<string, string>()
  for (const entry of discovered.entries ?? []) {
    if (entry.address && entry.name) {
      nameMap.set(normalizeChainAddress(entry.address), entry.name)
    }
  }
  return nameMap
}

interface WriteDependencyInfo {
  address: string
  name: string
  entity?: string
}

/**
 * Build a lookup of external permission-owners for each permissioned function.
 * Returns Map<"normalizedAddr:functionName", WriteDependencyInfo[]>.
 */
function buildWriteDependencyLookup(
  functionsData: ApiFunctionsResponse,
  dataAccess: DiscoveredDataAccess,
  externalAddresses: Set<string>,
  tagsByAddress: Map<string, ContractTag>,
  contractNameMap: Map<string, string>,
): Map<string, WriteDependencyInfo[]> {
  const lookup = new Map<string, WriteDependencyInfo[]>()
  if (!functionsData.contracts) return lookup

  // Cache: ownerDefinitions JSON → resolved external addresses
  const resolutionCache = new Map<string, WriteDependencyInfo[]>()

  for (const [contractAddr, contractData] of Object.entries(
    functionsData.contracts,
  )) {
    for (const func of contractData.functions) {
      if (
        !func.isPermissioned ||
        !func.ownerDefinitions ||
        func.ownerDefinitions.length === 0
      ) {
        continue
      }

      // Check cache by ownerDefinitions shape
      const cacheKey = `${normalizeChainAddress(contractAddr)}:${JSON.stringify(func.ownerDefinitions)}`
      let externalOwners = resolutionCache.get(cacheKey)

      if (!externalOwners) {
        const resolved = resolveOwnersWithDataAccess(
          dataAccess,
          contractAddr,
          func.ownerDefinitions,
        )
        const allAddresses = [
          ...new Set(extractAddressesFromResolvedOwners(resolved)),
        ]

        externalOwners = allAddresses
          .filter((addr) => isExternalAddress(addr, externalAddresses))
          .map((addr) => {
            const tag = findTag(tagsByAddress, addr)
            const name =
              contractNameMap.get(normalizeChainAddress(addr)) ?? 'Unknown'
            return { address: addr, name, entity: tag?.entity }
          })

        resolutionCache.set(cacheKey, externalOwners)
      }

      if (externalOwners.length > 0) {
        const key = `${normalizeChainAddress(contractAddr)}:${func.functionName}`
        lookup.set(key, externalOwners)
      }
    }
  }

  return lookup
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

  const contracts: Record<string, Record<string, FunctionAnalysis>> = {}

  // Load discovered.json once for both ABI extraction and owner resolution
  const discoveredPath = path.join(
    paths.discovery,
    projectName,
    'discovered.json',
  )
  let discovered: any
  try {
    discovered = JSON.parse(fs.readFileSync(discoveredPath, 'utf8'))
  } catch {
    return { version: '1.0', lastModified: new Date().toISOString(), contracts }
  }

  // Build shared-impl map so metadata stored at an impl address can also be
  // looked up by each proxy that uses it (Aave AToken pattern, etc.).
  const proxyToImpls = buildProxyToImplsMap(discovered)

  // Build a normalized lookup for functions.json metadata, fanned out across
  // proxies of shared implementations.
  const functionsMetadata = buildFunctionsMetadataLookup(
    functionsData,
    proxyToImpls,
  )

  const writeFunctionsByContract = buildWriteFunctionsFromParsed(discovered)

  // Build write-dependency lookup (external permission-owners per function)
  const dataAccess = new DiscoveredDataAccess(discovered)
  const contractNameMap = buildContractNameMap(discovered)
  const writeDependencyLookup = buildWriteDependencyLookup(
    functionsData,
    dataAccess,
    externalAddresses,
    tagsByAddress,
    contractNameMap,
  )

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

      // Manual dependencies are stored as terminal leaves (see
      // computeDependencies below). On their own they show the declared
      // address but BFS does not continue through them, so transitive
      // reachables (e.g. oracle wrapper → Chronicle aggregator → underlying
      // token) stay invisible. Seed an additional BFS from each resolved
      // manual-dep target (from every caller function on that target) and
      // merge the reachables into the primary traversal, so both
      // /dependencies and /admins reachable-contracts see the full depth.
      augmentTraversalWithManualDepSeeds(
        traversalResult,
        metadata?.dependencies,
        contractAddress,
        functionName,
        dataAccess,
        callGraphData,
      )

      // --- Dependencies (all functions) ---
      const lookupKey = `${normalizeChainAddress(contractAddress)}:${functionName}`
      const writeDeps = writeDependencyLookup.get(lookupKey) ?? []

      const dependencies = computeDependencies(
        metadata?.dependencies,
        contractAddress,
        functionName,
        traversalResult,
        externalAddresses,
        tagsByAddress,
        callGraphData,
        writeDeps,
        dataAccess,
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
        // If researcher marked as no-impact, zero out all funds
        // but keep the reachable contracts structure for informational display
        if (impact && metadata?.score === 'no-impact') {
          impact = {
            ...impact,
            totalFundsAtRisk: 0,
            totalTokenValueAtRisk: 0,
            reachableContracts: [],
          }
        }
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
 *
 * Shared-impl fan-out: when `proxyToImpls` is provided (preferred), entries
 * stored at an impl address used by N proxies are ALSO indexed under each
 * proxy's key so that lookups by proxy address find the metadata. This lets
 * us support one stored entry serving N proxies (the Aave AToken pattern)
 * without duplicating storage.
 */
function buildFunctionsMetadataLookup(
  functionsData: ApiFunctionsResponse,
  proxyToImpls?: Map<string, Set<string>>,
): FunctionsMetadataMap {
  const lookup: FunctionsMetadataMap = new Map()
  if (!functionsData.contracts) return lookup

  // Build the inverse: impl → proxies using it, for fast fan-out.
  const implToProxies = new Map<string, Set<string>>()
  if (proxyToImpls) {
    for (const [proxy, impls] of proxyToImpls) {
      for (const impl of impls) {
        let set = implToProxies.get(impl)
        if (!set) {
          set = new Set()
          implToProxies.set(impl, set)
        }
        set.add(proxy)
      }
    }
  }

  // Two-pass build so per-proxy overrides always win over impl templates
  // regardless of JSON insertion order in functions.json:
  //   Pass 1 — every entry NOT stored at a shared-impl address (proxy-direct,
  //            standalone, unique-impl) writes unconditionally. A per-proxy
  //            override lands here.
  //   Pass 2 — every entry stored at a shared-impl address fans out to
  //            { impl, ...proxies }, but only fills function slots that are
  //            still empty — so a proxy override from pass 1 is preserved.
  //
  // Single-pass with a has() guard was ambiguous: if the impl entry appeared
  // before its proxy override in iteration order, the template populated the
  // proxy slot first and the subsequent override was silently dropped.

  for (const [contractAddress, contractData] of Object.entries(
    functionsData.contracts,
  )) {
    const normalized = normalizeChainAddress(contractAddress)
    if (implToProxies.has(normalized)) continue // pass 2 handles impls
    let funcMap = lookup.get(normalized)
    if (!funcMap) {
      funcMap = new Map()
      lookup.set(normalized, funcMap)
    }
    for (const func of contractData.functions) {
      funcMap.set(func.functionName, func)
    }
  }

  for (const [contractAddress, contractData] of Object.entries(
    functionsData.contracts,
  )) {
    const normalized = normalizeChainAddress(contractAddress)
    const proxies = implToProxies.get(normalized)
    if (!proxies) continue
    // Fan out: index entry under the impl itself AND each proxy using it.
    const targets = new Set<string>([normalized, ...proxies])
    for (const target of targets) {
      let funcMap = lookup.get(target)
      if (!funcMap) {
        funcMap = new Map()
        lookup.set(target, funcMap)
      }
      for (const func of contractData.functions) {
        if (!funcMap.has(func.functionName)) {
          funcMap.set(func.functionName, func)
        }
      }
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

/**
 * Seed BFS from each resolved manual-dep target and merge the reachable
 * contracts back into the primary traversal result. Without this, the
 * dep-target is added as a terminal leaf by computeDependencies and BFS
 * stops there — anything the target itself reaches (e.g. Chronicle aggregator
 * called by an oracle wrapper) never surfaces.
 *
 * Semantics: "if this dep breaks, everything it touches is at risk." Matches
 * the upgrade-function seeding pattern — every caller function on the target
 * is a valid entry point, so BFS seeds with all of them. Each merged
 * reachable inherits `path = depEdge → targetSubPath` for display.
 *
 * Self-merge: the dep target itself is also recorded as reachable (from any
 * `calledFunction` seen on it) so that funds on the target are counted by
 * computeImpact, not only by computeDependencies.
 */
function augmentTraversalWithManualDepSeeds(
  traversalResult: ReturnType<typeof traverseWithPaths>,
  manualDeps: FunctionDependencyRef[] | undefined,
  startContractAddress: string,
  startFunctionName: string,
  dataAccess: DiscoveredDataAccess,
  callGraphData: ApiCallGraphResponse,
): void {
  if (!manualDeps || manualDeps.length === 0) return

  for (const dep of manualDeps) {
    const depAddresses = resolveManualDepAddresses(
      dep,
      startContractAddress,
      dataAccess,
    )

    for (const depAddr of depAddresses) {
      // Skip self-reference — a dep pointing back at the starting contract
      // would double-count paths.
      if (addressesEqual(depAddr, startContractAddress)) continue

      const targetGraph = findContractGraph(callGraphData, depAddr)
      // No call graph entry → target is a leaf (e.g. Chronicle aggregator
      // which Slither couldn't analyse). computeDependencies already emits
      // the leaf in its manual-deps branch, so nothing extra to do.
      if (!targetGraph) continue

      // Every distinct caller function on the target is a valid entry point.
      const callerFns = new Set<string>()
      for (const call of targetGraph.externalCalls) {
        callerFns.add(call.callerFunction)
      }

      // Record the dep target itself as reachable. Use every caller function
      // we found, plus 'latestAnswer' as a default if the call graph has it —
      // this way computeImpact sees the target (for funds accounting) and
      // computeDependencies' auto-detected branch doesn't duplicate it
      // (shortest-path fields set to minimum).
      const existingSelf = traversalResult.reachableContracts.get(depAddr)
      if (!existingSelf) {
        traversalResult.reachableContracts.set(depAddr, {
          contractName: targetGraph.name ?? 'Unknown',
          viewOnlyPath: true, // we treat dep-edges as view by convention
          calledFunctions: new Set(callerFns),
          shortestPath: [
            {
              contractAddress: startContractAddress,
              contractName: '',
              functionName: startFunctionName,
              isViewCall: true,
            },
          ],
        })
      } else {
        for (const fn of callerFns) existingSelf.calledFunctions.add(fn)
      }

      // BFS from every caller function on the dep target and merge.
      for (const fn of callerFns) {
        const sub = traverseWithPaths(callGraphData, depAddr, fn)
        for (const [addr, entry] of sub.reachableContracts) {
          if (addressesEqual(addr, startContractAddress)) continue
          const existing = traversalResult.reachableContracts.get(addr)
          if (!existing) {
            traversalResult.reachableContracts.set(addr, {
              contractName: entry.contractName,
              viewOnlyPath: entry.viewOnlyPath,
              calledFunctions: new Set(entry.calledFunctions),
              shortestPath: entry.shortestPath,
            })
          } else {
            for (const cf of entry.calledFunctions) {
              existing.calledFunctions.add(cf)
            }
            // If any path is non-view, the merged entry is non-view.
            if (!entry.viewOnlyPath) existing.viewOnlyPath = false
          }
        }
      }
    }
  }
}

/**
 * Resolve a manual dependency reference to a concrete address list.
 * - Literal form: pins exactly one address.
 * - Path form: resolves against `currentContractAddress` via the shared path
 *   resolver. Multiple addresses are possible (e.g. arrays); all are returned.
 * Resolution failures are logged and treated as empty so a single bad entry
 * cannot break the rest of the analysis.
 */
function resolveManualDepAddresses(
  dep: FunctionDependencyRef,
  currentContractAddress: string,
  dataAccess: DiscoveredDataAccess,
): string[] {
  if ('contractAddress' in dep) {
    return [dep.contractAddress]
  }
  const resolved = resolvePathExpression(
    dataAccess,
    currentContractAddress,
    dep.path,
  )
  if (resolved.error) {
    console.warn(
      `Failed to resolve dependency path "${dep.path}" on ${currentContractAddress}: ${resolved.error}`,
    )
    return []
  }
  return resolved.addresses
}

/**
 * Read a contract's declared name from discovered.json via the existing
 * data-access helper. Returns undefined if the address isn't a contract in
 * discovered data or has no name. Used as a fallback when the call graph is
 * missing a contract so path-resolved deps still render with a readable name.
 */
function buildContractNameFromDataAccess(
  dataAccess: DiscoveredDataAccess,
  address: string,
): string | undefined {
  try {
    const contract = dataAccess.findContract(address)
    const name = contract?.name
    return typeof name === 'string' && name.length > 0 ? name : undefined
  } catch {
    return undefined
  }
}

function computeDependencies(
  manualDeps: FunctionDependencyRef[] | undefined,
  startContractAddress: string,
  functionName: string,
  traversalResult: ReturnType<typeof traverseWithPaths>,
  externalAddresses: Set<string>,
  tagsByAddress: Map<string, ContractTag>,
  callGraphData: ApiCallGraphResponse,
  writeDeps: WriteDependencyInfo[],
  dataAccess: DiscoveredDataAccess,
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
      dependencyType: 'callgraph',
    })
  }

  // 2. Manual dependencies (from functions.json).
  // Two forms supported:
  //   - { contractAddress } — literal pin
  //   - { path } — path expression resolved against the current proxy so the
  //     dep tracks mutable on-chain state (e.g. oracle registry mapping).
  if (manualDeps) {
    for (const dep of manualDeps) {
      const resolvedAddresses = resolveManualDepAddresses(
        dep,
        startContractAddress,
        dataAccess,
      )

      for (const addr of resolvedAddresses) {
        const normalized = normalizeChainAddress(addr)
        if (seenAddresses.has(normalized)) continue
        seenAddresses.add(normalized)

        const tag = findTag(tagsByAddress, addr)
        const nameFromDiscovered = buildContractNameFromDataAccess(
          dataAccess,
          addr,
        )

        entries.push({
          contractAddress: addr,
          contractName:
            nameFromDiscovered ??
            getCallGraphContractName(callGraphData, addr) ??
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
  }

  // 3. Write-dependencies: external contracts that are permission-owners
  for (const dep of writeDeps) {
    const normalized = normalizeChainAddress(dep.address)
    // Skip if already covered by call-graph or manual deps (richer path info)
    if (seenAddresses.has(normalized)) continue
    seenAddresses.add(normalized)

    entries.push({
      contractAddress: dep.address,
      contractName: dep.name,
      isAutoDetected: true,
      viewOnlyPath: false, // write access by definition
      calledFunctions: [functionName], // the function they own
      entity: dep.entity,
      mitigations: undefined,
      callPath: [], // no code-level path exists
      dependencyType: 'write',
    })
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
