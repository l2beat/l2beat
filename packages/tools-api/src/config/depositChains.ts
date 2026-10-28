import type { Address } from './types'

// An OP stack SystemConfig names its OptimismPortal and the chain id of its
// L2, which is where deposits made through that portal execute.
export function getDepositChains(
  entries: { values?: Record<string, unknown> }[],
): Record<Address, number> {
  const result: Record<Address, number> = {}
  for (const entry of entries) {
    const portal = entry.values?.optimismPortal
    const l2ChainId = entry.values?.l2ChainId
    if (
      typeof portal === 'string' &&
      /^\w+:0x[\da-f]{40}$/i.test(portal) &&
      typeof l2ChainId === 'number' &&
      Number.isSafeInteger(l2ChainId) &&
      l2ChainId > 0
    ) {
      result[portal.toLowerCase() as Address] = l2ChainId
    }
  }
  return result
}
