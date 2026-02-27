import type {
  ConfigReader,
  DiscoveryOutput,
  DiscoveryPaths,
} from '@l2beat/discovery'
import { spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import {
  createHeuristicEngine,
  type HeuristicContext,
  parseVariableAssignments,
} from './callGraphHeuristics'
import { getContractTags } from './contractTags'
import type {
  ApiCallGraphResponse,
  CallPathStep,
  ContractCallGraph,
  ContractTag,
  ExternalCall,
} from './types'

// =============================================================================
// Constants
// =============================================================================

const SLITHER_VENV_PATH =
  process.env.SLITHER_VENV_PATH ||
  path.join(process.env.HOME || '', '.slither-venv')
const SLITHER_PATH =
  process.env.SLITHER_PATH || path.join(SLITHER_VENV_PATH, 'bin', 'slither')
const SLITHIR_CACHE_FOLDER = 'slithir-cache'

// =============================================================================
// Slithir Cache Types
// =============================================================================

interface SlithirCacheEntry {
  version: string
  sourceHash: string
  generatedAt: string
  slithirOutput: string
}

// =============================================================================
// Internal Types (for slithir parsing)
// =============================================================================

interface ParsedFunction {
  name: string
  contractName: string
  parameters: { name: string; type: string }[]
  internalCalls: {
    contract: string
    functionName: string
    arguments: string[]
  }[]
  libraryCalls: { library: string; functionName: string }[]
  highLevelCalls: {
    storageVariable: string
    interfaceType: string
    calledFunction: string
  }[]
}

interface ParsedContract {
  name: string
  functions: Map<string, ParsedFunction>
}

interface ParsedSlithir {
  contracts: Map<string, ParsedContract>
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Get cached call graph data for a project
 */
export function getCallGraphData(
  paths: DiscoveryPaths,
  project: string,
): ApiCallGraphResponse {
  const callGraphPath = getCallGraphDataPath(paths, project)

  if (fs.existsSync(callGraphPath)) {
    try {
      const fileContent = fs.readFileSync(callGraphPath, 'utf8')
      const data = JSON.parse(fileContent) as ApiCallGraphResponse
      return data
    } catch (error) {
      console.error('Error parsing call graph data file:', error)
    }
  }

  return {
    version: '1.0',
    lastModified: new Date().toISOString(),
    contracts: {},
  }
}

/**
 * Save call graph data for a project
 */
export function saveCallGraphData(
  paths: DiscoveryPaths,
  project: string,
  data: ApiCallGraphResponse,
): void {
  const callGraphPath = getCallGraphDataPath(paths, project)

  // Ensure directory exists
  const dir = path.dirname(callGraphPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const updatedData = {
    ...data,
    lastModified: new Date().toISOString(),
  }

  fs.writeFileSync(callGraphPath, JSON.stringify(updatedData, null, 2))
}

/**
 * Generate call graph for a project
 * @param verbose - If true, outputs detailed heuristic resolution info (use with devMode)
 */
export async function generateCallGraph(
  paths: DiscoveryPaths,
  configReader: ConfigReader,
  project: string,
  onProgress?: (message: string) => void,
  verbose = false,
): Promise<ApiCallGraphResponse> {
  // Get Etherscan API key from environment
  const etherscanApiKey =
    process.env.ETHERSCAN_API_KEY_FOR_DISCOVERY ||
    process.env.L2B_ETHERSCAN_API_KEY

  if (!etherscanApiKey) {
    throw new Error(
      'ETHERSCAN_API_KEY_FOR_DISCOVERY or L2B_ETHERSCAN_API_KEY not configured in environment',
    )
  }

  // Load discovered.json once for all operations
  const discovered = configReader.readDiscovery(project)

  // Get contracts to analyze (non-external only)
  const contracts = getContractsToAnalyze(
    paths,
    discovered,
    project,
    onProgress,
  )

  onProgress?.(`Found ${contracts.length} non-external contracts to analyze`)

  if (contracts.length === 0) {
    onProgress?.('No contracts to analyze')
    return {
      version: '1.0',
      lastModified: new Date().toISOString(),
      contracts: {},
    }
  }

  const result: Record<string, ContractCallGraph> = {}

  // Track cache statistics
  let cacheHits = 0
  let cacheMisses = 0

  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i]!
    onProgress?.(
      `[${i + 1}/${contracts.length}] Analyzing ${contract.displayName} (${contract.entryAddress})...`,
    )

    // Check cache first
    // Cache key uses slitherAddress (implementation for proxies) since that's what Slither runs on
    // Source hash uses slitherAddress to avoid cache thrashing when two proxies share an implementation
    const currentSourceHash = getContractSourceHash(
      discovered,
      contract.entryAddress,
      contract.slitherAddress,
    )
    const cachedEntry = getSlithirCache(paths, project, contract.slitherAddress)

    let slithirOutput: string | null = null

    // Use cache if source hash matches
    if (
      cachedEntry &&
      currentSourceHash &&
      cachedEntry.sourceHash === currentSourceHash
    ) {
      onProgress?.('  Using cached Slithir output (source unchanged)')
      slithirOutput = cachedEntry.slithirOutput
      cacheHits++
    } else {
      // Run slither on the contract
      const reason = cachedEntry ? 'source changed' : 'no cache'
      onProgress?.(`  Running Slither (${reason})...`)

      // runs on implementation address for proxies (since interested in business logic of the contract, not proxy logic)
      const slitherResult = await runSlitherOnContract(
        contract.slitherAddress,
        etherscanApiKey,
        onProgress,
      )

      if (slitherResult.error === 'UNVERIFIED') {
        onProgress?.(
          '  Skipping: Source code not available (unverified contract)',
        )
        result[contract.entryAddress] = {
          address: contract.entryAddress,
          name: contract.displayName,
          externalCalls: [],
          generatedAt: new Date().toISOString(),
          skipped: true,
          skipReason: 'Unverified contract',
        }
        continue
      }

      if (slitherResult.error) {
        onProgress?.(`  Error: ${slitherResult.error}`)
        result[contract.entryAddress] = {
          address: contract.entryAddress,
          name: contract.displayName,
          externalCalls: [],
          generatedAt: new Date().toISOString(),
          error: slitherResult.error,
        }
        continue
      }

      slithirOutput = slitherResult.output
      cacheMisses++

      // Save to cache if we have a source hash
      if (currentSourceHash && slithirOutput) {
        saveSlithirCache(paths, project, contract.slitherAddress, {
          version: '1.0',
          sourceHash: currentSourceHash,
          generatedAt: new Date().toISOString(),
          slithirOutput,
        })
      }
    }

    // Get ABI function names (use implementation ABI for proxies)
    const abiFunctionNames = getAbiFunctionNames(
      discovered.abis,
      contract.abiAddress,
    )

    // Parse the slithir output using ABI-driven approach
    // Uses code-derived name (from implementationNames) for SlithIR section lookup
    const externalCalls = parseSlithirForContract(
      slithirOutput!,
      contract.slitherContractName,
      abiFunctionNames,
      onProgress,
    )

    // Parse variable assignments for heuristic resolution
    const variableAssignments = parseVariableAssignments(slithirOutput!)

    // Create heuristic engine for optimistic resolution
    const heuristicEngine = createHeuristicEngine()

    // Track resolution statistics
    let deterministicCount = 0
    let optimisticCount = 0

    // In verbose mode, create a throttled progress callback with delays
    // to prevent overwhelming the UI with too many messages
    let verboseMessageCount = 0
    const THROTTLE_BATCH_SIZE = 5 // Yield to event loop every N verbose messages
    const THROTTLE_DELAY_MS = 100 // Delay in ms to let UI catch up
    const verboseProgress = verbose
      ? async (message: string) => {
          onProgress?.(message)
          verboseMessageCount++
          // Add a delay every batch to let UI catch up
          if (verboseMessageCount % THROTTLE_BATCH_SIZE === 0) {
            await new Promise((resolve) =>
              setTimeout(resolve, THROTTLE_DELAY_MS),
            )
          }
        }
      : undefined

    // Resolve addresses and classify calls for each external call
    for (const call of externalCalls) {
      // Try deterministic resolution first (direct state variable lookup)
      // Use entryAddress — values (state variables) are stored on the proxy entry
      const resolved = resolveStorageVariable(
        discovered,
        contract.entryAddress,
        call.storageVariable,
      )

      if (resolved.address) {
        // Deterministic resolution succeeded
        call.resolvedAddress = resolved.address
        call.resolvedContractName = resolved.name
        call.resolutionType = 'deterministic'
        deterministicCount++
      } else {
        // Try optimistic resolution using heuristics
        const heuristicContext: HeuristicContext = {
          call,
          callerContractAddress: contract.entryAddress,
          discovered,
          variableAssignments,
        }

        // Only pass progress callback in verbose mode (devMode)
        const heuristicResult = verbose
          ? await heuristicEngine.resolveAsync(
              heuristicContext,
              verboseProgress,
            )
          : heuristicEngine.resolve(heuristicContext)

        if (heuristicResult && heuristicResult.matches.length > 0) {
          // Use the first match as the primary resolution
          const primaryMatch = heuristicResult.matches[0]!
          call.resolvedAddress = primaryMatch.address
          call.resolvedContractName = primaryMatch.contractName
          call.resolutionType = 'optimistic'
          call.resolutionHeuristic = heuristicResult.heuristicName
          call.resolutionConfidence = heuristicResult.confidence

          // Store all candidates if multiple matches
          if (heuristicResult.matches.length > 1) {
            call.resolutionCandidates = heuristicResult.matches
          }

          optimisticCount++
        }
      }

      // Look up the called function in the target contract's ABI to determine if it's a view/pure
      if (call.resolvedAddress) {
        const abiLookup = findFunctionInAbi(
          discovered.abis,
          call.resolvedAddress,
          call.calledFunction,
        )
        if (abiLookup.found) {
          call.isViewCall = abiLookup.isView
        }
      }

      // If we couldn't determine from target ABI, check if the caller function is view/pure
      // (view/pure functions can only call other view/pure functions)
      // Use abiAddress — caller ABI is on the implementation for proxies
      if (call.isViewCall === undefined) {
        const callerAbiLookup = findFunctionInAbi(
          discovered.abis,
          contract.abiAddress,
          call.callerFunction,
        )
        if (callerAbiLookup.found && callerAbiLookup.isView) {
          call.callerIsView = true
          call.isViewCall = true
        }
      }
    }

    const resolvedCount = externalCalls.filter((c) => c.resolvedAddress).length
    const viewCount = externalCalls.filter((c) => c.isViewCall === true).length
    const writeCount = externalCalls.filter(
      (c) => c.isViewCall === false,
    ).length
    onProgress?.(
      `  Found ${externalCalls.length} external calls (${deterministicCount} deterministic, ${optimisticCount} optimistic, ${resolvedCount - deterministicCount - optimisticCount} unresolved)`,
    )
    onProgress?.(`  Read/Write: ${viewCount} reads, ${writeCount} writes`)

    result[contract.entryAddress] = {
      address: contract.entryAddress,
      name: contract.displayName,
      externalCalls,
      generatedAt: new Date().toISOString(),
    }

    // Yield to event loop after each contract to prevent blocking
    // This is especially important when using cached data (no natural async breaks)
    await new Promise((resolve) => setImmediate(resolve))
  }

  // Calculate summary
  const totalCalls = Object.values(result).reduce(
    (sum, c) => sum + c.externalCalls.length,
    0,
  )
  const deterministicTotal = Object.values(result).reduce(
    (sum, c) =>
      sum +
      c.externalCalls.filter((call) => call.resolutionType === 'deterministic')
        .length,
    0,
  )
  const optimisticTotal = Object.values(result).reduce(
    (sum, c) =>
      sum +
      c.externalCalls.filter((call) => call.resolutionType === 'optimistic')
        .length,
    0,
  )
  const unresolvedTotal = totalCalls - deterministicTotal - optimisticTotal
  const errorCount = Object.values(result).filter((c) => c.error).length
  const skippedCount = Object.values(result).filter((c) => c.skipped).length

  onProgress?.('')
  onProgress?.('=== Summary ===')
  onProgress?.(`Contracts analyzed: ${contracts.length}`)
  onProgress?.(`Cache: ${cacheHits} hits, ${cacheMisses} misses`)
  onProgress?.(`Skipped (unverified): ${skippedCount}`)
  onProgress?.(`Errors: ${errorCount}`)
  onProgress?.(`Total external calls: ${totalCalls}`)
  onProgress?.(
    `Resolved: ${deterministicTotal} deterministic, ${optimisticTotal} optimistic, ${unresolvedTotal} unresolved`,
  )

  const response: ApiCallGraphResponse = {
    version: '1.0',
    lastModified: new Date().toISOString(),
    contracts: result,
  }

  // Save the result
  saveCallGraphData(paths, project, response)
  onProgress?.('Call graph data saved to call-graph-data.json')

  return response
}

// =============================================================================
// Private Helpers - File I/O
// =============================================================================

function getCallGraphDataPath(paths: DiscoveryPaths, project: string): string {
  return path.join(paths.discovery, project, 'call-graph-data.json')
}

// =============================================================================
// Private Helpers - Slithir Cache
// =============================================================================

function getSlithirCacheFolderPath(
  paths: DiscoveryPaths,
  project: string,
): string {
  return path.join(paths.discovery, project, SLITHIR_CACHE_FOLDER)
}

function getSlithirCacheFilePath(
  paths: DiscoveryPaths,
  project: string,
  contractAddress: string,
): string {
  // Use the address (without eth: prefix) as filename
  const cleanAddress = contractAddress.replace(/^eth:/i, '')
  return path.join(
    getSlithirCacheFolderPath(paths, project),
    `${cleanAddress}.json`,
  )
}

function getSlithirCache(
  paths: DiscoveryPaths,
  project: string,
  contractAddress: string,
): SlithirCacheEntry | null {
  const cachePath = getSlithirCacheFilePath(paths, project, contractAddress)

  if (!fs.existsSync(cachePath)) {
    return null
  }

  try {
    const content = fs.readFileSync(cachePath, 'utf8')
    return JSON.parse(content) as SlithirCacheEntry
  } catch {
    return null
  }
}

function saveSlithirCache(
  paths: DiscoveryPaths,
  project: string,
  contractAddress: string,
  entry: SlithirCacheEntry,
): void {
  const cacheFolder = getSlithirCacheFolderPath(paths, project)

  // Ensure cache folder exists
  if (!fs.existsSync(cacheFolder)) {
    fs.mkdirSync(cacheFolder, { recursive: true })
  }

  const cachePath = getSlithirCacheFilePath(paths, project, contractAddress)
  fs.writeFileSync(cachePath, JSON.stringify(entry, null, 2))
}

function getContractSourceHash(
  discovered: DiscoveryOutput,
  entryAddress: string,
  slitherAddress: string,
): string | undefined {
  const entry = discovered.entries.find(
    (e) => e.address.toLowerCase() === entryAddress.toLowerCase(),
  )

  if (!entry?.sourceHashes || entry.sourceHashes.length === 0) {
    return undefined
  }

  // For proxies (entryAddress !== slitherAddress), use only the implementation hash
  // to avoid cache thrashing when two proxies share one implementation.
  // sourceHashes order: [proxy, implementation] — last element is the implementation.
  if (entryAddress.toLowerCase() !== slitherAddress.toLowerCase()) {
    return entry.sourceHashes[entry.sourceHashes.length - 1]
  }

  // Regular contract — single source hash
  return entry.sourceHashes[0]
}

// =============================================================================
// Private Helpers - Contract Analysis
// =============================================================================

interface ContractToAnalyze {
  entryAddress: string // proxy address — used for storing results (UI shows proxy)
  slitherAddress: string // address to run Slither on (impl for proxies, self otherwise)
  slitherContractName: string // code-derived name for SlithIR section lookup
  abiAddress: string // address to get ABI from (impl for proxies, self otherwise)
  displayName: string // entry.name for display/logging
}

/**
 * Get list of non-external contracts to analyze.
 * For proxy contracts, returns the implementation address for Slither/ABI analysis
 * while keeping the proxy address for result storage.
 */
function getContractsToAnalyze(
  paths: DiscoveryPaths,
  discovered: DiscoveryOutput,
  project: string,
  onProgress?: (message: string) => void,
): ContractToAnalyze[] {
  // Load contract tags to identify external contracts
  const tags = getContractTags(paths, project)
  const externalAddresses = new Set(
    tags.tags
      .filter((tag) => tag.isExternal)
      .map((tag) => tag.contractAddress.toLowerCase()),
  )

  const contracts: ContractToAnalyze[] = []

  for (const entry of discovered.entries) {
    if (entry.type !== 'Contract') continue

    // Skip external contracts
    const normalizedAddress = entry.address.toLowerCase()
    if (externalAddresses.has(normalizedAddress)) continue

    const displayName = entry.name || 'Unknown'
    const implNames = entry.implementationNames
    const proxyType = entry.proxyType

    // A contract is a proxy if proxyType is not "immutable"
    const isProxy = proxyType !== undefined && proxyType !== 'immutable'

    if (isProxy) {
      // Get implementation address from values.$implementation
      const implValue = entry.values?.$implementation

      if (typeof implValue === 'string' && implValue.startsWith('eth:')) {
        // Proxy contract — analyze the implementation
        const implAddress = implValue as typeof entry.address
        const implName = implNames?.[implAddress] ?? displayName
        contracts.push({
          entryAddress: entry.address,
          slitherAddress: implValue,
          slitherContractName: implName,
          abiAddress: implValue,
          displayName,
        })
      } else {
        // Proxy but no valid $implementation — fall back to proxy address
        onProgress?.(
          `  Warning: proxy ${displayName} has no $implementation — running Slither on proxy bytecode, results may be empty`,
        )
        contracts.push({
          entryAddress: entry.address,
          slitherAddress: entry.address,
          slitherContractName: displayName,
          abiAddress: entry.address,
          displayName,
        })
      }
    } else {
      // Regular contract — use implementationNames for code-derived name
      // prevent taking the alias given by config.jsonc (field "name")
      const codeName = implNames?.[entry.address] ?? displayName
      contracts.push({
        entryAddress: entry.address,
        slitherAddress: entry.address,
        slitherContractName: codeName,
        abiAddress: entry.address,
        displayName,
      })
    }
  }

  return contracts
}

/**
 * Resolve storage variable to actual contract address using discovered.json
 */
function resolveStorageVariable(
  discovered: DiscoveryOutput,
  contractAddress: string,
  storageVariable: string,
): { address: string | undefined; name: string | undefined } {
  // Find the contract in discovered data
  const contract = discovered.entries.find(
    (e) =>
      e.address.toLowerCase() === contractAddress.toLowerCase() &&
      e.type === 'Contract',
  )

  if (!contract || !('values' in contract) || !contract.values) {
    return { address: undefined, name: undefined }
  }

  // Look up the storage variable in contract values
  const value = contract.values[storageVariable]

  if (typeof value === 'string' && value.startsWith('eth:')) {
    // Find the name of the resolved contract
    const resolvedContract = discovered.entries.find(
      (e) => e.address.toLowerCase() === value.toLowerCase(),
    )
    return {
      address: value,
      name: resolvedContract?.name,
    }
  }

  return { address: undefined, name: undefined }
}

// =============================================================================
// Private Helpers - ABI Analysis
// =============================================================================

/**
 * Get list of public function names from the contract's ABI
 */
function getAbiFunctionNames(
  abis: Record<string, string[]>,
  contractAddress: string,
): string[] {
  const abi = abis[contractAddress]
  if (!abi) return []

  const functionNames: string[] = []
  for (const entry of abi) {
    if (entry.startsWith('function ')) {
      // Extract function name from "function name(params) ..."
      const match = entry.match(/^function\s+(\w+)\(/)
      if (match) {
        functionNames.push(match[1]!)
      }
    }
  }
  return functionNames
}

/**
 * Check if an ABI entry represents a view/pure function
 */
function isViewFunction(abiEntry: string): boolean {
  // ABI entries include "view" or "pure" keyword for read-only functions
  return (
    abiEntry.includes(' view ') ||
    abiEntry.includes(' view)') ||
    abiEntry.includes(' pure ') ||
    abiEntry.includes(' pure)')
  )
}

/**
 * Find a function in the contract's ABI and determine if it's a view/pure function
 */
function findFunctionInAbi(
  abis: Record<string, string[]>,
  contractAddress: string,
  functionName: string,
): { found: boolean; isView?: boolean } {
  const contractAbi = abis[contractAddress]
  if (!contractAbi) return { found: false }

  // Find matching function entry - use regex with word boundary to avoid false positives
  // (e.g., searching for "transfer" shouldn't match "transferFrom")
  const funcRegex = new RegExp(`^function\\s+${functionName}\\(`)
  const funcEntry = contractAbi.find((entry) => funcRegex.test(entry))

  if (!funcEntry) return { found: false }

  return {
    found: true,
    isView: isViewFunction(funcEntry),
  }
}

// =============================================================================
// Private Helpers - Slithir Parsing
// =============================================================================

/**
 * Parse slithir output into a structured representation with all contracts and their function calls
 */
function parseSlithirStructured(output: string): ParsedSlithir {
  const contracts = new Map<string, ParsedContract>()
  let currentContract: ParsedContract | null = null
  let currentFunction: ParsedFunction | null = null

  const lines = output.split('\n')

  for (const line of lines) {
    // Check for contract header: matches "Contract ContractName" anywhere in line
    // (handles "INFO:Printers:Contract X" and "Contract X" formats)
    const contractMatch = line.match(/Contract\s+(\w+)$/)
    if (contractMatch) {
      const contractName = contractMatch[1]!
      currentContract = {
        name: contractName,
        functions: new Map(),
      }
      contracts.set(contractName, currentContract)
      currentFunction = null
      continue
    }

    // Check for function header: "\tFunction ContractName.functionName(params) (*)"
    // Example: "Function BorrowerOperations._adjustTrove(ITroveManager,uint256,TroveChange,uint256) (*)"
    const funcMatch = line.match(/^\s*Function\s+(\w+)\.(\w+)\s*\(([^)]*)\)/)
    if (funcMatch && currentContract) {
      const [, contractName, functionName, paramsStr] = funcMatch
      // Handle function overloading: merge calls from overloaded functions with same name
      const existingFunc = currentContract.functions.get(functionName!)
      if (existingFunc) {
        // Reuse existing function entry to accumulate calls from all overloads
        currentFunction = existingFunc
      } else {
        // Parse parameter types from the function signature
        // Note: Function headers only have types, not names (e.g., "ITroveManager,uint256")
        const paramTypes = paramsStr
          ? paramsStr
              .split(',')
              .map((t) => t.trim())
              .filter((t) => t.length > 0)
          : []

        currentFunction = {
          name: functionName!,
          contractName: contractName!,
          parameters: paramTypes.map((type) => ({ name: '', type })), // names filled in later from usage
          internalCalls: [],
          libraryCalls: [],
          highLevelCalls: [],
        }
        currentContract.functions.set(functionName!, currentFunction)
      }
      continue
    }

    if (!currentFunction) continue

    // Parse INTERNAL_CALL: "TMP = INTERNAL_CALL, ContractName.funcName(params)(args)"
    // Example: "INTERNAL_CALL, BorrowerOperations._adjustTrove(ITroveManager,uint256,TroveChange,uint256)(troveManagerCached,_troveId,troveChange,0)"
    if (line.includes('INTERNAL_CALL')) {
      // First try to match with arguments: Contract.func(types)(args)
      const internalMatchWithArgs = line.match(
        /INTERNAL_CALL,\s*(\w+)\.(\w+)\([^)]*\)\(([^)]*)\)/,
      )
      if (internalMatchWithArgs) {
        const [, contract, funcName, argsStr] = internalMatchWithArgs
        // Parse arguments (split by comma, trim whitespace)
        const args = argsStr
          ? argsStr
              .split(',')
              .map((a) => a.trim())
              .filter((a) => a.length > 0)
          : []
        currentFunction.internalCalls.push({
          contract: contract!,
          functionName: funcName!,
          arguments: args,
        })
      } else {
        // Fallback: match without arguments (for parameterless functions)
        const internalMatch = line.match(/INTERNAL_CALL,\s*(\w+)\.(\w+)\(/)
        if (internalMatch) {
          const [, contract, funcName] = internalMatch
          currentFunction.internalCalls.push({
            contract: contract!,
            functionName: funcName!,
            arguments: [],
          })
        }
      }
      continue
    }

    // Parse LIBRARY_CALL: "TMP = LIBRARY_CALL, dest:LibName, function:LibName.funcName(params), arguments:[...]"
    if (line.includes('LIBRARY_CALL')) {
      const libMatch = line.match(
        /LIBRARY_CALL,\s*dest:(\w+),\s*function:(\w+)\.(\w+)\(/,
      )
      if (libMatch) {
        const [, library, , funcName] = libMatch
        currentFunction.libraryCalls.push({
          library: library!,
          functionName: funcName!,
        })
      }
      continue
    }

    // Parse HIGH_LEVEL_CALL: "TMP = HIGH_LEVEL_CALL, dest:varName(InterfaceType), function:methodName, arguments:[...]"
    if (line.includes('HIGH_LEVEL_CALL')) {
      const hlcMatch = line.match(
        /HIGH_LEVEL_CALL,\s*dest:(\w+)\((\w+)\),\s*function:(\w+)/,
      )
      if (hlcMatch) {
        const [, storageVariable, interfaceType, calledFunction] = hlcMatch
        currentFunction.highLevelCalls.push({
          storageVariable: storageVariable!,
          interfaceType: interfaceType!,
          calledFunction: calledFunction!,
        })
      }
    }
  }

  return { contracts }
}

/**
 * Type-based substitution map: maps (interfaceType) -> argumentName
 * Used to substitute parameter variables with the actual arguments passed by the caller
 */
type TypeSubstitutionMap = Map<string, string>

/**
 * Build a type-based substitution map from INTERNAL_CALL arguments to called function parameters
 * This maps parameter types to the actual argument values passed
 */
function buildTypeSubstitutionMap(
  calledFunc: ParsedFunction,
  callArguments: string[],
  parentSubstitutions: TypeSubstitutionMap,
): TypeSubstitutionMap {
  const substitutions = new Map<string, string>()

  // Map each parameter type to its corresponding argument
  for (
    let i = 0;
    i < calledFunc.parameters.length && i < callArguments.length;
    i++
  ) {
    const paramType = calledFunc.parameters[i]?.type
    let argValue = callArguments[i]!

    // If the argument is itself a substituted value from a parent scope, resolve it
    if (parentSubstitutions.has(argValue)) {
      argValue = parentSubstitutions.get(argValue)!
    }

    // Only store if we don't already have a mapping for this type
    // (handles case where multiple params have same type - first one wins)
    if (!substitutions.has(paramType)) {
      substitutions.set(paramType, argValue)
    }
  }

  return substitutions
}

/**
 * Recursively collect all HIGH_LEVEL_CALLs reachable from a function
 * following INTERNAL_CALL and LIBRARY_CALL chains
 *
 * @param typeSubstitutions - Map from interface types to actual argument names from caller.
 *   When a HIGH_LEVEL_CALL uses a variable of a given type, we substitute with the caller's argument.
 */
function collectHighLevelCalls(
  parsedSlithir: ParsedSlithir,
  contractName: string,
  functionName: string,
  visited: Set<string>,
  typeSubstitutions: TypeSubstitutionMap = new Map(),
  onProgress?: (message: string) => void,
): {
  storageVariable: string
  interfaceType: string
  calledFunction: string
}[] {
  const key = `${contractName}.${functionName}`
  if (visited.has(key)) return []
  visited.add(key)

  const contract = parsedSlithir.contracts.get(contractName)
  if (!contract) return []

  const func = contract.functions.get(functionName)
  if (!func) return []

  const calls: {
    storageVariable: string
    interfaceType: string
    calledFunction: string
  }[] = []

  // Collect direct HIGH_LEVEL_CALLs with type-based substitution
  for (const hlc of func.highLevelCalls) {
    // Check if this variable's interface type has a substitution
    // This handles the case where a function parameter is used to make an external call
    const substitutedVar = typeSubstitutions.get(hlc.interfaceType)

    calls.push({
      ...hlc,
      storageVariable: substitutedVar ?? hlc.storageVariable,
    })
  }

  // Follow INTERNAL_CALLs with argument propagation
  for (const ic of func.internalCalls) {
    // Look up the called function to get its parameter types
    const calledContract = parsedSlithir.contracts.get(ic.contract)
    const calledFunc = calledContract?.functions.get(ic.functionName)

    // Build new type substitution map for the called function
    let newSubstitutions = typeSubstitutions
    if (calledFunc && ic.arguments.length > 0) {
      newSubstitutions = buildTypeSubstitutionMap(
        calledFunc,
        ic.arguments,
        typeSubstitutions,
      )
    }

    calls.push(
      ...collectHighLevelCalls(
        parsedSlithir,
        ic.contract,
        ic.functionName,
        visited,
        newSubstitutions,
        onProgress,
      ),
    )
  }

  // Follow LIBRARY_CALLs
  for (const lc of func.libraryCalls) {
    const libContract = parsedSlithir.contracts.get(lc.library)
    if (!libContract) {
      onProgress?.(
        `    Warning: LIBRARY_CALL to ${lc.library}.${lc.functionName}() - library not found in slithir output`,
      )
      continue
    }
    const libFunc = libContract.functions.get(lc.functionName)
    if (!libFunc) {
      onProgress?.(
        `    Warning: LIBRARY_CALL to ${lc.library}.${lc.functionName}() - function not found in library`,
      )
      continue
    }
    calls.push(
      ...collectHighLevelCalls(
        parsedSlithir,
        lc.library,
        lc.functionName,
        visited,
        typeSubstitutions, // Library calls don't typically pass contract references as params
        onProgress,
      ),
    )
  }

  return calls
}

/**
 * Parse slithir output and extract external calls starting from ABI functions only,
 * following INTERNAL_CALL and LIBRARY_CALL chains transitively
 */
function parseSlithirForContract(
  output: string,
  contractName: string,
  abiFunctionNames: string[],
  onProgress?: (message: string) => void,
): ExternalCall[] {
  const parsedSlithir = parseSlithirStructured(output)
  const calls: ExternalCall[] = []

  // For each public function in the ABI, collect all reachable HIGH_LEVEL_CALLs
  for (const funcName of abiFunctionNames) {
    // Skip constructor
    if (funcName === 'constructor') continue

    // Determine which SlithIR contract section contains this function
    let targetContractName = contractName
    const mainContract = parsedSlithir.contracts.get(contractName)

    if (!mainContract?.functions.has(funcName)) {
      // Inheritance fallback: search other sections within slithir output for this function
      // Skip interfaces (empty function bodies — no call instructions)
      for (const [name, contract] of parsedSlithir.contracts) {
        if (name === contractName) continue
        const func = contract.functions.get(funcName)
        if (!func) continue
        // Skip interfaces: they have declarations but no call instructions
        if (
          func.internalCalls.length === 0 &&
          func.highLevelCalls.length === 0 &&
          func.libraryCalls.length === 0
        )
          continue
        targetContractName = name
        break
      }
    }

    const visited = new Set<string>()
    const hlcs = collectHighLevelCalls(
      parsedSlithir,
      targetContractName,
      funcName,
      visited,
      new Map(), // No type substitutions for top-level public functions
      onProgress,
    )

    // Deduplicate and add to result with the public function as the caller
    const seen = new Set<string>()
    for (const hlc of hlcs) {
      const key = `${hlc.storageVariable}.${hlc.calledFunction}`
      if (seen.has(key)) continue
      seen.add(key)

      calls.push({
        callerFunction: funcName,
        storageVariable: hlc.storageVariable,
        interfaceType: hlc.interfaceType,
        calledFunction: hlc.calledFunction,
      })
    }
  }

  return calls
}

// =============================================================================
// Private Helpers - Slither Execution
// =============================================================================

/**
 * Run slither on a contract and parse the output
 */
async function runSlitherOnContract(
  address: string,
  etherscanApiKey: string,
  onProgress?: (message: string) => void,
): Promise<{ output: string; error?: string }> {
  return new Promise((resolve) => {
    // Check if slither venv exists
    if (!fs.existsSync(SLITHER_PATH)) {
      resolve({
        output: '',
        error: `Slither not found at ${SLITHER_PATH}. Please install slither in ~/.slither-venv/`,
      })
      return
    }

    // Clean address - remove eth: prefix
    const cleanAddress = address.replace(/^eth:/i, '')

    onProgress?.(`Running slither on ${cleanAddress}...`)

    // Set up environment with slither venv bin path (contains solc wrapper from solc-select)
    const slitherVenvBin = path.join(SLITHER_VENV_PATH, 'bin')
    const env = {
      ...process.env,
      PATH: `${slitherVenvBin}:${process.env.PATH}`,
      SOLC_VERSION: '', // Let crytic-compile auto-detect
    }

    // Always fetch from Etherscan - the crytic-export cache format doesn't work with slither directly
    // Slither will use its own internal caching mechanism
    const args = [
      cleanAddress,
      '--print',
      'slithir',
      '--etherscan-apikey',
      etherscanApiKey,
    ]

    const slither = spawn(SLITHER_PATH, args, { env })

    let _stdout = ''
    let stderr = ''

    slither.stdout.on('data', (data) => {
      _stdout += data.toString()
    })

    slither.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    slither.on('close', (code) => {
      // Slither outputs the slithir analysis to STDERR, not stdout
      // Combine both streams for analysis
      const output = stderr

      if (output.includes('Source code not available')) {
        resolve({
          output: '',
          error: 'UNVERIFIED',
        })
        return
      }

      // Check if we got slithir output (in stderr)
      if (output.includes('HIGH_LEVEL_CALL') || output.includes('Function ')) {
        resolve({ output })
      } else if (code !== 0) {
        resolve({
          output: '',
          error: output || `Slither exited with code ${code}`,
        })
      } else {
        // No HIGH_LEVEL_CALLs found but succeeded - contract might just have no external calls
        resolve({ output })
      }
    })

    slither.on('error', (err) => {
      resolve({
        output: '',
        error: `Failed to spawn slither: ${err.message}`,
      })
    })
  })
}

// =============================================================================
// Shared Call Graph Traversal Helpers
// =============================================================================
// These are used by both functionAnalysis.ts and v2Scoring.ts.

export interface TraversalEntry {
  contractName?: string
  viewOnlyPath: boolean
  calledFunctions: Set<string>
  /** Shortest path from the start to this contract (BFS guarantees shortest) */
  shortestPath: CallPathStep[]
}

export interface TraversalWithPathsResult {
  reachableContracts: Map<string, TraversalEntry>
  unresolvedCalls: {
    storageVariable: string
    interfaceType: string
    calledFunction: string
  }[]
}

/**
 * BFS traversal that tracks the shortest path to each reachable contract.
 * Records parent pointers for path reconstruction.
 */
export function traverseWithPaths(
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
export function findContractGraph(
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

export function buildExternalAddressSet(tags: ContractTag[]): Set<string> {
  const set = new Set<string>()
  for (const tag of tags) {
    if (tag.isExternal) {
      set.add(tag.contractAddress.toLowerCase())
    }
  }
  return set
}

export function buildTagsByAddress(
  tags: ContractTag[],
): Map<string, ContractTag> {
  const map = new Map<string, ContractTag>()
  for (const tag of tags) {
    map.set(tag.contractAddress.toLowerCase(), tag)
  }
  return map
}

export function isExternalAddress(
  address: string,
  externalAddresses: Set<string>,
): boolean {
  const normalized = address.toLowerCase()
  if (externalAddresses.has(normalized)) return true
  if (externalAddresses.has(normalized.replace('eth:', ''))) return true
  if (externalAddresses.has(`eth:${normalized}`)) return true
  return false
}

export function findTag(
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

export function getCallGraphContractName(
  callGraphData: ApiCallGraphResponse,
  address: string,
): string | undefined {
  const normalizedAddress = address.toLowerCase()
  const entry = Object.entries(callGraphData.contracts).find(
    ([key]) => key.toLowerCase() === normalizedAddress,
  )
  return entry?.[1]?.name
}
