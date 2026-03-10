import type { CompiledDependencyFunction } from '../types'

/**
 * Compute per-function funds from the compiled dependency function data.
 * Sums direct funds + reachable contract funds.
 */
export function getDepFunctionFunds(fn: CompiledDependencyFunction): number {
  let total = fn.directFundsUsd
  for (const rc of fn.reachableContracts) {
    total += rc.fundsUsd
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
