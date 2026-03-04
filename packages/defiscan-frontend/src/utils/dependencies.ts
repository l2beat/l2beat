import type { CompiledReview, CompiledDependency } from '../types'

/**
 * Build a per-function map of contract → funds from admin data.
 *
 * Key: "contractAddress:functionName" (lowercase)
 * Value: Map<contractAddress, fundsUsd> — the unique contracts whose funds
 * are exposed through this function (its own contract + reachable contracts).
 */
export function buildFunctionContractFundsMap(
  review: CompiledReview,
): Map<string, Map<string, number>> {
  const map = new Map<string, Map<string, number>>()
  for (const admin of review.admins) {
    for (const fn of admin.functions) {
      const key = `${fn.contractAddress.toLowerCase()}:${fn.functionName}`
      const existing = map.get(key)
      const contracts = existing ?? new Map<string, number>()

      // Direct funds (the contract the function lives on)
      if (fn.directFundsUsd > 0) {
        const addr = fn.contractAddress.toLowerCase()
        contracts.set(addr, Math.max(contracts.get(addr) ?? 0, fn.directFundsUsd))
      }

      // Reachable contracts with funds at risk
      for (const rc of fn.reachableContracts) {
        if (!rc.fundsAtRisk || rc.fundsUsd <= 0) continue
        const addr = rc.address.toLowerCase()
        contracts.set(addr, Math.max(contracts.get(addr) ?? 0, rc.fundsUsd))
      }

      map.set(key, contracts)
    }
  }
  return map
}

/**
 * Compute deduplicated funds at risk through a dependency.
 *
 * Collects all unique contracts-with-funds across every caller function,
 * deduplicating by contract address so the same contract isn't counted twice
 * when multiple functions share it.
 */
export function computeDepFundsAtRisk(
  dep: CompiledDependency,
  fnContractMap: Map<string, Map<string, number>>,
): number {
  // Merge all contract → funds across caller functions
  const merged = new Map<string, number>()
  for (const fn of dep.functions) {
    const key = `${fn.contractAddress.toLowerCase()}:${fn.functionName}`
    const contracts = fnContractMap.get(key)
    if (!contracts) continue
    for (const [addr, funds] of contracts) {
      merged.set(addr, Math.max(merged.get(addr) ?? 0, funds))
    }
  }

  let total = 0
  for (const funds of merged.values()) {
    total += funds
  }
  return total
}

/**
 * Compute per-function funds (still useful for the function breakdown table).
 * This DOES double-count across functions on purpose — it shows each
 * function's individual exposure.
 */
export function getFunctionFunds(
  contractAddress: string,
  functionName: string,
  fnContractMap: Map<string, Map<string, number>>,
): number {
  const key = `${contractAddress.toLowerCase()}:${functionName}`
  const contracts = fnContractMap.get(key)
  if (!contracts) return 0
  let total = 0
  for (const funds of contracts.values()) {
    total += funds
  }
  return total
}

/**
 * Count dependencies grouped by entity.
 * Dependencies with an entity are counted once per unique entity.
 * Dependencies without an entity are counted individually.
 */
export function computeEntityDependencyCount(
  dependencies: { entity: string | null }[],
): number {
  const entities = new Set<string>()
  let ungrouped = 0
  for (const dep of dependencies) {
    if (dep.entity) entities.add(dep.entity)
    else ungrouped++
  }
  return entities.size + ungrouped
}
