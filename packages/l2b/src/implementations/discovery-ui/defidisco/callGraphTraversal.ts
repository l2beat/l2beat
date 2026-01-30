import type {
  ApiCallGraphResponse,
  CallGraphTraversalResult,
  ExternalCall,
} from './types'

/**
 * CallGraphTraverser performs recursive traversal of the call graph
 * starting from a specific (contract, function) entry point.
 *
 * It finds all contracts reachable via external calls and tracks:
 * - Whether each contract is reached only via view-only calls
 * - Which external calls couldn't be resolved (no target address)
 */
export class CallGraphTraverser {
  private callGraphData: ApiCallGraphResponse

  constructor(callGraphData: ApiCallGraphResponse) {
    this.callGraphData = callGraphData
  }

  /**
   * Traverse the call graph starting from a specific function.
   *
   * @param startContract - The contract address containing the entry function
   * @param startFunction - The function name to start traversal from
   * @param includeViewCalls - Whether to follow view/pure calls (default: true)
   * @returns Traversal result with reachable contracts and unresolved calls
   */
  traverseFromFunction(
    startContract: string,
    startFunction: string,
    includeViewCalls = true,
  ): CallGraphTraversalResult {
    // Track visited (contract:function) pairs for cycle detection
    const visited = new Set<string>()

    // Results
    const reachableContracts = new Map<
      string,
      {
        contractName?: string
        viewOnlyPath: boolean
        calledFunctions: Set<string>
      }
    >()
    const unresolvedCalls: CallGraphTraversalResult['unresolvedCalls'] = []

    // BFS traversal
    const queue: Array<{
      contract: string
      function: string
      pathIsViewOnly: boolean
    }> = [
      {
        contract: startContract,
        function: startFunction,
        pathIsViewOnly: true, // Starts as view-only, becomes false if any write call
      },
    ]

    while (queue.length > 0) {
      const { contract, function: func, pathIsViewOnly } = queue.shift()!

      // Create visit key for cycle detection
      const visitKey = `${contract.toLowerCase()}:${func}`
      if (visited.has(visitKey)) continue
      visited.add(visitKey)

      // Get call graph for this contract
      const contractGraph = this.callGraphData.contracts[contract]
      if (!contractGraph) {
        // Try case-insensitive lookup
        const contractGraphEntry = Object.entries(
          this.callGraphData.contracts,
        ).find(([addr]) => addr.toLowerCase() === contract.toLowerCase())
        if (!contractGraphEntry) continue
        // Use the found contract graph
        const [, foundGraph] = contractGraphEntry
        this.processContractCalls(
          foundGraph.externalCalls,
          func,
          pathIsViewOnly,
          includeViewCalls,
          reachableContracts,
          unresolvedCalls,
          queue,
        )
      } else {
        this.processContractCalls(
          contractGraph.externalCalls,
          func,
          pathIsViewOnly,
          includeViewCalls,
          reachableContracts,
          unresolvedCalls,
          queue,
        )
      }
    }

    return { reachableContracts, unresolvedCalls }
  }

  /**
   * Process external calls from a contract for a specific function.
   */
  private processContractCalls(
    externalCalls: ExternalCall[],
    callerFunction: string,
    pathIsViewOnly: boolean,
    includeViewCalls: boolean,
    reachableContracts: Map<
      string,
      {
        contractName?: string
        viewOnlyPath: boolean
        calledFunctions: Set<string>
      }
    >,
    unresolvedCalls: CallGraphTraversalResult['unresolvedCalls'],
    queue: Array<{
      contract: string
      function: string
      pathIsViewOnly: boolean
    }>,
  ): void {
    // Filter calls by callerFunction
    const functionCalls = externalCalls.filter(
      (call) => call.callerFunction === callerFunction,
    )

    for (const call of functionCalls) {
      // Determine if this call is view-only
      const isViewCall = call.isViewCall === true || call.callerIsView === true

      // Skip view calls if not including them
      if (!includeViewCalls && isViewCall) continue

      // Track unresolved calls
      if (!call.resolvedAddress) {
        // Only add if not already tracked
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

      // Calculate path view-only status
      // Path is view-only only if ALL calls in the path are view-only
      const newPathIsViewOnly = pathIsViewOnly && isViewCall

      // Update reachable contracts
      const existingEntry = reachableContracts.get(call.resolvedAddress)
      if (existingEntry) {
        // If we find a non-view-only path, update the flag
        if (!newPathIsViewOnly) {
          existingEntry.viewOnlyPath = false
        }
        // Track the called function
        existingEntry.calledFunctions.add(call.calledFunction)
      } else {
        reachableContracts.set(call.resolvedAddress, {
          contractName: call.resolvedContractName,
          viewOnlyPath: newPathIsViewOnly,
          calledFunctions: new Set([call.calledFunction]),
        })
      }

      // Queue the called function for traversal
      queue.push({
        contract: call.resolvedAddress,
        function: call.calledFunction,
        pathIsViewOnly: newPathIsViewOnly,
      })
    }
  }

  /**
   * Get all contracts reachable from any function in a given contract.
   * Useful for getting the full "blast radius" of a contract.
   */
  traverseFromContract(
    contractAddress: string,
    includeViewCalls = true,
  ): CallGraphTraversalResult {
    const contractGraph = this.callGraphData.contracts[contractAddress]
    if (!contractGraph) {
      return { reachableContracts: new Map(), unresolvedCalls: [] }
    }

    // Get unique caller functions
    const callerFunctions = new Set(
      contractGraph.externalCalls.map((c) => c.callerFunction),
    )

    // Merge results from all functions
    const mergedReachable = new Map<
      string,
      {
        contractName?: string
        viewOnlyPath: boolean
        calledFunctions: Set<string>
      }
    >()
    const mergedUnresolved: CallGraphTraversalResult['unresolvedCalls'] = []

    for (const func of callerFunctions) {
      const result = this.traverseFromFunction(
        contractAddress,
        func,
        includeViewCalls,
      )

      // Merge reachable contracts
      for (const [addr, data] of result.reachableContracts) {
        const existing = mergedReachable.get(addr)
        if (existing) {
          if (!data.viewOnlyPath) existing.viewOnlyPath = false
          // Merge called functions
          for (const fn of data.calledFunctions) {
            existing.calledFunctions.add(fn)
          }
        } else {
          mergedReachable.set(addr, {
            contractName: data.contractName,
            viewOnlyPath: data.viewOnlyPath,
            calledFunctions: new Set(data.calledFunctions),
          })
        }
      }

      // Merge unresolved calls (deduplicated)
      for (const unresolved of result.unresolvedCalls) {
        const alreadyTracked = mergedUnresolved.some(
          (u) =>
            u.storageVariable === unresolved.storageVariable &&
            u.calledFunction === unresolved.calledFunction,
        )
        if (!alreadyTracked) {
          mergedUnresolved.push(unresolved)
        }
      }
    }

    return {
      reachableContracts: mergedReachable,
      unresolvedCalls: mergedUnresolved,
    }
  }
}
