import { diffLines } from 'diff'
import { countLines } from './normalize.js'

/** Line based similarity in 0..1: 2 * common / (linesA + linesB). */
export function lineSimilarity(a: string, b: string): number {
  const total = countLines(a) + countLines(b)
  if (total === 0) return 1
  let common = 0
  for (const change of diffLines(a, b, { ignoreWhitespace: true })) {
    if (!change.added && !change.removed) common += change.count ?? 0
  }
  return (2 * common) / total
}

/** Replaces a unit's own name so that renamed units can be compared. */
export function withNamePlaceholder(text: string, name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`\\b${escaped}\\b`, 'g'), '__UNIT__')
}
