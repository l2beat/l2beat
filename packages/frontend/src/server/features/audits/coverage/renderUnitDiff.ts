import type { AuditsDiffHunk, AuditsDiffLine } from '../types'

/**
 * Renders the diff of one unit from the spans `l2b audit-coverage` stores:
 * every deployed line in order, marked added when it falls inside `added`,
 * with each `removed` group of audited lines placed before the deployed line
 * it precedes. Spans are relative to the unit's first line; `deployedStart`
 * and `auditedStart` are the absolute first lines used for numbering.
 */
export function renderUnitDiff(
  deployed: string[],
  audited: string[],
  added: [number, number][],
  removed: [number, number, number][],
  deployedStart: number,
  auditedStart: number,
): AuditsDiffLine[] {
  const addedSet = new Set<number>()
  for (const [first, last] of added) {
    for (let i = first; i <= last; i++) addedSet.add(i)
  }
  const removedBefore = new Map<number, [number, number][]>()
  for (const [before, first, last] of removed) {
    const groups = removedBefore.get(before) ?? []
    groups.push([first, last])
    removedBefore.set(before, groups)
  }

  const lines: AuditsDiffLine[] = []
  let oldLine = 0
  const emitRemoved = (before: number) => {
    for (const [first, last] of removedBefore.get(before) ?? []) {
      for (let i = first; i <= last; i++) {
        lines.push({
          type: '-',
          oldLine: auditedStart + i,
          text: audited[i] ?? '',
        })
      }
      oldLine = last + 1
    }
  }

  for (let i = 0; i < deployed.length; i++) {
    emitRemoved(i)
    if (addedSet.has(i)) {
      lines.push({
        type: '+',
        newLine: deployedStart + i,
        text: deployed[i] ?? '',
      })
    } else {
      lines.push({
        type: ' ',
        oldLine: auditedStart + oldLine,
        newLine: deployedStart + i,
        text: deployed[i] ?? '',
      })
      oldLine++
    }
  }
  emitRemoved(deployed.length)
  return lines
}

/** Groups diff lines into hunks with `context` unchanged lines around changes. */
export function toHunks(
  lines: AuditsDiffLine[],
  context = 3,
): AuditsDiffHunk[] {
  const keep = new Array<boolean>(lines.length).fill(false)
  lines.forEach((line, i) => {
    if (line.type === ' ') return
    for (
      let j = Math.max(0, i - context);
      j <= Math.min(lines.length - 1, i + context);
      j++
    ) {
      keep[j] = true
    }
  })
  const hunks: AuditsDiffHunk[] = []
  let current: AuditsDiffHunk | undefined
  lines.forEach((line, i) => {
    if (!keep[i]) {
      current = undefined
      return
    }
    if (!current) {
      current = {
        oldStart: line.oldLine ?? nextOldLine(lines, i),
        newStart: line.newLine ?? nextNewLine(lines, i),
        lines: [],
      }
      hunks.push(current)
    }
    current.lines.push(line)
  })
  return hunks
}

function nextOldLine(lines: AuditsDiffLine[], from: number): number {
  for (let i = from; i < lines.length; i++) {
    const value = lines[i]?.oldLine
    if (value !== undefined) return value
  }
  return 0
}

function nextNewLine(lines: AuditsDiffLine[], from: number): number {
  for (let i = from; i < lines.length; i++) {
    const value = lines[i]?.newLine
    if (value !== undefined) return value
  }
  return 0
}
