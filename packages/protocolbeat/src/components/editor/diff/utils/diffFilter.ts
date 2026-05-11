import { clamp } from '@l2beat/shared-pure'
import { type Token, tokenizeSolidity } from './tokenizeSolidity'

export interface LineRange {
  startLineNumber: number
  endLineNumberExclusive: number
}

export interface LineRangeMapping {
  original: LineRange
  modified: LineRange
}

export type ChangeDecision =
  | { kind: 'keep' }
  | { kind: 'drop' }
  | { kind: 'narrow'; original: LineRange; modified: LineRange }

export function decideChanges(
  changes: LineRangeMapping[],
  originalSource: string,
  modifiedSource: string,
  considerComments: boolean,
): ChangeDecision[] {
  if (changes.length === 0) {
    return []
  }

  const originalTokens = tokenizeSolidity(originalSource)
  const modifiedTokens = tokenizeSolidity(modifiedSource)

  return changes.map((change) =>
    decideChange(change, originalTokens, modifiedTokens, considerComments),
  )
}

function decideChange(
  change: LineRangeMapping,
  originalTokens: Token[],
  modifiedTokens: Token[],
  considerComments: boolean,
): ChangeDecision {
  const left = effectiveTokens(
    tokensInRange(
      originalTokens,
      change.original.startLineNumber,
      change.original.endLineNumberExclusive,
    ),
    considerComments,
  )
  const right = effectiveTokens(
    tokensInRange(
      modifiedTokens,
      change.modified.startLineNumber,
      change.modified.endLineNumberExclusive,
    ),
    considerComments,
  )

  const narrowed = narrowChange(change, left, right)
  if (narrowed === null) {
    return { kind: 'drop' }
  }
  if (rangesEqual(narrowed, change)) {
    return { kind: 'keep' }
  }
  return { kind: 'narrow', original: narrowed.original, modified: narrowed.modified }
}

export function tokensInRange(
  tokens: Token[],
  startLine: number,
  endLineExclusive: number,
): Token[] {
  const result: Token[] = []
  for (const token of tokens) {
    if (token.startLine >= endLineExclusive) {
      break
    }
    if (token.endLine >= startLine) {
      result.push(token)
    }
  }
  return result
}

export function effectiveTokens(
  tokens: Token[],
  considerComments: boolean,
): Token[] {
  if (considerComments) {
    return tokens
  }
  return tokens.filter((t) => t.type !== 'comment')
}

export function narrowChange(
  change: LineRangeMapping,
  left: Token[],
  right: Token[],
): LineRangeMapping | null {
  let prefix = 0
  const maxPrefix = Math.min(left.length, right.length)
  while (prefix < maxPrefix && tokenMatches(left[prefix], right[prefix])) {
    prefix++
  }

  let suffix = 0
  const maxSuffix = maxPrefix - prefix
  while (
    suffix < maxSuffix &&
    tokenMatches(
      left[left.length - 1 - suffix],
      right[right.length - 1 - suffix],
    )
  ) {
    suffix++
  }

  const leftSurvivors = left.slice(prefix, left.length - suffix)
  const rightSurvivors = right.slice(prefix, right.length - suffix)

  if (leftSurvivors.length === 0 && rightSurvivors.length === 0) {
    return null
  }

  return {
    original: projectRange(leftSurvivors, left, prefix, change.original),
    modified: projectRange(rightSurvivors, right, prefix, change.modified),
  }
}

function tokenMatches(a: Token | undefined, b: Token | undefined): boolean {
  if (a === undefined || b === undefined) {
    return false
  }
  return a.type === b.type && a.content === b.content
}

export function projectRange(
  survivors: Token[],
  all: Token[],
  prefix: number,
  fallback: LineRange,
): LineRange {
  // All output line numbers are clamped to `fallback`. A multiline token
  // (block comment, multiline string) that straddles the change boundary
  // would otherwise project to lines outside the original Monaco range.
  if (survivors.length === 0) {
    const rawAnchor =
      prefix > 0
        ? (all[prefix - 1] as Token).endLine + 1
        : fallback.startLineNumber
    const anchor = clamp(
      rawAnchor,
      fallback.startLineNumber,
      fallback.endLineNumberExclusive,
    )
    return { startLineNumber: anchor, endLineNumberExclusive: anchor }
  }
  const first = survivors[0] as Token
  const last = survivors[survivors.length - 1] as Token
  return {
    startLineNumber: clamp(
      first.startLine,
      fallback.startLineNumber,
      fallback.endLineNumberExclusive,
    ),
    endLineNumberExclusive: clamp(
      last.endLine + 1,
      fallback.startLineNumber,
      fallback.endLineNumberExclusive,
    ),
  }
}

function rangesEqual(a: LineRangeMapping, b: LineRangeMapping): boolean {
  return (
    a.original.startLineNumber === b.original.startLineNumber &&
    a.original.endLineNumberExclusive === b.original.endLineNumberExclusive &&
    a.modified.startLineNumber === b.modified.startLineNumber &&
    a.modified.endLineNumberExclusive === b.modified.endLineNumberExclusive
  )
}
