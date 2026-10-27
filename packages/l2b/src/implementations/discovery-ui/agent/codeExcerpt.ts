// Past these the agent reads the rest from the .flat file.
const EXCERPT_LINES_MAX = 60
const CONTEXT_LINES = 12

export interface CodeExcerpt {
  line: number
  lines: string[]
  isCut: boolean
}

// What a step points at, so the agent reads the code before it says what the
// code does: the whole function, modifier or block the snippet opens, or the
// lines after a snippet that opens none.
export function excerptAt(
  code: string,
  offset: number,
  line: number,
): CodeExcerpt {
  const start = code.lastIndexOf('\n', offset - 1) + 1
  const end = blockEnd(code, offset) ?? endOfLines(code, start, CONTEXT_LINES)
  const lines = code.slice(start, end).split('\n')
  return {
    line,
    lines: lines.slice(0, EXCERPT_LINES_MAX),
    isCut: lines.length > EXCERPT_LINES_MAX,
  }
}

// A snippet opens a block when a brace comes before the statement ends.
function blockEnd(code: string, offset: number): number | undefined {
  const open = code.indexOf('{', offset)
  const semicolon = code.indexOf(';', offset)
  if (open === -1 || (semicolon !== -1 && semicolon < open)) {
    return undefined
  }
  let depth = 0
  for (let at = open; at < code.length; at++) {
    if (code[at] === '{') {
      depth++
    } else if (code[at] === '}') {
      depth--
      if (depth === 0) {
        return endOfLines(code, at, 1)
      }
    }
  }
  return undefined
}

function endOfLines(code: string, from: number, count: number): number {
  let end = from
  for (let i = 0; i < count; i++) {
    const next = code.indexOf('\n', end + (i === 0 ? 0 : 1))
    if (next === -1) {
      return code.length
    }
    end = next
  }
  return end
}
