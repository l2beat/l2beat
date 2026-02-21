import type {
  ConfigReader,
  DiscoveryPaths,
  TemplateService,
} from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import { getProject } from '../getProject'
import { getCallGraphData } from './callGraph'
import {
  extractAddressesFromResolvedOwners,
  getFunctions,
  resolveOwnersWithDataAccess,
} from './functions'
import { DiscoveredDataAccess } from './ownerResolution'
import type {
  ApiAddressType,
  ApiCallGraphResponse,
  ApiEnhancedTraversalResponse,
  ApiFunctionsResponse,
  FunctionTraversalResult,
  OwnershipChainStep,
  TraversalTerminal,
} from './types'

const MAX_DEPTH = 10

// ============================================================================
// Enhanced Graph Types
// ============================================================================

/**
 * A single edge in the enhanced graph. Edges stay in their natural direction:
 * - Call graph: caller → callee
 * - Permission: owner → owned function
 */
interface EnhancedEdge {
  /** Caller contract (call graph) or owner contract (permission) */
  sourceContract: string
  /** Specific function on source (call graph only, undefined for permission) */
  sourceFunction?: string
  /** Callee contract (call graph) or owned function's contract (permission) */
  targetContract: string
  /** Function being called (call graph) or owned (permission) */
  targetFunction: string
  edgeType: 'permission' | 'callgraph'
  isViewCall?: boolean
}

/**
 * The enhanced graph with bidirectional indices built from the same edge set.
 * - Forward index: "what does this contract call/own?"
 * - Backward index: "who calls/owns functions on this contract?"
 */
interface EnhancedGraph {
  forwardIndex: Map<string, EnhancedEdge[]>
  backwardIndex: Map<string, EnhancedEdge[]>
}

// ============================================================================
// Graph Construction
// ============================================================================

/**
 * Build the enhanced graph from call graph data and permission data.
 * Edges stay in natural direction (caller→callee, owner→function).
 * Permission resolution happens here upfront (single pass over discovered.json).
 */
function buildEnhancedGraph(
  callGraphData: ApiCallGraphResponse,
  functionsData: ApiFunctionsResponse,
  dataAccess: DiscoveredDataAccess,
): { edges: EnhancedEdge[]; constructionErrors: Map<string, string[]> } {
  const edges: EnhancedEdge[] = []
  const constructionErrors = new Map<string, string[]>()

  // 1. Call graph edges (natural direction: caller → callee)
  for (const [, graph] of Object.entries(callGraphData.contracts)) {
    for (const call of graph.externalCalls) {
      if (!call.resolvedAddress) continue

      edges.push({
        sourceContract: graph.address,
        sourceFunction: call.callerFunction,
        targetContract: call.resolvedAddress,
        targetFunction: call.calledFunction,
        edgeType: 'callgraph',
        isViewCall: call.isViewCall === true,
      })
    }
  }

  // 2. Permission edges (natural direction: owner → owned function)
  if (functionsData.contracts) {
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

        const resolved = resolveOwnersWithDataAccess(
          dataAccess,
          contractAddr,
          func.ownerDefinitions,
        )

        // Track resolution errors
        const errors: string[] = []
        for (const r of resolved) {
          if (!r.isResolved && r.error) {
            errors.push(r.error)
          }
        }
        if (errors.length > 0) {
          const key = `${contractAddr.toLowerCase()}:${func.functionName}`
          constructionErrors.set(key, errors)
        }

        // Create permission edges for each unique owner address
        const ownerAddresses = [
          ...new Set(extractAddressesFromResolvedOwners(resolved)),
        ]
        for (const ownerAddr of ownerAddresses) {
          edges.push({
            sourceContract: ownerAddr,
            // sourceFunction: undefined — permission edges are contract-level
            targetContract: contractAddr,
            targetFunction: func.functionName,
            edgeType: 'permission',
          })
        }
      }
    }
  }

  return { edges, constructionErrors }
}

/**
 * Build both forward and backward indices from the same edge array.
 */
function buildIndices(edges: EnhancedEdge[]): EnhancedGraph {
  const forwardIndex = new Map<string, EnhancedEdge[]>()
  const backwardIndex = new Map<string, EnhancedEdge[]>()

  for (const edge of edges) {
    const fwdKey = edge.sourceContract.toLowerCase()
    let fwdList = forwardIndex.get(fwdKey)
    if (!fwdList) {
      fwdList = []
      forwardIndex.set(fwdKey, fwdList)
    }
    fwdList.push(edge)

    const bwdKey = edge.targetContract.toLowerCase()
    let bwdList = backwardIndex.get(bwdKey)
    if (!bwdList) {
      bwdList = []
      backwardIndex.set(bwdKey, bwdList)
    }
    bwdList.push(edge)
  }

  return { forwardIndex, backwardIndex }
}

// ============================================================================
// Terminal Type Check
// ============================================================================

/** Returns true if this address type is a terminal node (end of chain). */
function isTerminalType(type: ApiAddressType): boolean {
  return type === 'EOA' || type === 'EOAPermissioned' || type === 'Multisig'
}

// ============================================================================
// Traversal Context & Result
// ============================================================================

interface TraversalContext {
  functionsData: ApiFunctionsResponse
  graph: EnhancedGraph
  contractNameMap: Map<string, string>
  contractTypeMap: Map<string, ApiAddressType>
  implToProxyMap: Map<string, string>
  proxyToImplsMap: Map<string, string[]>
  constructionErrors: Map<string, string[]>
  memo: Map<string, TraversalResult>
}

interface TraversalResult {
  terminals: TraversalTerminal[]
  errors: string[]
  depthLimitReached: boolean
}

// ============================================================================
// DFS on Backward Index
// ============================================================================

/**
 * Traverse the enhanced graph backward from a (contract, function) pair
 * to find terminal entities (EOAs, Multisigs) that control the function.
 *
 * @param functionName - specific function to trace, or null = all functions on contract
 */
function traverse(
  ctx: TraversalContext,
  contractAddress: string,
  functionName: string | null,
  visited: Set<string>,
  chain: OwnershipChainStep[],
  depth: number,
  hasPublicFunctionInChain: boolean,
): TraversalResult {
  if (depth > MAX_DEPTH) {
    return { terminals: [], errors: [], depthLimitReached: true }
  }

  const visitKey = `${contractAddress.toLowerCase()}:${functionName ?? '*'}`

  // Check memoization cache FIRST — reuse previous results with adjusted chain prefix.
  // Safe because cached results are fully computed (no risk of infinite loop).
  const cached = ctx.memo.get(visitKey)
  if (cached) {
    return {
      terminals: cached.terminals.map((t) => ({
        ...t,
        chain: [...chain, ...t.chain],
        hasPublicFunction: hasPublicFunctionInChain || t.hasPublicFunction,
      })),
      errors: cached.errors,
      depthLimitReached: cached.depthLimitReached,
    }
  }

  // Cycle detection — if this node is on the current recursion stack, break the cycle
  if (visited.has(visitKey)) {
    return { terminals: [], errors: [], depthLimitReached: false }
  }

  visited.add(visitKey)

  const result: TraversalResult = {
    terminals: [],
    errors: [],
    depthLimitReached: false,
  }

  // Get backward edges (who points at this contract)
  const allEdges = lookupBackwardEdges(ctx, contractAddress)

  // Filter by function if specified
  const relevantEdges = functionName
    ? allEdges.filter((e) => e.targetFunction === functionName)
    : allEdges

  if (relevantEdges.length === 0) {
    ctx.memo.set(visitKey, result)
    return result
  }

  // Group edges by sourceContract, prefer call graph over permission from same source
  const grouped = groupEdgesBySource(relevantEdges)

  for (const { sourceContract, edges: sourceEdges } of grouped) {
    const sourceType = lookupType(ctx.contractTypeMap, sourceContract)
    const sourceName = lookupName(ctx.contractNameMap, sourceContract)

    // Prefer call graph edges (more precise) over permission edges from same source
    const callGraphEdges = sourceEdges.filter(
      (e) => e.edgeType === 'callgraph',
    )
    const selectedEdges =
      callGraphEdges.length > 0
        ? callGraphEdges
        : sourceEdges.filter((e) => e.edgeType === 'permission')

    // Deduplicate by sourceFunction
    const seenFunctions = new Set<string>()

    for (const edge of selectedEdges) {
      const funcKey = edge.sourceFunction ?? '*'
      if (seenFunctions.has(funcKey)) continue
      seenFunctions.add(funcKey)

      const step: OwnershipChainStep = {
        contractAddress: sourceContract,
        contractName: sourceName,
        functionName: edge.sourceFunction,
        contractType: sourceType,
        edgeType: edge.edgeType,
      }

      if (isTerminalType(sourceType)) {
        // Terminal: EOA or Multisig
        result.terminals.push({
          address: sourceContract,
          name: sourceName,
          type: sourceType,
          chain: [step],
          hasPublicFunction: hasPublicFunctionInChain,
        })
      } else if (edge.edgeType === 'callgraph' && edge.sourceFunction) {
        // Non-terminal + call graph edge — check if source function is permissioned
        const callerFuncData = findFunction(
          ctx,
          sourceContract,
          edge.sourceFunction,
        )
        const isPublic = callerFuncData
          ? !callerFuncData.isPermissioned
          : false

        if (
          callerFuncData?.isPermissioned &&
          callerFuncData.ownerDefinitions &&
          callerFuncData.ownerDefinitions.length > 0
        ) {
          // Source function is permissioned — recurse into its controllers
          const sub = traverse(
            ctx,
            sourceContract,
            edge.sourceFunction,
            visited,
            [step],
            depth + 1,
            hasPublicFunctionInChain || isPublic,
          )
          result.terminals.push(...sub.terminals)
          result.errors.push(...sub.errors)
          if (sub.depthLimitReached) result.depthLimitReached = true
        } else {
          // Public function — source contract is terminal for this path
          result.terminals.push({
            address: sourceContract,
            name: sourceName,
            type: sourceType,
            chain: [step],
            hasPublicFunction: true,
          })
        }
      } else {
        // Non-terminal + permission edge (no sourceFunction)
        // Recurse with null = look at ALL backward edges to sourceContract
        const sub = traverse(
          ctx,
          sourceContract,
          null,
          visited,
          [step],
          depth + 1,
          hasPublicFunctionInChain,
        )

        if (sub.terminals.length === 0 && !sub.depthLimitReached) {
          // Non-terminal with no backward edges — unresolved
          result.terminals.push({
            address: sourceContract,
            name: sourceName,
            type: sourceType,
            chain: [step],
            hasPublicFunction: hasPublicFunctionInChain,
            isUnresolved: true,
          })
        } else {
          result.terminals.push(...sub.terminals)
          result.errors.push(...sub.errors)
          if (sub.depthLimitReached) result.depthLimitReached = true
        }
      }
    }
  }

  // Deduplicate errors before caching
  result.errors = [...new Set(result.errors)]

  // Cache result (without chain prefix — callers prepend their own chain)
  ctx.memo.set(visitKey, result)

  // Return with the caller's chain prefix prepended
  return {
    terminals: result.terminals.map((t) => ({
      ...t,
      chain: [...chain, ...t.chain],
    })),
    errors: result.errors,
    depthLimitReached: result.depthLimitReached,
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/** Group edges by sourceContract for deduplication */
function groupEdgesBySource(
  edges: EnhancedEdge[],
): { sourceContract: string; edges: EnhancedEdge[] }[] {
  const groups = new Map<string, EnhancedEdge[]>()
  for (const edge of edges) {
    const key = edge.sourceContract.toLowerCase()
    let list = groups.get(key)
    if (!list) {
      list = []
      groups.set(key, list)
    }
    list.push(edge)
  }
  return Array.from(groups.entries()).map(([, edgeList]) => ({
    sourceContract: edgeList[0]!.sourceContract,
    edges: edgeList,
  }))
}

/** Lookup backward edges with impl↔proxy fallback */
function lookupBackwardEdges(
  ctx: TraversalContext,
  contractAddress: string,
): EnhancedEdge[] {
  const normalized = contractAddress.toLowerCase()

  // Direct match
  const direct = ctx.graph.backwardIndex.get(normalized)
  if (direct && direct.length > 0) return direct

  // impl → proxy fallback
  const proxyAddr = ctx.implToProxyMap.get(normalized)
  if (proxyAddr) {
    const via = ctx.graph.backwardIndex.get(proxyAddr.toLowerCase())
    if (via && via.length > 0) return via
  }

  // proxy → impls fallback
  const implAddrs = ctx.proxyToImplsMap.get(normalized)
  if (implAddrs) {
    for (const implAddr of implAddrs) {
      const via = ctx.graph.backwardIndex.get(implAddr.toLowerCase())
      if (via && via.length > 0) return via
    }
  }

  return []
}

/** Case-insensitive lookup in contract functions data */
function findContractFunctions(
  functionsData: ApiFunctionsResponse,
  contractAddress: string,
) {
  if (!functionsData.contracts) return undefined
  const normalized = contractAddress.toLowerCase()
  const entry = Object.entries(functionsData.contracts).find(
    ([key]) => key.toLowerCase() === normalized,
  )
  return entry ? entry[1] : undefined
}

/** Find contract functions with impl↔proxy fallback */
function findContractFunctionsWithMapping(
  ctx: TraversalContext,
  address: string,
) {
  // Direct match
  let result = findContractFunctions(ctx.functionsData, address)
  if (result) return result

  const normalized = address.toLowerCase()

  // impl → proxy fallback
  const proxyAddr = ctx.implToProxyMap.get(normalized)
  if (proxyAddr) {
    result = findContractFunctions(ctx.functionsData, proxyAddr)
    if (result) return result
  }

  // proxy → impls fallback
  const implAddrs = ctx.proxyToImplsMap.get(normalized)
  if (implAddrs) {
    for (const implAddr of implAddrs) {
      result = findContractFunctions(ctx.functionsData, implAddr)
      if (result) return result
    }
  }

  return undefined
}

/** Find a specific function in functions data (with impl↔proxy fallback) */
function findFunction(
  ctx: TraversalContext,
  contractAddress: string,
  functionName: string,
) {
  const contract = findContractFunctionsWithMapping(ctx, contractAddress)
  return contract?.functions.find((f) => f.functionName === functionName)
}

/** Case-insensitive type lookup with fallback */
function lookupType(
  typeMap: Map<string, ApiAddressType>,
  address: string,
): ApiAddressType {
  const exact = typeMap.get(address)
  if (exact) return exact
  const normalized = address.toLowerCase()
  for (const [key, value] of typeMap) {
    if (key.toLowerCase() === normalized) return value
  }
  return 'Unknown'
}

/** Case-insensitive name lookup with fallback */
function lookupName(nameMap: Map<string, string>, address: string): string {
  const exact = nameMap.get(address)
  if (exact) return exact
  const normalized = address.toLowerCase()
  for (const [key, value] of nameMap) {
    if (key.toLowerCase() === normalized) return value
  }
  return address
}

/** Deduplicate terminals by address + chain signature */
function deduplicateTerminals(
  terminals: TraversalTerminal[],
): TraversalTerminal[] {
  const seen = new Set<string>()
  const result: TraversalTerminal[] = []
  for (const terminal of terminals) {
    const chainSig = terminal.chain
      .map(
        (s) => `${s.contractAddress.toLowerCase()}:${s.functionName ?? ''}`,
      )
      .join('→')
    const key = `${terminal.address.toLowerCase()}|${chainSig}`
    if (seen.has(key)) continue
    seen.add(key)
    result.push(terminal)
  }
  return result
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Resolve the enhanced traversal for all permissioned functions in a project.
 * Builds a unified graph (call graph + permission edges) and traverses it
 * backward to find terminal entities (EOAs, Multisigs) that control each function.
 */
export function resolveEnhancedTraversal(
  paths: DiscoveryPaths,
  configReader: ConfigReader,
  templateService: TemplateService,
  projectName: string,
): ApiEnhancedTraversalResponse {
  // Load data
  const functionsData = getFunctions(paths, projectName)
  const callGraphData = getCallGraphData(paths, projectName)
  const projectData = getProject(configReader, templateService, projectName)

  // Build contract name and type lookup maps
  const contractNameMap = new Map<string, string>()
  const contractTypeMap = new Map<string, ApiAddressType>()

  projectData.entries?.forEach((entry: any) => {
    const allContracts = [
      ...(entry.initialContracts || []),
      ...(entry.discoveredContracts || []),
    ]
    allContracts.forEach((contract: any) => {
      contractNameMap.set(contract.address, contract.name || 'Unknown Contract')
      contractTypeMap.set(contract.address, contract.type || 'Contract')
    })

    entry.eoas?.forEach((eoa: any) => {
      contractNameMap.set(eoa.address, eoa.name || 'Unknown EOA')
      contractTypeMap.set(eoa.address, eoa.type || 'EOA')
    })
  })

  // Load discovered.json once for permission resolution
  const discoveredPath = path.join(
    paths.discovery,
    projectName,
    'discovered.json',
  )
  let dataAccess: DiscoveredDataAccess
  try {
    const fileContent = fs.readFileSync(discoveredPath, 'utf8')
    const discovered = JSON.parse(fileContent)
    dataAccess = new DiscoveredDataAccess(discovered)
  } catch {
    return {
      version: '1.0',
      lastModified: new Date().toISOString(),
      contracts: {},
      callGraphStale: false,
    }
  }

  // Build bidirectional impl↔proxy address mapping
  const implToProxyMap = new Map<string, string>()
  const proxyToImplsMap = new Map<string, string[]>()
  projectData.entries?.forEach((entry: any) => {
    const allContracts = [
      ...(entry.initialContracts || []),
      ...(entry.discoveredContracts || []),
    ]
    allContracts.forEach((contract: any) => {
      if (contract.implementationNames) {
        const proxyAddr = contract.address.toLowerCase()
        const impls: string[] = []
        for (const implAddr of Object.keys(contract.implementationNames)) {
          const implLower = implAddr.toLowerCase()
          if (implLower !== proxyAddr) {
            implToProxyMap.set(implLower, contract.address)
            impls.push(implAddr)
          }
        }
        if (impls.length > 0) {
          proxyToImplsMap.set(proxyAddr, impls)
        }
      }
    })
  })

  // Build enhanced graph (permission resolution happens here)
  const { edges, constructionErrors } = buildEnhancedGraph(
    callGraphData,
    functionsData,
    dataAccess,
  )

  // Build bidirectional indices
  const graph = buildIndices(edges)

  // Traversal context
  const ctx: TraversalContext = {
    functionsData,
    graph,
    contractNameMap,
    contractTypeMap,
    implToProxyMap,
    proxyToImplsMap,
    constructionErrors,
    memo: new Map(),
  }

  // Traverse for each permissioned function
  const contracts: Record<string, Record<string, FunctionTraversalResult>> = {}

  if (functionsData.contracts) {
    for (const [contractAddress, contractData] of Object.entries(
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

        // Merge construction errors for this function
        const errorKey = `${contractAddress.toLowerCase()}:${func.functionName}`
        const buildErrors = constructionErrors.get(errorKey) ?? []
        const allErrors = [
          ...new Set([
            ...buildErrors.map(
              (e) =>
                `Resolution error for ${contractAddress}:${func.functionName}: ${e}`,
            ),
            ...result.errors,
          ]),
        ]

        if (!contracts[contractAddress]) {
          contracts[contractAddress] = {}
        }

        contracts[contractAddress][func.functionName] = {
          contractAddress,
          functionName: func.functionName,
          terminals,
          errors: allErrors,
          depthLimitReached: result.depthLimitReached,
        }
      }
    }
  }

  // Staleness check: compare timestamps
  const functionsTimestamp = new Date(
    functionsData.lastModified || '1970-01-01',
  ).getTime()
  const callGraphTimestamp = new Date(
    callGraphData.lastModified || '1970-01-01',
  ).getTime()
  const callGraphStale = functionsTimestamp > callGraphTimestamp

  return {
    version: '1.0',
    lastModified: new Date().toISOString(),
    contracts,
    callGraphStale,
  }
}
