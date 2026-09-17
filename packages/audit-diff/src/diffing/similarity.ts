import { diffLines } from 'diff'
import { countLines } from './normalize.js'

export interface LineMatchMetrics {
  /** Symmetric Dice similarity: 2 * common / (deployed + audited). */
  similarity: number
  /** Fraction of deployed lines present in the audited unit. */
  containment: number
}

export function lineMatchMetrics(
  deployed: string,
  audited: string,
): LineMatchMetrics {
  const deployedLines = countLines(deployed)
  const auditedLines = countLines(audited)
  const total = deployedLines + auditedLines
  if (total === 0) return { similarity: 1, containment: 1 }
  let common = 0
  for (const change of diffLines(deployed, audited, {
    ignoreWhitespace: true,
  })) {
    if (!change.added && !change.removed) common += change.count ?? 0
  }
  return {
    similarity: (2 * common) / total,
    containment: deployedLines === 0 ? 0 : common / deployedLines,
  }
}

/** Line based similarity in 0..1: 2 * common / (linesA + linesB). */
export function lineSimilarity(a: string, b: string): number {
  return lineMatchMetrics(a, b).similarity
}

/** Replaces a unit's own name so that renamed units can be compared. */
export function withNamePlaceholder(text: string, name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`\\b${escaped}\\b`, 'g'), '__UNIT__')
}
