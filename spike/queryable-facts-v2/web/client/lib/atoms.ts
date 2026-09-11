/** A Datalog atom as text: `writes("F", "V")`, `loc(18, "12:5:0", 12, 5, 3, 3)`. */
export interface Atom {
  relation: string
  cols: string[]
}

/** Splits an atom written by Soufflé or by a person: strings in double quotes, numbers bare. */
export function parseAtom(text: string): Atom | undefined {
  const m = /^\s*!?(\w+)\s*\(([\s\S]*)\)\s*$/.exec(text)
  if (!m) return undefined
  const relation = m[1] ?? ''
  const body = m[2] ?? ''
  const cols: string[] = []
  let i = 0
  const skip = () => {
    while (i < body.length && /\s/.test(body[i] ?? '')) i++
  }
  skip()
  if (i >= body.length) return { relation, cols }
  for (;;) {
    skip()
    if (body[i] === '"') {
      let value = ''
      i++
      while (i < body.length && body[i] !== '"') {
        if (body[i] === '\\' && i + 1 < body.length) i++
        value += body[i]
        i++
      }
      if (body[i] !== '"') return undefined
      i++
      cols.push(value)
    } else {
      let j = i
      while (j < body.length && body[j] !== ',') j++
      const value = body.slice(i, j).trim()
      if (!/^-?\d+$/.test(value)) return undefined
      cols.push(value)
      i = j
    }
    skip()
    if (i >= body.length) return { relation, cols }
    if (body[i] !== ',') return undefined
    i++
  }
}

export function formatAtom(
  relation: string,
  cols: string[],
  types: string[] = [],
): string {
  return `${relation}(${cols
    .map((c, i) =>
      types[i] === 'number' || types[i] === 'unsigned' ? c : JSON.stringify(c),
    )
    .join(', ')})`
}

export function shortAddress(a: string): string {
  const m = /^(?:[a-z0-9]+:)?(0x[0-9a-fA-F]{40})$/.exec(a)
  if (!m?.[1]) return a
  return `${m[1].slice(0, 6)}…${m[1].slice(-4)}`
}
