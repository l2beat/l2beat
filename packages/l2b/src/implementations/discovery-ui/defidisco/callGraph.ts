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
  ContractCallGraph,
  ExternalCall,
} from './types'

// =============================================================================
// Constants
// =============================================================================

const SLITHER_VENV_PATH = path.join(process.env.HOME || '', '.slither-venv')
const SLITHER_PATH = path.join(SLITHER_VENV_PATH, 'bin', 'slither')
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
  const contracts = getContractsToAnalyze(paths, discovered, project)

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
      `[${i + 1}/${contracts.length}] Analyzing ${contract.name} (${contract.address})...`,
    )

    // Check cache first
    const currentSourceHash = getContractSourceHash(
      discovered,
      contract.address,
    )
    const cachedEntry = getSlithirCache(paths, project, contract.address)

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

      const slitherResult = await runSlitherOnContract(
        contract.address,
        etherscanApiKey,
        onProgress,
      )

      if (slitherResult.error === 'UNVERIFIED') {
        onProgress?.(
          '  Skipping: Source code not available (unverified contract)',
        )
        result[contract.address] = {
          address: contract.address,
          name: contract.name,
          externalCalls: [],
          generatedAt: new Date().toISOString(),
          skipped: true,
          skipReason: 'Unverified contract',
        }
        continue
      }

      if (slitherResult.error) {
        onProgress?.(`  Error: ${slitherResult.error}`)
        result[contract.address] = {
          address: contract.address,
          name: contract.name,
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
        saveSlithirCache(paths, project, contract.address, {
          version: '1.0',
          sourceHash: currentSourceHash,
          generatedAt: new Date().toISOString(),
          slithirOutput,
        })
      }
    }

    // Get ABI function names for this contract
    const abiFunctionNames = getAbiFunctionNames(
      discovered.abis,
      contract.address,
    )

    // Parse the slithir output using ABI-driven approach
    const externalCalls = parseSlithirForContract(
      slithirOutput!,
      contract.name,
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
      const resolved = resolveStorageVariable(
        discovered,
        contract.address,
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
          callerContractAddress: contract.address,
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
      if (call.isViewCall === undefined) {
        const callerAbiLookup = findFunctionInAbi(
          discovered.abis,
          contract.address,
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

    result[contract.address] = {
      address: contract.address,
      name: contract.name,
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
  address: string,
): string | undefined {
  const entry = discovered.entries.find(
    (e) => e.address.toLowerCase() === address.toLowerCase(),
  )

  if (!entry || !('sourceHashes' in entry)) {
    return undefined
  }

  const sourceHashes = (entry as { sourceHashes?: string[] }).sourceHashes
  if (!sourceHashes || sourceHashes.length === 0) {
    return undefined
  }

  // Combine all source hashes into one (handles proxy + implementation)
  return sourceHashes.join(':')
}

// =============================================================================
// Private Helpers - Contract Analysis
// =============================================================================

/**
 * Get list of non-external contracts to analyze
 */
function getContractsToAnalyze(
  paths: DiscoveryPaths,
  discovered: DiscoveryOutput,
  project: string,
): { address: string; name: string }[] {
  // Load contract tags to identify external contracts
  const tags = getContractTags(paths, project)
  const externalAddresses = new Set(
    tags.tags
      .filter((tag) => tag.isExternal)
      .map((tag) => tag.contractAddress.toLowerCase()),
  )

  const contracts: { address: string; name: string }[] = []

  for (const entry of discovered.entries) {
    if (entry.type !== 'Contract') continue

    // Skip external contracts
    const normalizedAddress = entry.address.toLowerCase()
    if (externalAddresses.has(normalizedAddress)) continue

    contracts.push({
      address: entry.address,
      name: entry.name || 'Unknown',
    })
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

    const visited = new Set<string>()
    const hlcs = collectHighLevelCalls(
      parsedSlithir,
      contractName,
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
