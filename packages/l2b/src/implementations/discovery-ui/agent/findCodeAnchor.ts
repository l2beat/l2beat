export interface CodeMatch {
  offset: number
  line: number
  // The contract, interface or library the match sits in.
  contract: string | undefined
}

export interface CodeAnchor extends CodeMatch {
  sourceIndex: number
  sourceName: string
  length: number
  // Where else the snippet is, so the agent can tell the researcher there
  // is more than one implementation or quote a longer snippet.
  others: CodeMatch[]
}

const DECLARATION_KEYWORDS = [
  'contract ',
  'abstract contract ',
  'interface ',
  'library ',
]

// Searches the source DiscoUI opens by default first (the implementation of a
// proxy), so a snippet shared with the proxy lands on the code that runs.
// A function header without a body (an interface's or an abstract one) only
// shows when nothing implements it.
export function findCodeAnchor(
  sources: readonly { name: string; code: string }[],
  find: string,
): CodeAnchor | undefined {
  if (find.length === 0) {
    throw new Error('Empty code anchor')
  }
  const first = sources.length > 1 ? 1 : 0
  const order = [first, ...[...sources.keys()].filter((i) => i !== first)]
  for (const sourceIndex of order) {
    const source = sources[sourceIndex]
    if (source === undefined) {
      continue
    }
    const offsets = findOffsets(source.code, find)
    if (offsets.length === 0) {
      continue
    }
    const implemented = offsets.filter((o) => !isBodiless(source.code, o))
    const [shown, ...others] = (
      implemented.length > 0 ? implemented : offsets
    ).map((offset) => matchAt(source.code, offset))
    if (shown === undefined) {
      throw new Error('Code anchor without a match')
    }
    return {
      sourceIndex,
      sourceName: source.name,
      length: find.length,
      ...shown,
      others,
    }
  }
  return undefined
}

function findOffsets(code: string, find: string): number[] {
  const offsets: number[] = []
  for (
    let at = code.indexOf(find);
    at !== -1;
    at = code.indexOf(find, at + find.length)
  ) {
    offsets.push(at)
  }
  return offsets
}

function isBodiless(code: string, offset: number): boolean {
  const lineStart = code.lastIndexOf('\n', offset - 1) + 1
  const lineEnd = code.indexOf('\n', offset)
  const line = code.slice(lineStart, lineEnd === -1 ? code.length : lineEnd)
  if (!line.trimStart().startsWith('function ')) {
    return false
  }
  const semicolon = code.indexOf(';', offset)
  const brace = code.indexOf('{', offset)
  return semicolon !== -1 && (brace === -1 || semicolon < brace)
}

function matchAt(code: string, offset: number): CodeMatch {
  return {
    offset,
    line: lineOf(code, offset),
    contract: enclosingDeclaration(code, offset),
  }
}

// Flattened sources start every contract at the beginning of a line.
function enclosingDeclaration(code: string, offset: number) {
  let name: string | undefined
  let start = -1
  for (const keyword of DECLARATION_KEYWORDS) {
    const at = lineStartingWith(code, keyword, offset)
    if (at > start) {
      start = at
      const nameStart = at + keyword.length
      name = code.slice(nameStart, code.indexOf(' ', nameStart))
    }
  }
  return name
}

function lineStartingWith(code: string, text: string, before: number) {
  const at = code.lastIndexOf(`\n${text}`, before)
  if (at !== -1) return at + 1
  return code.startsWith(text) ? 0 : -1
}

function lineOf(text: string, offset: number): number {
  let line = 1
  for (let at = text.indexOf('\n'); at !== -1 && at < offset; ) {
    line++
    at = text.indexOf('\n', at + 1)
  }
  return line
}
