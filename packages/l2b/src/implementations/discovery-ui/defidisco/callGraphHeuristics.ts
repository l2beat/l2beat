import type { DiscoveryOutput } from '@l2beat/discovery'
import {
  addressesEqual,
  isChainAddress,
  normalizeChainAddress,
} from './addressUtils'
import { extractChainAddresses } from './callGraph'
import type { ExternalCall, ResolutionCandidate } from './types'

// =============================================================================
// Types
// =============================================================================

export interface HeuristicMatch {
  address: string
  contractName?: string
}

export interface HeuristicResult {
  matches: HeuristicMatch[]
  confidence: number
}

export interface HeuristicContext {
  call: ExternalCall
  callerContractAddress: string
  discovered: DiscoveryOutput
  variableAssignments: Map<string, string>
}

export interface ResolutionHeuristic {
  name: string
  description: string
  apply(context: HeuristicContext): HeuristicResult | null
}

export interface HeuristicEngineResult {
  heuristicName: string
  matches: ResolutionCandidate[]
  confidence: number
}

// =============================================================================
// Shared Helpers
// =============================================================================

/**
 * Check if a contract (including proxy implementations) has a function in its ABI.
 */
function contractHasFunction(
  discovered: DiscoveryOutput,
  entry: DiscoveryOutput['entries'][number],
  functionName: string,
): boolean {
  const abiAddresses = [entry.address]
  const implValue = entry.values?.$implementation
  if (typeof implValue === 'string' && isChainAddress(implValue)) {
    abiAddresses.push(implValue as typeof entry.address)
  }

  for (const abiAddress of abiAddresses) {
    const abi = discovered.abis[abiAddress]
    if (!abi) continue

    const found = abi.some((abiEntry) => {
      if (!abiEntry.startsWith('function ')) return false
      const match = abiEntry.match(/^function\s+(\w+)\(/)
      return match && match[1] === functionName
    })

    if (found) return true
  }

  return false
}

// =============================================================================
// Heuristic Implementations
// =============================================================================

/**
 * Variable Chain Following Heuristic
 *
 * Follows slithir variable assignments to find the original state variable.
 * Pattern: `troveManagerCached := troveManager` → look up `troveManager` in contract.values
 *
 * Confidence: 1 match = 100%, 2+ matches = drops rapidly (rare case)
 */
class VariableChainHeuristic implements ResolutionHeuristic {
  name = 'variable-chain'
  description = 'Follow variable assignment chain to state variable'

  apply(context: HeuristicContext): HeuristicResult | null {
    const { call, callerContractAddress, discovered, variableAssignments } =
      context

    // Look up the caller contract's values first
    const contract = discovered.entries.find(
      (e) =>
        addressesEqual(e.address, callerContractAddress) &&
        e.type === 'Contract',
    )

    if (!contract || !('values' in contract) || !contract.values) {
      return null
    }

    // Follow the assignment chain to find a state variable
    // Stop when we find a variable that exists in contract.values
    const resolvedVar = this.resolveVariableChain(
      call.storageVariable,
      variableAssignments,
      contract.values,
    )

    // If we resolved to the same variable, no chain to follow
    if (resolvedVar === call.storageVariable) {
      return null
    }

    const value = contract.values[resolvedVar]

    if (typeof value === 'string' && isChainAddress(value)) {
      const resolvedContract = discovered.entries.find((e) =>
        addressesEqual(e.address, value),
      )

      return {
        matches: [
          {
            address: value,
            contractName: resolvedContract?.name,
          },
        ],
        confidence: 100, // Single match via chain = 100%
      }
    }

    // Handle nested objects (e.g., oracle structs like { aggregator: "eth:0x...", decimals: 8 })
    // Filter to addresses that actually have the called function in their ABI
    const addresses = extractChainAddresses(value)
    if (addresses.length > 0) {
      const validMatches = addresses
        .map((addr) => {
          const entry = discovered.entries.find((e) =>
            addressesEqual(e.address, addr),
          )
          return { address: addr, contractName: entry?.name, entry }
        })
        .filter(
          (m) =>
            m.entry &&
            m.entry.type === 'Contract' &&
            contractHasFunction(
              discovered,
              m.entry,
              context.call.calledFunction,
            ),
        )
        .map(({ address, contractName }) => ({ address, contractName }))

      if (validMatches.length > 0) {
        return {
          matches: validMatches,
          confidence: validMatches.length === 1 ? 100 : 70,
        }
      }
    }

    return null
  }

  /**
   * Follow the assignment chain to find the root state variable.
   * Stops when:
   * 1. We find a variable that exists in contractValues (it's a state variable)
   * 2. We hit a variable not in the assignments map
   * 3. We exceed maxDepth
   */
  private resolveVariableChain(
    variable: string,
    assignments: Map<string, string>,
    contractValues: Record<string, unknown>,
    maxDepth = 10,
  ): string {
    let current = variable
    let depth = 0

    while (depth < maxDepth) {
      // Check if current is a state variable
      if (current in contractValues) {
        return current
      }

      // Try to follow the chain
      if (!assignments.has(current)) {
        break
      }

      current = assignments.get(current)!
      depth++
    }

    return current
  }
}

/**
 * Dependency Field Heuristic
 *
 * Catches the case where the caller's `storageVariable` is not a stored field
 * on the caller itself but a public getter that forwards to a dependency — e.g.
 * `Voter.rewardToken()` returns `minter.rewardToken()` at runtime. Slither sees
 * it as a read against `rewardToken` on the caller, but discovery only ever
 * persists stored state, so the name won't appear in the caller's values.
 *
 * Resolution: if `storageVariable` is NOT a key in the caller's values, walk
 * the caller's dependency addresses (the addresses held in other value fields)
 * and see whether any of THEM have a matching field. A single hop is enough in
 * practice; most forwarded getters point one contract away.
 *
 * Confidence: 1 match → 90%, 2 matches → 65%, 3+ matches → 45%.
 */
class DependencyFieldHeuristic implements ResolutionHeuristic {
  name = 'dependency-field'
  description = 'Follow caller dependency addresses to find the storage field'

  apply(context: HeuristicContext): HeuristicResult | null {
    const { call, callerContractAddress, discovered } = context

    const callerContract = discovered.entries.find(
      (e) =>
        addressesEqual(e.address, callerContractAddress) &&
        e.type === 'Contract',
    )
    if (
      !callerContract ||
      !('values' in callerContract) ||
      !callerContract.values
    ) {
      return null
    }

    // If the name IS a direct field on the caller, VariableChainHeuristic will
    // handle it — don't compete.
    if (call.storageVariable in callerContract.values) {
      return null
    }

    // Collect dependency addresses held in the caller's values (one level deep
    // into nested objects to match DiscoveredValuesScan's reach).
    const depAddresses = new Set<string>()
    for (const value of Object.values(callerContract.values)) {
      for (const addr of extractChainAddresses(value)) {
        depAddresses.add(normalizeChainAddress(addr))
      }
    }
    if (depAddresses.size === 0) {
      return null
    }

    // For each dependency, check if its discovered values contain a field with
    // the same name as the storageVariable, and that field resolves to an
    // address whose contract has the called function in its ABI.
    const matches: HeuristicMatch[] = []
    const seen = new Set<string>()

    for (const depEntry of discovered.entries) {
      if (depEntry.type !== 'Contract') continue
      if (!depAddresses.has(normalizeChainAddress(depEntry.address))) continue
      if (!('values' in depEntry) || !depEntry.values) continue

      const depValue = depEntry.values[call.storageVariable]
      if (depValue === undefined) continue

      for (const addr of extractChainAddresses(depValue)) {
        const normalized = normalizeChainAddress(addr)
        if (seen.has(normalized)) continue
        seen.add(normalized)

        const targetEntry = discovered.entries.find((e) =>
          addressesEqual(e.address, addr),
        )
        if (
          !targetEntry ||
          targetEntry.type !== 'Contract' ||
          !contractHasFunction(discovered, targetEntry, call.calledFunction)
        ) {
          continue
        }

        matches.push({
          address: addr,
          contractName: targetEntry.name,
        })
      }
    }

    if (matches.length === 0) {
      return null
    }

    let confidence = 45
    if (matches.length === 1) confidence = 90
    else if (matches.length === 2) confidence = 65

    return { matches, confidence }
  }
}

/**
 * Interface Name to Contract Name Heuristic
 *
 * Matches interface name to contract names by stripping the `I` prefix.
 * Example: `ITroveManager` → look for contract named `TroveManager`
 *
 * Confidence: 1 match = 90%, 2 matches = 60%, 3+ matches = 40%
 */
class InterfaceNameHeuristic implements ResolutionHeuristic {
  name = 'interface-name'
  description = 'Match interface name to contract name (strip I prefix)'

  apply(context: HeuristicContext): HeuristicResult | null {
    const { call, discovered } = context

    // Strip the I prefix from interface name
    const interfaceName = call.interfaceType
    if (!interfaceName.startsWith('I') || interfaceName.length <= 1) {
      return null
    }

    const expectedContractName = interfaceName.slice(1) // Remove 'I' prefix

    // Find all contracts with matching name (case-insensitive)
    // Checks both entry.name and implementationNames values to handle:
    // - Aliases: entry.name is the alias, but implementationNames has the code-derived name
    // - Proxies: entry.name is the proxy name, but implementationNames has the implementation name
    const matches: HeuristicMatch[] = []
    const expectedLower = expectedContractName.toLowerCase()

    for (const entry of discovered.entries) {
      if (entry.type !== 'Contract') continue

      const contractName = entry.name || ''
      if (contractName.toLowerCase() === expectedLower) {
        matches.push({
          address: entry.address,
          contractName: entry.name,
        })
        continue // Don't double-match same entry
      }

      // Check implementationNames values (code-derived names from Etherscan source)
      if (entry.implementationNames) {
        const implNames = entry.implementationNames
        let matched = false
        for (const implName of Object.values(implNames)) {
          if (implName.toLowerCase() === expectedLower) {
            matches.push({
              address: entry.address,
              contractName: entry.name,
            })
            matched = true
            break // One match per entry is enough
          }
        }
        if (matched) continue
      }
    }

    if (matches.length === 0) {
      return null
    }

    // Calculate confidence based on number of matches
    const confidence = this.calculateConfidence(matches.length)

    return {
      matches,
      confidence,
    }
  }

  private calculateConfidence(matchCount: number): number {
    if (matchCount === 1) return 90
    if (matchCount === 2) return 60
    return 40
  }
}

/**
 * Function Signature Matching Heuristic
 *
 * Finds contracts that have the called function in their ABI.
 *
 * Confidence: 1 match = 99%, 2 matches = 50%, 3+ matches = 30%
 */
class FunctionSignatureHeuristic implements ResolutionHeuristic {
  name = 'function-signature'
  description = 'Match called function to contracts with that function in ABI'

  apply(context: HeuristicContext): HeuristicResult | null {
    const { call, discovered } = context

    const functionName = call.calledFunction
    const matches: HeuristicMatch[] = []

    // Search all contracts for the function in their ABI
    for (const entry of discovered.entries) {
      if (entry.type !== 'Contract') continue

      if (contractHasFunction(discovered, entry, functionName)) {
        matches.push({
          address: entry.address,
          contractName: entry.name,
        })
      }
    }

    if (matches.length === 0) {
      return null
    }

    // Calculate confidence based on number of matches
    const confidence = this.calculateConfidence(matches.length)

    return {
      matches,
      confidence,
    }
  }

  private calculateConfidence(matchCount: number): number {
    if (matchCount === 1) return 99
    if (matchCount === 2) return 50
    return 30
  }
}

/**
 * Discovered Values Scan Heuristic
 *
 * Scans the caller contract's discovered values (recursively) for eth: addresses,
 * then finds contracts at those addresses that have the called function in their ABI.
 * This catches dependencies stored in nested structs (e.g., oracle configs with
 * an `aggregator` address) that other heuristics miss.
 *
 * Confidence: 1 match → 95%, 2 matches → 70%, 3+ matches → 50%
 */
class DiscoveredValuesScanHeuristic implements ResolutionHeuristic {
  name = 'discovered-values-scan'
  description =
    'Match candidates against addresses found in caller contract values'

  apply(context: HeuristicContext): HeuristicResult | null {
    const { call, callerContractAddress, discovered } = context

    // Find the caller contract's values
    const callerContract = discovered.entries.find(
      (e) =>
        addressesEqual(e.address, callerContractAddress) &&
        e.type === 'Contract',
    )

    if (
      !callerContract ||
      !('values' in callerContract) ||
      !callerContract.values
    ) {
      return null
    }

    // Collect all eth: addresses from the caller's values (one level deep into objects)
    const valueAddresses = new Set<string>()
    for (const value of Object.values(callerContract.values)) {
      for (const addr of extractChainAddresses(value)) {
        valueAddresses.add(normalizeChainAddress(addr))
      }
    }

    if (valueAddresses.size === 0) {
      return null
    }

    // Find contracts at those addresses that have the called function in their ABI
    const functionName = call.calledFunction
    const matches: HeuristicMatch[] = []

    for (const entry of discovered.entries) {
      if (entry.type !== 'Contract') continue
      if (!valueAddresses.has(normalizeChainAddress(entry.address))) continue

      if (contractHasFunction(discovered, entry, functionName)) {
        matches.push({
          address: entry.address,
          contractName: entry.name,
        })
      }
    }

    if (matches.length === 0) {
      return null
    }

    const confidence = this.calculateConfidence(matches.length)
    return { matches, confidence }
  }

  private calculateConfidence(matchCount: number): number {
    if (matchCount === 1) return 95
    if (matchCount === 2) return 70
    return 50
  }
}

/**
 * Transitive Values Scan Heuristic
 *
 * Two-hop variant of DiscoveredValuesScan. The caller may not store the
 * actual call target directly — instead it stores a "router" or "registry"
 * (e.g. PoolAddressesProvider) and reads the real address from there at
 * runtime. We can't see runtime calls in static analysis, but we CAN walk
 * the addresses found in the caller's values, then look at THEIR values
 * for further addresses, and match the called function against this
 * second-hop set.
 *
 * Concrete case this fixes (Aave V3): PoolConfigurator.setReservePause calls
 * pool.setLiquidationGracePeriod(...). The caller's values contain the
 * PoolAddressesProvider (via proxyAdmin). PAP's values contain getPool, and
 * THAT Pool has the function. One unique 2-hop match.
 *
 * Without this, FunctionSignatureHeuristic falls back to "any contract with
 * this function name" — which on multi-market protocols (Aave Core / Lido /
 * Horizon) returns 4+ candidates and picks the wrong one with confidence 30%.
 *
 * Confidence: 1 match → 85%, 2 matches → 55%, 3+ matches → 35%. Slightly
 * below DiscoveredValuesScanHeuristic so direct hits always win, but well
 * above FunctionSignatureHeuristic's 30% fallback.
 */
class TransitiveValuesScanHeuristic implements ResolutionHeuristic {
  name = 'transitive-values-scan'
  description =
    'Match candidates against addresses found two hops out via caller values'

  apply(context: HeuristicContext): HeuristicResult | null {
    const { call, callerContractAddress, discovered } = context

    const callerContract = discovered.entries.find(
      (e) =>
        addressesEqual(e.address, callerContractAddress) &&
        e.type === 'Contract',
    )

    if (
      !callerContract ||
      !('values' in callerContract) ||
      !callerContract.values
    ) {
      return null
    }

    // Hop 1: addresses in the caller's values
    const firstHop = new Set<string>()
    for (const value of Object.values(callerContract.values)) {
      for (const addr of extractChainAddresses(value)) {
        firstHop.add(normalizeChainAddress(addr))
      }
    }

    if (firstHop.size === 0) return null

    // Hop 2: for each first-hop contract, collect addresses in ITS values.
    // We deliberately exclude first-hop addresses themselves from the result
    // set — DiscoveredValuesScanHeuristic already covers that path; we only
    // want strictly second-hop matches here, otherwise both heuristics
    // surface the same answer with different confidences.
    const secondHop = new Set<string>()
    for (const entry of discovered.entries) {
      if (entry.type !== 'Contract') continue
      if (!firstHop.has(normalizeChainAddress(entry.address))) continue
      if (!('values' in entry) || !entry.values) continue
      for (const value of Object.values(entry.values)) {
        for (const addr of extractChainAddresses(value)) {
          const norm = normalizeChainAddress(addr)
          if (firstHop.has(norm)) continue // already a 1-hop hit
          secondHop.add(norm)
        }
      }
    }

    if (secondHop.size === 0) return null

    // Filter to contracts that actually expose the called function
    const functionName = call.calledFunction
    const matches: HeuristicMatch[] = []

    for (const entry of discovered.entries) {
      if (entry.type !== 'Contract') continue
      if (!secondHop.has(normalizeChainAddress(entry.address))) continue

      if (contractHasFunction(discovered, entry, functionName)) {
        matches.push({
          address: entry.address,
          contractName: entry.name,
        })
      }
    }

    if (matches.length === 0) return null

    const confidence = this.calculateConfidence(matches.length)
    return { matches, confidence }
  }

  private calculateConfidence(matchCount: number): number {
    if (matchCount === 1) return 85
    if (matchCount === 2) return 55
    return 35
  }
}

// =============================================================================
// Heuristic Engine
// =============================================================================

export class HeuristicEngine {
  private heuristics: ResolutionHeuristic[] = []

  register(heuristic: ResolutionHeuristic): void {
    this.heuristics.push(heuristic)
  }

  /**
   * Run all heuristics and return the best result (highest confidence)
   * Also logs all heuristic results for debugging
   */
  resolve(
    context: HeuristicContext,
    onProgress?: (message: string) => void,
  ): HeuristicEngineResult | null {
    const results: {
      heuristic: ResolutionHeuristic
      result: HeuristicResult
    }[] = []

    // Log what we're trying to resolve
    onProgress?.(
      `    Resolving: ${context.call.storageVariable} → ${context.call.calledFunction}() [${context.call.interfaceType}]`,
    )

    // Run all heuristics
    for (const heuristic of this.heuristics) {
      const result = heuristic.apply(context)

      if (result) {
        results.push({ heuristic, result })
        const matchNames = result.matches
          .map((m) => m.contractName || m.address.slice(0, 14))
          .join(', ')
        onProgress?.(
          `      - ${heuristic.name}: ${result.matches.length} match(es) [${matchNames}] → confidence: ${result.confidence}%`,
        )
      } else {
        onProgress?.(`      - ${heuristic.name}: no match`)
      }
    }

    if (results.length === 0) {
      onProgress?.('      Winner: none')
      return null
    }

    // Select the result with highest confidence
    results.sort((a, b) => b.result.confidence - a.result.confidence)
    const winner = results[0]!

    const winnerMatchNames = winner.result.matches
      .map((m) => m.contractName || m.address.slice(0, 14))
      .join(', ')
    onProgress?.(
      `      Winner: ${winner.heuristic.name} (${winner.result.confidence}%) → ${winnerMatchNames}`,
    )

    return {
      heuristicName: winner.heuristic.name,
      matches: winner.result.matches.map((m) => ({
        address: m.address,
        contractName: m.contractName,
      })),
      confidence: winner.result.confidence,
    }
  }

  /**
   * Async version of resolve that supports throttled progress callbacks
   * Use this when verbose output is enabled to prevent overwhelming the UI
   */
  async resolveAsync(
    context: HeuristicContext,
    onProgress?: (message: string) => Promise<void>,
  ): Promise<HeuristicEngineResult | null> {
    const results: {
      heuristic: ResolutionHeuristic
      result: HeuristicResult
    }[] = []

    // Log what we're trying to resolve
    await onProgress?.(
      `    Resolving: ${context.call.storageVariable} → ${context.call.calledFunction}() [${context.call.interfaceType}]`,
    )

    // Run all heuristics
    for (const heuristic of this.heuristics) {
      const result = heuristic.apply(context)

      if (result) {
        results.push({ heuristic, result })
        const matchNames = result.matches
          .map((m) => m.contractName || m.address.slice(0, 14))
          .join(', ')
        await onProgress?.(
          `      - ${heuristic.name}: ${result.matches.length} match(es) [${matchNames}] → confidence: ${result.confidence}%`,
        )
      } else {
        await onProgress?.(`      - ${heuristic.name}: no match`)
      }
    }

    if (results.length === 0) {
      await onProgress?.('      Winner: none')
      return null
    }

    // Select the result with highest confidence
    results.sort((a, b) => b.result.confidence - a.result.confidence)
    const winner = results[0]!

    const winnerMatchNames = winner.result.matches
      .map((m) => m.contractName || m.address.slice(0, 14))
      .join(', ')
    await onProgress?.(
      `      Winner: ${winner.heuristic.name} (${winner.result.confidence}%) → ${winnerMatchNames}`,
    )

    return {
      heuristicName: winner.heuristic.name,
      matches: winner.result.matches.map((m) => ({
        address: m.address,
        contractName: m.contractName,
      })),
      confidence: winner.result.confidence,
    }
  }
}

// =============================================================================
// Variable Assignment Parsing
// =============================================================================

/**
 * Parse slithir output to extract variable assignments
 *
 * Handles multiple patterns:
 * 1. Direct assignment: `varName(Type) := sourceName(Type)`
 *    Example: `troveManagerCached(ITroveManager) := troveManager(ITroveManager)`
 *
 * 2. Struct field reference: `REF_XXX(Type) -> structVar.fieldName`
 *    Example: `REF_159(IActivePool) -> vars.activePool`
 *
 * 3. Struct field assignment: `REF_XXX(Type) (->structVar) := sourceName(Type)`
 *    Example: `REF_147(IActivePool) (->vars) := activePool(IActivePool)`
 */
export function parseVariableAssignments(
  slithirOutput: string,
): Map<string, string> {
  const assignments = new Map<string, string>()
  // Map REF_XXX to the struct field it points to (e.g., REF_159 -> "vars.activePool")
  const refToField = new Map<string, string>()
  // Map struct.field to source variable (e.g., "vars.activePool" -> "activePool")
  const structFieldAssignments = new Map<string, string>()

  const lines = slithirOutput.split('\n')

  for (const line of lines) {
    // Pattern 1: Direct assignment - `varName(Type) := sourceName(Type)`
    // But NOT struct field assignments which have "(->structVar)"
    const assignMatch = line.match(/^\s*(\w+)\([^)]+\)\s*:=\s*(\w+)\(/)
    if (assignMatch && !line.includes('(->')) {
      const [, target, source] = assignMatch
      if (target && source) {
        assignments.set(target, source)
      }
      continue
    }

    // Pattern 2: Struct field reference - `REF_XXX(Type) -> structVar.fieldName`
    const refMatch = line.match(/^\s*(REF_\d+)\([^)]+\)\s*->\s*(\w+\.\w+)/)
    if (refMatch) {
      const [, refName, fieldPath] = refMatch
      if (refName && fieldPath) {
        refToField.set(refName, fieldPath)
      }
      continue
    }

    // Pattern 3: Struct field assignment - `REF_XXX(Type) (->structVar) := sourceName(Type)`
    const structAssignMatch = line.match(
      /^\s*(REF_\d+)\([^)]+\)\s*\(->\w+\)\s*:=\s*(\w+)\(/,
    )
    if (structAssignMatch) {
      const [, refName, source] = structAssignMatch
      if (refName && source) {
        // Get the field path this REF points to
        const fieldPath = refToField.get(refName)
        if (fieldPath) {
          structFieldAssignments.set(fieldPath, source)
        }
      }
      continue
    }
  }

  // Now build the complete assignment map
  // For each REF that points to a struct field, create an assignment chain
  for (const [refName, fieldPath] of refToField) {
    const source = structFieldAssignments.get(fieldPath)
    if (source) {
      // REF_XXX -> struct.field -> source
      // So we add: REF_XXX -> source (directly)
      assignments.set(refName, source)
    }
  }

  return assignments
}

// =============================================================================
// Default Engine Instance
// =============================================================================

/**
 * Create a pre-configured heuristic engine with all heuristics registered
 */
export function createHeuristicEngine(): HeuristicEngine {
  const engine = new HeuristicEngine()

  // Register heuristics (engine selects by highest confidence, order only affects tiebreaking)
  engine.register(new VariableChainHeuristic())
  engine.register(new DependencyFieldHeuristic())
  engine.register(new DiscoveredValuesScanHeuristic())
  engine.register(new TransitiveValuesScanHeuristic())
  engine.register(new InterfaceNameHeuristic())
  engine.register(new FunctionSignatureHeuristic())

  return engine
}
