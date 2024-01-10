import { AssessCount } from '../layer2s/types'

export const subtractOne: AssessCount = (count) => count - 1

export function subtractOneAfterBlockInclusive(
  blockNumber: number,
): AssessCount {
  return (count: number, block: number) =>
    block >= blockNumber ? count - 1 : count
}
