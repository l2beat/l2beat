import { type Difference, diff } from '@l2beat/shared'
import { normalize } from './normalize'
import { pairDeclarations } from './pairDeclarations'
import type { Rule } from './rules'

export interface SolidityDiff {
  differences: Difference[]
}

export function diffSolidity(
  before: string,
  after: string,
  rules: Rule[],
): SolidityDiff {
  const left = normalize(before, rules)
  const right = normalize(after, rules)
  pairDeclarations(left, right)
  return { differences: diff(left, right) }
}
