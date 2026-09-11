// Parses a Soufflé program (one or several rule files concatenated with `// ----- <file> -----`
// markers) into sections, declarations and clauses, keeping the comments that precede each item.
// The library screen renders relations as commented cards from this; the agent's catalogue is
// built from the same structure.

export interface Column {
  name: string
  type: string
}

export interface ProgramSection {
  kind: 'section'
  title: string
  text: string
  line: number
  file: string
}

export interface ProgramDecl {
  kind: 'decl'
  relation: string
  columns: Column[]
  comment: string
  line: number
  file: string
}

export interface ProgramClause {
  kind: 'clause'
  head: string
  text: string
  comment: string
  line: number
  endLine: number
  file: string
}

export type ProgramItem = ProgramSection | ProgramDecl | ProgramClause

export interface RelationInfo {
  name: string
  columns: Column[]
  comment: string
  file: string
  line: number
  isInput: boolean
  isOutput: boolean
  clauseCount: number
  /** Title of the section banner the declaration sits under (e.g. "Layer 4: state writes"). */
  section: string
}

export interface Program {
  text: string
  items: ProgramItem[]
  relations: RelationInfo[]
}

const FILE_MARKER = /^\/\/ ----- (\S+) -----$/
const BANNER = /^\/\/ [-=]{5,}\s*$/

export function parseColumns(text: string): Column[] {
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
export function stripInlineComment(line: string): string {
  let inString = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') inString = !inString
    else if (!inString && c === '/' && line[i + 1] === '/')
      return line.slice(0, i)
  }
  return line
}

export function withMarker(file: string, text: string): string {
  return `// ----- ${file} -----\n${text}`
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
    // a declaration may span several lines: join until the parentheses close
    let declText = line
    if (line.startsWith('.decl')) {
      let j = i
      while (
        !/\)\s*$/.test(stripInlineComment(declText).trimEnd()) &&
        j + 1 < lines.length
      ) {
        j++
        declText = `${declText} ${(lines[j] ?? '').trim()}`
      }
      if (j > i) {
        lines.splice(i, j - i + 1, declText)
      }
    }
    const decl = /^\.decl\s+(\w+)\s*\((.*)\)\s*$/.exec(
      stripInlineComment(declText).trim(),
    )
    if (decl) {
      const relation = decl[1] ?? ''
      const columns = parseColumns(decl[2] ?? '')
      const comment = flushComment()
      items.push({
        kind: 'decl',
        relation,
        columns,
        comment,
        line: i + 1,
        file,
      })
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
    items.push({
      kind: 'clause',
      head,
      text: clauseText,
      comment: flushComment(),
      line: start + 1,
      endLine: i,
      file,
    })
    const info = relations.get(head)
    if (info) info.clauseCount++
  }
  return { text, items, relations: [...relations.values()] }
}

/** Relation names used in the body of a clause (after `:-`), including negated ones. */
export function bodyRelations(clauseText: string): string[] {
  const noComments = clauseText.split('\n').map(stripInlineComment).join('\n')
  const idx = noComments.indexOf(':-')
  if (idx < 0) return []
  const body = noComments.slice(idx + 2).replace(/"(?:[^"\\]|\\.)*"/g, '""')
  const out = new Set<string>()
  for (const m of body.matchAll(/(?<![\w.@])!?\s*([a-zA-Z_]\w*)\s*\(/g)) {
    const name = m[1] ?? ''
    if (
      ![
        'cat',
        'count',
        'min',
        'max',
        'sum',
        'to_string',
        'to_number',
        'strlen',
        'substr',
        'match',
        'contains',
        'ord',
        'range',
        'as',
        'mean',
      ].includes(name)
    )
      out.add(name)
  }
  return [...out]
}
