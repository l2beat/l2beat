// A small tokenizer for Soufflé Datalog, enough for faithful syntax colouring of rules/*.dl.

export type DlClass =
  | 'comment'
  | 'directive'
  | 'rel'
  | 'var'
  | 'str'
  | 'num'
  | 'op'
  | 'kw'
  | 'type'
  | 'plain'

export interface DlToken {
  text: string
  cls: DlClass
}

const KEYWORDS = new Set([
  'min',
  'max',
  'count',
  'sum',
  'cat',
  'to_number',
  'to_string',
  'match',
  'contains',
  'ord',
  'strlen',
  'substr',
  'range',
])
const TYPES = new Set(['symbol', 'number', 'unsigned', 'float'])

export function tokenizeDatalog(line: string): DlToken[] {
  const out: DlToken[] = []
  let i = 0
  const push = (text: string, cls: DlClass) => {
    if (text) out.push({ text, cls })
  }
  while (i < line.length) {
    const rest = line.slice(i)
    let m: RegExpExecArray | null
    if (rest.startsWith('//')) {
      push(rest, 'comment')
      break
    }
    if (
      (m =
        /^\.(decl|input|output|type|plan|printsize|limitsize|pragma|functor|comp|init|override)\b/.exec(
          rest,
        ))
    ) {
      push(m[0], 'directive')
      i += m[0].length
      continue
    }
    if ((m = /^"(?:[^"\\]|\\.)*"/.exec(rest))) {
      push(m[0], 'str')
      i += m[0].length
      continue
    }
    if ((m = /^-?\d+/.exec(rest))) {
      push(m[0], 'num')
      i += m[0].length
      continue
    }
    if ((m = /^:-|^!=|^>=|^<=|^[=<>!,;.:(){}[\]+\-*/%_]/.exec(rest))) {
      push(m[0], m[0] === '_' ? 'var' : 'op')
      i += m[0].length
      continue
    }
    if ((m = /^@?\w+/.exec(rest))) {
      const word = m[0]
      const after = rest.slice(word.length)
      let cls: DlClass = 'plain'
      const previous = out.filter((t) => t.text.trim() !== '').at(-1)
      if (KEYWORDS.has(word)) cls = 'kw'
      else if (
        previous?.cls === 'directive' &&
        /^\.(input|output)$/.test(previous.text)
      )
        cls = 'rel'
      else if (
        TYPES.has(word) &&
        /^\s*[,)]/.test(after) &&
        /:\s*$/.test(line.slice(0, i))
      )
        cls = 'type'
      else if (/^\s*\(/.test(after)) cls = 'rel'
      else if (/^[A-Z_]/.test(word)) cls = 'var'
      push(word, cls)
      i += word.length
      continue
    }
    if ((m = /^\s+/.exec(rest))) {
      push(m[0], 'plain')
      i += m[0].length
      continue
    }
    push(rest[0] ?? '', 'plain')
    i++
  }
  return out
}
