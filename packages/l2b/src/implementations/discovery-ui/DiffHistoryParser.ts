export type DiffHistorySectionKind =
  | 'watched-changes'
  | 'initial-discovery'
  | 'source-code-changes'
  | 'config-related-changes'

export interface DiffHistorySection {
  kind: DiffHistorySectionKind
  body: string
}

export interface DiffHistoryEntry {
  date: string
  timestamp: number | null
  author: string | null
  comparing: { ref: string; commit: string; block: number } | null
  discoveryHash: string | null
  description: string
  sections: DiffHistorySection[]
}

const HASH_LINE_PREFIX = 'Generated with discovered.json: '
const ENTRY_HEADER_RE = /^# Diff at (.+):\s*$/
const COMPARING_RE = /^(\S+)@([0-9a-fA-F]+)\s+block:\s+(\d+)$/

const SECTION_HEADERS: Record<string, DiffHistorySectionKind> = {
  '## Watched changes': 'watched-changes',
  '## Initial discovery': 'initial-discovery',
  '## Source code changes': 'source-code-changes',
  '## Config/verification related changes': 'config-related-changes',
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
    let comparing: DiffHistoryEntry['comparing'] = null
    let timestamp: number | null = null
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
          comparing = {
            ref: m[1] ?? '',
            commit: m[2] ?? '',
            block: Number(m[3] ?? '0'),
          }
        }
      } else if (line.startsWith('- current timestamp:')) {
        const num = Number(line.slice('- current timestamp:'.length).trim())
        if (Number.isFinite(num)) {
          timestamp = num
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
      if (line === '## Description') {
        const start = i + 1
        const j = sectionEnd(start)
        description = bodyLines.slice(start, j).join('\n').trim()
        i = j
        continue
      }
      const kind = SECTION_HEADERS[line]
      if (kind !== undefined) {
        const start = i + 1
        const j = sectionEnd(start)
        const body = bodyLines.slice(start, j).join('\n').trim()
        sections.push({ kind, body })
        i = j
        continue
      }
      i++
    }

    return {
      date,
      timestamp,
      author,
      comparing,
      discoveryHash,
      description,
      sections,
    }
  }
}
