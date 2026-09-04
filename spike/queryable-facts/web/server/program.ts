// Parses the concatenated Soufflé program into sections, declarations and clauses, keeping the
// comments that precede each item: the explorer renders rules as commented cards, not as raw text.

import type {
  Column,
  Program,
  ProgramClause,
  ProgramDecl,
  ProgramItem,
  RelationInfo,
} from '../shared/types'

const FILE_MARKER = /^\/\/ ----- (\S+) -----$/
const BANNER = /^\/\/ [-=]{5,}\s*$/

function parseColumns(text: string): Column[] {
  return text
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [name = '', type = 'symbol'] = part.split(':').map((s) => s.trim())
      return { name, type }
    })
}

/** Strips a trailing `// comment` that is not inside a string literal. */
function stripInlineComment(line: string): string {
  let inString = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') inString = !inString
    else if (!inString && c === '/' && line[i + 1] === '/')
      return line.slice(0, i)
  }
  return line
}

export function parseProgram(text: string): Program {
  const lines = text.split('\n')
  const items: ProgramItem[] = []
  const relations = new Map<string, RelationInfo>()
  let file = 'program.dl'
  let section = ''
  let pending: string[] = []
  let i = 0

  const flushComment = (): string => {
    const comment = pending.join('\n')
    pending = []
    return comment
  }

  while (i < lines.length) {
    const raw = lines[i] ?? ''
    const line = raw.trim()
    const marker = FILE_MARKER.exec(line)
    if (marker?.[1]) {
      file = marker[1]
      pending = []
      i++
      continue
    }
    if (BANNER.test(line)) {
      // `// ---- \n // Title \n // more \n // ----`: a section header.
      const start = i
      const body: string[] = []
      i++
      while (i < lines.length && !BANNER.test((lines[i] ?? '').trim())) {
        body.push((lines[i] ?? '').trim().replace(/^\/\/ ?/, ''))
        i++
      }
      i++ // closing banner
      const [title = '', ...rest] = body
      section = title.replace(/\.$/, '')
      items.push({
        kind: 'section',
        title: section,
        text: rest.join('\n').trim(),
        line: start + 1,
        file,
      })
      pending = []
      continue
    }
    if (line === '') {
      pending = []
      i++
      continue
    }
    if (line.startsWith('//')) {
      pending.push(line.replace(/^\/\/ ?/, ''))
      i++
      continue
    }
    const decl = /^\.decl\s+(\w+)\s*\((.*)\)\s*$/.exec(line)
    if (decl) {
      const relation = decl[1] ?? ''
      const columns = parseColumns(decl[2] ?? '')
      const comment = flushComment()
      const item: ProgramDecl = {
        kind: 'decl',
        relation,
        columns,
        comment,
        line: i + 1,
        file,
      }
      items.push(item)
      relations.set(relation, {
        name: relation,
        columns,
        comment,
        file,
        line: i + 1,
        isInput: false,
        isOutput: false,
        clauseCount: 0,
        section,
      })
      i++
      continue
    }
    const io = /^\.(input|output)\s+(\w+)/.exec(line)
    if (io) {
      const info = relations.get(io[2] ?? '')
      if (info) {
        if (io[1] === 'input') info.isInput = true
        else info.isOutput = true
      }
      pending = []
      i++
      continue
    }
    if (line.startsWith('.')) {
      // any other directive (.type, .plan, ...): skip
      pending = []
      i++
      continue
    }
    // A clause: accumulate until a line ends with "." outside comments.
    const start = i
    const chunk: string[] = []
    while (i < lines.length) {
      const current = lines[i] ?? ''
      chunk.push(current)
      i++
      if (stripInlineComment(current).trimEnd().endsWith('.')) break
    }
    const clauseText = chunk.join('\n')
    const head = /^\s*(\w+)\s*\(/.exec(clauseText)?.[1] ?? ''
    const item: ProgramClause = {
      kind: 'clause',
      head,
      text: clauseText,
      comment: flushComment(),
      line: start + 1,
      endLine: i,
      file,
    }
    items.push(item)
    const info = relations.get(head)
    if (info) info.clauseCount++
  }
  return { text, items, relations: [...relations.values()] }
}
