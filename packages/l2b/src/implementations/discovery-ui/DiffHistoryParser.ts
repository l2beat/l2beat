export type DiffHistorySectionKind =
  | 'watched-changes'
  | 'initial-discovery'
  | 'source-code-changes'
  | 'config-related-changes'

export interface DiffHistorySection {
  kind: DiffHistorySectionKind
  body: string
}

// Older diff histories used block numbers, newer ones use unix timestamps.
// Discriminated so consumers must handle both.
export type ChainPoint =
  | { kind: 'timestamp'; value: number }
  | { kind: 'block'; value: number }

/**
 * @notice Do not add support for any more legacy edge cases
 * Just unify all legacy cases into single format is possible
 */
export interface DiffHistoryEntry {
  date: string
  current: ChainPoint | null
  author: string | null
  comparing: {
    ref: string
    commit: string
    at: ChainPoint | null
  } | null
  discoveryHash: string | null
  description: string
  sections: DiffHistorySection[]
}

const HASH_LINE_PREFIX = 'Generated with discovered.json: '
const ENTRY_HEADER_RE = /^# Diff at (.+):\s*$/
// `block: N` is optional — some older entries omit it.
const COMPARING_RE = /^(\S+)@([0-9a-fA-F]+)(?:\s+block:\s+(\d+))?$/

const SECTION_HEADERS: Record<string, DiffHistorySectionKind> = {
  '## Watched changes': 'watched-changes',
  '## Initial discovery': 'initial-discovery',
  '## Source code changes': 'source-code-changes',
  '## Config/verification related changes': 'config-related-changes',
  // Older diff histories used a shorter heading; recognize it too.
  '## Config related changes': 'config-related-changes',
}

export class DiffHistoryParser {
  parse(content: string): DiffHistoryEntry[] {
    const lines = content.split('\n')
    const entries: DiffHistoryEntry[] = []
    let pendingHash: string | null = null
    let i = 0
    while (i < lines.length) {
      const line = lines[i] ?? ''
      if (line.startsWith(HASH_LINE_PREFIX)) {
        pendingHash = line.slice(HASH_LINE_PREFIX.length).trim()
        i++
        continue
      }
      const headerMatch = line.match(ENTRY_HEADER_RE)
      if (headerMatch) {
        const date = (headerMatch[1] ?? '').trim()
        let j = i + 1
        while (j < lines.length) {
          const l = lines[j] ?? ''
          if (l.match(ENTRY_HEADER_RE) || l.startsWith(HASH_LINE_PREFIX)) {
            break
          }
          j++
        }
        entries.push(this.parseEntry(date, pendingHash, lines.slice(i + 1, j)))
        pendingHash = null
        i = j
        continue
      }
      i++
    }
    return entries
  }

  private parseEntry(
    date: string,
    discoveryHash: string | null,
    bodyLines: string[],
  ): DiffHistoryEntry {
    let author: string | null = null
    let comparingRef: string | null = null
    let comparingCommit = ''
    let comparingValue: number | null = null
    let kind: ChainPoint['kind'] | null = null
    let currentValue: number | null = null
    let description = ''
    const sections: DiffHistorySection[] = []

    let i = 0
    // Metadata lines come before the first '## '
    while (i < bodyLines.length) {
      const line = bodyLines[i] ?? ''
      if (line.startsWith('## ')) break
      if (line.startsWith('- author:')) {
        author = line.slice('- author:'.length).trim()
      } else if (line.startsWith('- comparing to:')) {
        const rest = line.slice('- comparing to:'.length).trim()
        const m = rest.match(COMPARING_RE)
        if (m) {
          comparingRef = m[1] ?? ''
          comparingCommit = m[2] ?? ''
          const blockStr = m[3]
          comparingValue = blockStr !== undefined ? Number(blockStr) : null
        }
      } else if (line.startsWith('- current timestamp:')) {
        const num = Number(line.slice('- current timestamp:'.length).trim())
        if (Number.isFinite(num)) {
          kind = 'timestamp'
          currentValue = num
        }
      } else if (line.startsWith('- current block number:')) {
        const num = Number(line.slice('- current block number:'.length).trim())
        if (Number.isFinite(num)) {
          kind = 'block'
          currentValue = num
        }
      }
      i++
    }

    while (i < bodyLines.length) {
      const line = bodyLines[i] ?? ''
      const sectionEnd = (j: number) => {
        while (
          j < bodyLines.length &&
          !(bodyLines[j] ?? '').startsWith('## ')
        ) {
          j++
        }
        return j
      }
      const trimmed = line.trimEnd()
      if (trimmed === '## Description') {
        const start = i + 1
        const j = sectionEnd(start)
        description = bodyLines.slice(start, j).join('\n').trim()
        i = j
        continue
      }
      const sectionKind = SECTION_HEADERS[trimmed]
      if (sectionKind !== undefined) {
        const start = i + 1
        const j = sectionEnd(start)
        const body = bodyLines.slice(start, j).join('\n').trim()
        sections.push({ kind: sectionKind, body })
        i = j
        continue
      }
      i++
    }

    const current: ChainPoint | null =
      kind !== null && currentValue !== null
        ? { kind, value: currentValue }
        : null

    let comparing: DiffHistoryEntry['comparing'] = null
    if (comparingRef !== null) {
      // Comparing's value (if any) shares the entry's kind. Default to 'block'
      // when only the comparing line is present (the literal label says block).
      const at: ChainPoint | null =
        comparingValue !== null
          ? { kind: kind ?? 'block', value: comparingValue }
          : null
      comparing = { ref: comparingRef, commit: comparingCommit, at }
    }

    return {
      date,
      current,
      author,
      comparing,
      discoveryHash,
      description,
      sections,
    }
  }
}
