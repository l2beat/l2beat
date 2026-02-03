import { CallGraphTraverser } from './callGraphTraversal'
import type {
  AdminDetail,
  AdminDetailWithCapital,
  ApiCallGraphResponse,
  ApiFunctionsResponse,
  ApiFundsDataResponse,
  FunctionCapitalAnalysis,
  Impact,
  ReachableContract,
} from './types'

/**
 * CapitalAnalysisCalculator combines call graph traversal with funds data
 * to calculate the total capital at risk for each admin.
 *
 * IMPORTANT: Only counts a contract's funds as "at risk" if:
 * 1. The contract is reachable via call graph from a permissioned function
 * 2. At least one function called on that contract has an impact score (not unscored)
 */
export class CapitalAnalysisCalculator {
  private traverser: CallGraphTraverser
  private fundsData: ApiFundsDataResponse
  private callGraphData: ApiCallGraphResponse
  private functionsData: ApiFunctionsResponse

  constructor(
    callGraphData: ApiCallGraphResponse,
    fundsData: ApiFundsDataResponse,
    functionsData: ApiFunctionsResponse,
  ) {
    this.callGraphData = callGraphData
    this.fundsData = fundsData
    this.functionsData = functionsData
    this.traverser = new CallGraphTraverser(callGraphData)
  }

  /**
   * Check if a function on a contract has an impact score (not unscored).
   * Returns true if the function has a real impact score, regardless of permissioned status.
   * A non-permissioned function with high impact still represents funds at risk when called.
   */
  private functionHasImpact(
    contractAddress: string,
    functionName: string,
  ): boolean {
    // Case-insensitive lookup for the contract
    const normalizedAddress = contractAddress.toLowerCase()
    const contractEntry = Object.entries(
      this.functionsData.contracts ?? {},
    ).find(([key]) => key.toLowerCase() === normalizedAddress)

    if (!contractEntry) return false
    const contractFunctions = contractEntry[1]

    // Find the function
    const func = contractFunctions.functions.find(
      (f) => f.functionName === functionName,
    )

    if (!func) return false

    // Check if it has a real impact score (not unscored or undefined)
    // Note: We don't check isPermissioned here - a function with high impact
    // is still risky regardless of whether it's permissioned
    return func.score !== undefined && func.score !== 'unscored'
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
   * Get total funds (balances + positions) for a contract address.
   * Performs case-insensitive lookup.
   */
  getContractFunds(contractAddress: string): number {
    if (!this.fundsData?.contracts) return 0

    // Case-insensitive lookup
    const normalizedAddress = contractAddress.toLowerCase()
    const fundsEntry = Object.entries(this.fundsData.contracts).find(
      ([key]) => key.toLowerCase() === normalizedAddress,
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

    const normalizedAddress = contractAddress.toLowerCase()
    const fundsEntry = Object.entries(this.fundsData.contracts).find(
      ([key]) => key.toLowerCase() === normalizedAddress,
    )

    if (!fundsEntry) return 0
    const funds = fundsEntry[1]

    return funds.tokenInfo?.tokenValue ?? 0
  }

  /**
   * Analyze capital exposure for a single permissioned function.
   */
  analyzeFunctionCapital(
    contractAddress: string,
    contractName: string,
    functionName: string,
    impact: Impact,
  ): FunctionCapitalAnalysis {
    // Get direct funds and token value in the contract containing this function
    const directFundsUsd = this.getContractFunds(contractAddress)
    const directTokenValueUsd = this.getContractTokenValue(contractAddress)

    // Traverse call graph from this function
    const traversalResult = this.traverser.traverseFromFunction(
      contractAddress,
      functionName,
      true, // Include view calls
    )

    // Build reachable contracts with funds
    const reachableContracts: ReachableContract[] = []

    for (const [addr, data] of traversalResult.reachableContracts) {
      // Skip self-reference (the starting contract)
      if (addr.toLowerCase() === contractAddress.toLowerCase()) continue

      const fundsUsd = this.getContractFunds(addr)
      const tokenValueUsd = this.getContractTokenValue(addr)
      const calledFunctions = Array.from(data.calledFunctions)

      // Only count funds as "at risk" if at least one called function has impact
      const fundsAtRisk = this.anyCalledFunctionHasImpact(
        addr,
        data.calledFunctions,
      )

      reachableContracts.push({
        contractAddress: addr,
        contractName: data.contractName ?? 'Unknown',
        viewOnlyPath: data.viewOnlyPath,
        calledFunctions,
        fundsUsd,
        tokenValueUsd,
        fundsAtRisk,
      })
    }

    // Calculate totals - only count where fundsAtRisk is true
    const totalReachableFundsUsd = reachableContracts.reduce(
      (sum, c) => (c.fundsAtRisk ? sum + c.fundsUsd : sum),
      0,
    )
    const totalReachableTokenValueUsd = reachableContracts.reduce(
      (sum, c) => (c.fundsAtRisk ? sum + c.tokenValueUsd : sum),
      0,
    )

    return {
      contractAddress,
      contractName,
      functionName,
      impact,
      directFundsUsd,
      directTokenValueUsd,
      reachableContracts,
      totalReachableFundsUsd,
      totalReachableTokenValueUsd,
      unresolvedCallsCount: traversalResult.unresolvedCalls.length,
    }
  }

  /**
   * Analyze capital exposure for an admin across all their permissioned functions.
   */
  analyzeAdminCapital(admin: AdminDetail): AdminDetailWithCapital {
    const functionsWithCapital: FunctionCapitalAnalysis[] = []

    // Track unique contracts to avoid double-counting
    // Key: contract address (lowercase), Value: whether funds are at risk
    const contractsAtRisk = new Map<string, boolean>()
    const directContracts = new Set<string>()

    // Analyze each function
    for (const func of admin.functions) {
      // Check if we have call graph data for this contract
      const hasCallGraphData =
        this.callGraphData.contracts[func.contractAddress] !== undefined ||
        Object.keys(this.callGraphData.contracts).some(
          (addr) => addr.toLowerCase() === func.contractAddress.toLowerCase(),
        )

      if (!hasCallGraphData) {
        // No call graph data - just track direct capital
        directContracts.add(func.contractAddress.toLowerCase())
        continue
      }

      const analysis = this.analyzeFunctionCapital(
        func.contractAddress,
        func.contractName,
        func.functionName,
        func.impact,
      )

      functionsWithCapital.push(analysis)

      // Track direct contracts (always counted since the permissioned function has impact)
      directContracts.add(func.contractAddress.toLowerCase())

      // Track reachable contracts - only mark as at risk if fundsAtRisk is true
      for (const reachable of analysis.reachableContracts) {
        const addr = reachable.contractAddress.toLowerCase()
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

    // Calculate reachable capital and token value (deduplicated)
    // Only count reachable contracts where fundsAtRisk is true
    let totalReachableCapital = totalDirectCapital
    let totalReachableTokenValue = totalDirectTokenValue
    for (const [addr, atRisk] of contractsAtRisk) {
      if (directContracts.has(addr) || !atRisk) continue
      totalReachableCapital += this.getContractFunds(addr)
      totalReachableTokenValue += this.getContractTokenValue(addr)
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
   * Check if there's any call graph data available.
   */
  hasCallGraphData(): boolean {
    return Object.keys(this.callGraphData.contracts).length > 0
  }

  /**
   * Check if there's any funds data available.
   */
  hasFundsData(): boolean {
    return Object.keys(this.fundsData?.contracts ?? {}).length > 0
  }
}
