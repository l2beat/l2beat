import type { DiscoveryOutput } from '@l2beat/discovery'
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
        e.address.toLowerCase() === callerContractAddress.toLowerCase() &&
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

    if (typeof value === 'string' && value.startsWith('eth:')) {
      const resolvedContract = discovered.entries.find(
        (e) => e.address.toLowerCase() === value.toLowerCase(),
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
    const matches: HeuristicMatch[] = []

    for (const entry of discovered.entries) {
      if (entry.type !== 'Contract') continue

      const contractName = entry.name || ''
      if (contractName.toLowerCase() === expectedContractName.toLowerCase()) {
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

      const abi = discovered.abis[entry.address]
      if (!abi) continue

      // Check if this contract has the function
      const hasFunction = abi.some((abiEntry) => {
        if (!abiEntry.startsWith('function ')) return false
        const match = abiEntry.match(/^function\s+(\w+)\(/)
        return match && match[1] === functionName
      })

      if (hasFunction) {
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

  // Register heuristics in order of reliability
  engine.register(new VariableChainHeuristic())
  engine.register(new InterfaceNameHeuristic())
  engine.register(new FunctionSignatureHeuristic())

  return engine
}
