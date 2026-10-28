import type { CountedTransaction } from './api'

export function compareTransactions(
  a: CountedTransaction,
  b: CountedTransaction,
): number {
  if (a.operationsCount !== b.operationsCount) {
    return b.operationsCount - a.operationsCount
  }
  if (!!a.details !== !!b.details) {
    return a.details ? -1 : 1
  }
  if (a.type === b.type) {
    return 0
  }
  if (a.type === 'unknown') {
    return 1
  }
  if (b.type === 'unknown') {
    return -1
  }
  if (isStandardType(a.type) !== isStandardType(b.type)) {
    return isStandardType(a.type) ? -1 : 1
  }
  return a.type.localeCompare(b.type)
}

function isStandardType(type: string): boolean {
  return type.startsWith('ERC') || type.startsWith('EIP-712')
}
