import { addressesEqual, normalizeChainAddress } from './addressUtils'
import type { EnhancedGraph } from './enhancedTraversal'
import {
  isUpgradeFunction,
  type AdminDetail,
  type AdminDetailWithCapital,
  type ApiFunctionsResponse,
  type ApiFundsDataResponse,
  type CallGraphTraversalResult,
  type FunctionCapitalAnalysis,
  type Impact,
  type ReachableContract,
} from './types'

/**
 * CapitalAnalysisCalculator combines enhanced graph traversal with funds data
 * to calculate the total capital at risk for each admin.
 *
 * Uses the enhanced graph (call graph + permission edges) for forward traversal,
 * so capital propagates through permission chains (e.g., Governor → Timelock → contracts).
 *
 * IMPORTANT: Only counts a contract's funds as "at risk" if:
 * 1. The contract is reachable via enhanced graph from a permissioned function
 * 2. At least one function called on that contract has an impact score (not unscored)
 */
export class CapitalAnalysisCalculator {
  private enhancedGraph: EnhancedGraph
  private fundsData: ApiFundsDataResponse
  private functionsData: ApiFunctionsResponse
  private contractNameMap: Map<string, string>
  private implToProxy: Map<string, string>
  private resolvedImpactCaps: Map<string, number>

  constructor(
    enhancedGraph: EnhancedGraph,
    fundsData: ApiFundsDataResponse,
    functionsData: ApiFunctionsResponse,
    contractNameMap: Map<string, string>,
    implToProxy?: Map<string, string>,
    resolvedImpactCaps?: Map<string, number>,
  ) {
    this.enhancedGraph = enhancedGraph
    this.fundsData = fundsData
    this.functionsData = functionsData
    this.contractNameMap = contractNameMap
    this.implToProxy = implToProxy ?? new Map()
    this.resolvedImpactCaps = resolvedImpactCaps ?? new Map()
  }

  /**
   * Look up the impact cap (in USD) for a function.
   * Scoped lookup (by ownerAddress) takes precedence over global.
   */
  private getFunctionCap(
    contractAddress: string,
    functionName: string,
    ownerAddress?: string,
  ): number | undefined {
    const base = `${normalizeChainAddress(contractAddress)}|${functionName}`
    if (ownerAddress) {
      const scoped = this.resolvedImpactCaps.get(
        `${base}|${normalizeChainAddress(ownerAddress)}`,
      )
      if (scoped !== undefined) return scoped
    }
    return this.resolvedImpactCaps.get(base)
  }

  /**
   * Resolve an address to its proxy if it's an implementation address.
   * This prevents double-counting funds that exist at the proxy address
   * but are mirrored to the implementation address by enrichFundsWithImplementations.
   */
  private resolveToProxy(address: string): string {
    const norm = normalizeChainAddress(address)
    return this.implToProxy.get(norm) ?? norm
  }

  /**
   * Check if a function on a contract has potential impact on funds.
   * Returns true unless the function is explicitly marked as 'no-impact' by a researcher.
   * Unscored functions are treated as potentially impactful (safe default),
   * matching how direct capital already counts unscored functions.
   */
  private functionHasImpact(
    contractAddress: string,
    functionName: string,
  ): boolean {
    // Case-insensitive lookup for the contract
    const normalizedAddress = normalizeChainAddress(contractAddress)
    const contractEntry = Object.entries(
      this.functionsData.contracts ?? {},
    ).find(([key]) => normalizeChainAddress(key) === normalizedAddress)

    // If the contract or function isn't in functions.json, a call graph edge
    // still exists — the relationship is real. Funds data acts as the natural
    // guard: external contracts without fund entries contribute $0 regardless.
    if (!contractEntry) return true
    const contractFunctions = contractEntry[1]

    const func = contractFunctions.functions.find(
      (f) => f.functionName === functionName,
    )

    if (!func) return true

    // Only exclude functions explicitly marked as no-impact by a researcher.
    // Unscored/undefined functions default to "potentially impactful" so that
    // unreviewed projects surface maximum risk rather than hiding it.
    return func.score !== 'no-impact'
  }

  /**
   * Check if a function is explicitly marked as no-impact by the researcher.
   * Unlike functionHasImpact, this only returns true for the explicit 'no-impact' score,
   * not for unscored/undefined functions.
   */
  private functionIsNoImpact(
    contractAddress: string,
    functionName: string,
  ): boolean {
    const normalizedAddress = normalizeChainAddress(contractAddress)
    const contractEntry = Object.entries(
      this.functionsData.contracts ?? {},
    ).find(([key]) => normalizeChainAddress(key) === normalizedAddress)

    if (!contractEntry) return false
    const contractFunctions = contractEntry[1]

    const func = contractFunctions.functions.find(
      (f) => f.functionName === functionName,
    )

    return func?.score === 'no-impact'
  }

  /**
   * Check if ANY of the called functions on a contract have impact.
   */
  private anyCalledFunctionHasImpact(
    contractAddress: string,
    calledFunctions: Set<string>,
  ): boolean {
    for (const fn of calledFunctions) {
      if (this.functionHasImpact(contractAddress, fn)) {
        return true
      }
    }
    return false
  }

  /**
   * Forward BFS through the enhanced graph (call graph + permission edges).
   * Follows both call graph edges (function-level) and permission edges (contract-level)
   * to find all contracts reachable from a starting (contract, function) pair.
   *
   * The output map keys implementation addresses resolved to their proxy,
   * so proxy + implementation are merged into a single entry. This prevents
   * double-counting funds that exist at the proxy but are mirrored to
   * implementations by enrichFundsWithImplementations.
   *
   * Cap propagation: if a function along the path has an impactCap mitigation,
   * the cap is threaded through the BFS as pathCapUsd (minimum along each path).
   * When a contract is reachable via multiple paths, the maximum cap is kept
   * (least restrictive wins — if any path is uncapped, the contract is uncapped).
   */
  private traverseForward(
    startContract: string,
    startFunction: string,
    ownerAddress?: string,
  ): CallGraphTraversalResult {
    const visited = new Set<string>()
    const reachableContracts = new Map<
      string,
      {
        contractName?: string
        viewOnlyPath: boolean
        calledFunctions: Set<string>
        effectiveCapUsd?: number
      }
    >()

    // BFS queue: each entry is a (contract, function, viewOnlyPath, pathCapUsd) tuple
    const queue: Array<{
      contract: string
      function: string
      pathIsViewOnly: boolean
      pathCapUsd?: number
    }> = []

    if (isUpgradeFunction(startFunction)) {
      // Upgrade = arbitrary code execution on this contract.
      // The new implementation can call any function, so seed BFS with ALL
      // functions from this contract's call graph + permission edges.
      const normalizedStart = normalizeChainAddress(startContract)
      const allEdges = this.enhancedGraph.forwardIndex.get(normalizedStart)
      if (allEdges) {
        const seenFunctions = new Set<string>()
        for (const edge of allEdges) {
          const fn = edge.sourceFunction
          if (fn && !seenFunctions.has(fn)) {
            seenFunctions.add(fn)
            queue.push({
              contract: startContract,
              function: fn,
              pathIsViewOnly: false, // upgrade = non-view
              pathCapUsd: this.getFunctionCap(startContract, fn, ownerAddress),
            })
          }
        }
      }
      // Also add the upgrade function itself (may have its own calls)
      queue.push({
        contract: startContract,
        function: startFunction,
        pathIsViewOnly: false,
        pathCapUsd: this.getFunctionCap(
          startContract,
          startFunction,
          ownerAddress,
        ),
      })
      // Permission edges (no sourceFunction) are followed by default in BFS
    } else {
      queue.push({
        contract: startContract,
        function: startFunction,
        pathIsViewOnly: true,
        pathCapUsd: this.getFunctionCap(
          startContract,
          startFunction,
          ownerAddress,
        ),
      })
    }

    while (queue.length > 0) {
      const {
        contract,
        function: func,
        pathIsViewOnly,
        pathCapUsd,
      } = queue.shift()!

      const visitKey = `${normalizeChainAddress(contract)}:${func}`
      if (visited.has(visitKey)) continue
      visited.add(visitKey)

      const normalizedContract = normalizeChainAddress(contract)
      const edges = this.enhancedGraph.forwardIndex.get(normalizedContract)
      if (!edges) continue

      for (const edge of edges) {
        const isCallGraph = edge.edgeType === 'callgraph'

        // Call graph edges: follow only edges from the current function
        if (isCallGraph && edge.sourceFunction !== func) continue

        const isViewCall = isCallGraph && edge.isViewCall === true
        const newPathIsViewOnly = isCallGraph
          ? pathIsViewOnly && isViewCall
          : false // Permission edges are always non-view

        // Cap propagation: apply the cap of the current source function to
        // the outgoing path. Take the minimum (tightest) cap along the path.
        const sourceFuncCap = this.getFunctionCap(contract, func, ownerAddress)
        const newPathCap =
          pathCapUsd !== undefined || sourceFuncCap !== undefined
            ? Math.min(pathCapUsd ?? Infinity, sourceFuncCap ?? Infinity)
            : undefined

        // Resolve implementation addresses to proxy for the output map,
        // so we don't create separate entries for proxy and implementation.
        const targetNorm = this.resolveToProxy(edge.targetContract)
        const existing = reachableContracts.get(targetNorm)
        if (existing) {
          if (!newPathIsViewOnly) existing.viewOnlyPath = false
          existing.calledFunctions.add(edge.targetFunction)
          // Multiple paths: keep the maximum cap (least restrictive wins).
          // If any path is uncapped (undefined), the contract is uncapped.
          if (
            existing.effectiveCapUsd !== undefined &&
            newPathCap !== undefined
          ) {
            existing.effectiveCapUsd = Math.max(
              existing.effectiveCapUsd,
              newPathCap,
            )
          } else {
            existing.effectiveCapUsd = undefined // uncapped path found
          }
        } else {
          reachableContracts.set(targetNorm, {
            contractName: this.contractNameMap.get(targetNorm) ?? 'Unknown',
            viewOnlyPath: newPathIsViewOnly,
            calledFunctions: new Set([edge.targetFunction]),
            effectiveCapUsd: newPathCap,
          })
        }

        // BFS queue uses original addresses for correct edge lookup
        queue.push({
          contract: edge.targetContract,
          function: edge.targetFunction,
          pathIsViewOnly: newPathIsViewOnly,
          pathCapUsd: newPathCap,
        })
      }
    }

    return { reachableContracts, unresolvedCalls: [] }
  }

  /**
   * Get total funds (balances + positions) for a contract address.
   * Performs case-insensitive lookup.
   */
  getContractFunds(contractAddress: string): number {
    if (!this.fundsData?.contracts) return 0

    // Case-insensitive lookup
    const normalizedAddress = normalizeChainAddress(contractAddress)
    const fundsEntry = Object.entries(this.fundsData.contracts).find(
      ([key]) => normalizeChainAddress(key) === normalizedAddress,
    )

    if (!fundsEntry) return 0
    const funds = fundsEntry[1]

    return (
      (funds.balances?.totalUsdValue ?? 0) +
      (funds.positions?.totalUsdValue ?? 0)
    )
  }

  /**
   * Get token market cap for a contract address (from tokenInfo.tokenValue).
   * Returns 0 if the contract is not a token or has no token info.
   * Performs case-insensitive lookup.
   */
  getContractTokenValue(contractAddress: string): number {
    if (!this.fundsData?.contracts) return 0

    const normalizedAddress = normalizeChainAddress(contractAddress)
    const fundsEntry = Object.entries(this.fundsData.contracts).find(
      ([key]) => normalizeChainAddress(key) === normalizedAddress,
    )

    if (!fundsEntry) return 0
    const funds = fundsEntry[1]

    return funds.tokenInfo?.tokenValue ?? 0
  }

  /**
   * Analyze capital exposure for a single permissioned function.
   *
   * ownerAddress is used to resolve scoped impactCap mitigations: a mitigation
   * scoped to a specific admin/dependency only applies when that owner is the caller.
   */
  analyzeFunctionCapital(
    contractAddress: string,
    contractName: string,
    functionName: string,
    impact: Impact,
    ownerAddress?: string,
  ): FunctionCapitalAnalysis {
    // Get direct funds and token value in the contract containing this function
    // If function is explicitly marked no-impact, zero out direct funds
    const isNoImpact = this.functionIsNoImpact(contractAddress, functionName)

    // If function is explicitly marked no-impact, skip traversal entirely
    if (isNoImpact) {
      return {
        contractAddress,
        contractName,
        functionName,
        impact,
        directFundsUsd: 0,
        directTokenValueUsd: 0,
        reachableContracts: [],
        totalReachableFundsUsd: 0,
        totalReachableTokenValueUsd: 0,
        unresolvedCallsCount: 0,
      }
    }

    const directFundsUsd = this.getContractFunds(contractAddress)
    const directTokenValueUsd = this.getContractTokenValue(contractAddress)

    // Traverse enhanced graph (call graph + permission edges) from this function
    const traversalResult = this.traverseForward(
      contractAddress,
      functionName,
      ownerAddress,
    )

    // Build reachable contracts with funds
    const reachableContracts: ReachableContract[] = []

    for (const [addr, data] of traversalResult.reachableContracts) {
      // Skip self-reference (the starting contract, resolved to proxy by traverseForward)
      if (addressesEqual(addr, this.resolveToProxy(contractAddress))) continue

      const fundsUsd = this.getContractFunds(addr)
      const tokenValueUsd = this.getContractTokenValue(addr)
      const calledFunctions = Array.from(data.calledFunctions)

      // Only count funds as "at risk" if at least one called function has impact
      const fundsAtRisk = this.anyCalledFunctionHasImpact(
        addr,
        data.calledFunctions,
      )

      // Bake effectiveCapUsd into fundsUsd/tokenValueUsd so downstream
      // consumers (compiler, frontend) can sum values directly.
      const cappedFunds =
        data.effectiveCapUsd !== undefined
          ? Math.min(fundsUsd, data.effectiveCapUsd)
          : fundsUsd
      const cappedTokenValue =
        data.effectiveCapUsd !== undefined
          ? Math.min(tokenValueUsd, data.effectiveCapUsd)
          : tokenValueUsd

      reachableContracts.push({
        contractAddress: addr,
        contractName: data.contractName ?? 'Unknown',
        viewOnlyPath: data.viewOnlyPath,
        calledFunctions,
        fundsUsd: cappedFunds,
        tokenValueUsd: cappedTokenValue,
        fundsAtRisk,
        effectiveCapUsd: data.effectiveCapUsd,
      })
    }

    // Calculate totals from already-capped per-contract values.
    const totalReachableFundsUsd = reachableContracts.reduce(
      (sum, c) => (c.fundsAtRisk ? sum + c.fundsUsd : sum),
      0,
    )
    const totalReachableTokenValueUsd = reachableContracts.reduce(
      (sum, c) => (c.fundsAtRisk ? sum + c.tokenValueUsd : sum),
      0,
    )

    // Apply the function's own self-cap as a final ceiling on the grand total
    // (direct + reachable). If capped, reduce direct funds proportionally.
    const selfCap = this.getFunctionCap(
      contractAddress,
      functionName,
      ownerAddress,
    )
    let finalDirectFunds = directFundsUsd
    let finalDirectTokenValue = directTokenValueUsd
    let finalReachableFunds = totalReachableFundsUsd
    let finalReachableTokenValue = totalReachableTokenValueUsd
    if (selfCap !== undefined) {
      const grandFunds = directFundsUsd + totalReachableFundsUsd
      if (grandFunds > selfCap) {
        // Cap total to selfCap; reduce reachable first, then direct
        finalReachableFunds = Math.max(
          0,
          Math.min(grandFunds, selfCap) - directFundsUsd,
        )
        finalDirectFunds = Math.min(directFundsUsd, selfCap)
      }
      const grandToken = directTokenValueUsd + totalReachableTokenValueUsd
      if (grandToken > selfCap) {
        finalReachableTokenValue = Math.max(
          0,
          Math.min(grandToken, selfCap) - directTokenValueUsd,
        )
        finalDirectTokenValue = Math.min(directTokenValueUsd, selfCap)
      }
    }

    return {
      contractAddress,
      contractName,
      functionName,
      impact,
      isUpgrade: isUpgradeFunction(functionName) || undefined,
      directFundsUsd: finalDirectFunds,
      directTokenValueUsd: finalDirectTokenValue,
      reachableContracts,
      totalReachableFundsUsd: finalReachableFunds,
      totalReachableTokenValueUsd: finalReachableTokenValue,
      unresolvedCallsCount: 0,
      impactCapUsd: selfCap,
    }
  }

  /**
   * Analyze capital exposure for an admin across all their permissioned functions.
   */
  analyzeAdminCapital(admin: AdminDetail): AdminDetailWithCapital {
    const functionsWithCapital: FunctionCapitalAnalysis[] = []

    // Track unique contracts to avoid double-counting
    // Key: contract address (normalized), Value: whether funds are at risk
    const contractsAtRisk = new Map<string, boolean>()
    const directContracts = new Set<string>()

    // Analyze each function
    for (const func of admin.functions) {
      const isNoImpact = this.functionIsNoImpact(
        func.contractAddress,
        func.functionName,
      )

      const analysis = this.analyzeFunctionCapital(
        func.contractAddress,
        func.contractName,
        func.functionName,
        func.impact,
        admin.adminAddress,
      )

      // Carry mitigations from the admin function entry
      if (func.mitigations) {
        analysis.mitigations = func.mitigations
      }

      functionsWithCapital.push(analysis)

      // Track direct contracts (skip no-impact functions)
      if (!isNoImpact) {
        directContracts.add(this.resolveToProxy(func.contractAddress))
      }

      // Track reachable contracts - only mark as at risk if fundsAtRisk is true
      // Addresses are already proxy-resolved by traverseForward
      for (const reachable of analysis.reachableContracts) {
        const addr = normalizeChainAddress(reachable.contractAddress)
        const existingRisk = contractsAtRisk.get(addr)
        // If any path marks it as at risk, it stays at risk
        if (existingRisk === true || reachable.fundsAtRisk) {
          contractsAtRisk.set(addr, true)
        } else if (existingRisk === undefined) {
          contractsAtRisk.set(addr, reachable.fundsAtRisk)
        }
      }
    }

    // Calculate direct capital and token value
    let totalDirectCapital = 0
    let totalDirectTokenValue = 0
    for (const addr of directContracts) {
      totalDirectCapital += this.getContractFunds(addr)
      totalDirectTokenValue += this.getContractTokenValue(addr)
    }

    // Build per-contract effective cap across all functions.
    // If any function reaches a contract uncapped, it's fully exposed.
    // Otherwise take the max cap (least restrictive).
    const contractCaps = new Map<string, number | undefined>()
    for (const analysis of functionsWithCapital) {
      for (const rc of analysis.reachableContracts) {
        const addr = normalizeChainAddress(rc.contractAddress)
        const existing = contractCaps.get(addr)
        if (existing === undefined && contractCaps.has(addr)) {
          // Already marked as uncapped
          continue
        }
        if (rc.effectiveCapUsd === undefined) {
          contractCaps.set(addr, undefined) // uncapped
        } else if (existing !== undefined) {
          contractCaps.set(addr, Math.max(existing, rc.effectiveCapUsd))
        } else {
          contractCaps.set(addr, rc.effectiveCapUsd)
        }
      }
    }

    // Calculate reachable capital and token value (deduplicated)
    // Only count reachable contracts where fundsAtRisk is true
    // Apply effective caps when present
    let totalReachableCapital = totalDirectCapital
    let totalReachableTokenValue = totalDirectTokenValue
    for (const [addr, atRisk] of contractsAtRisk) {
      if (directContracts.has(addr) || !atRisk) continue
      const funds = this.getContractFunds(addr)
      const tokenVal = this.getContractTokenValue(addr)
      const cap = contractCaps.get(addr)
      if (cap !== undefined) {
        totalReachableCapital += Math.min(funds, cap)
        totalReachableTokenValue += Math.min(tokenVal, cap)
      } else {
        totalReachableCapital += funds
        totalReachableTokenValue += tokenVal
      }
    }

    // Count all affected contracts (for display purposes)
    const allAffectedContracts = new Set([
      ...directContracts,
      ...contractsAtRisk.keys(),
    ])

    return {
      ...admin,
      functionsWithCapital,
      totalDirectCapital,
      totalReachableCapital,
      totalDirectTokenValue,
      totalReachableTokenValue,
      uniqueContractsAffected: allAffectedContracts.size,
    }
  }

  /**
   * Check if there's any funds data available.
   */
  hasFundsData(): boolean {
    return Object.keys(this.fundsData?.contracts ?? {}).length > 0
  }
}
