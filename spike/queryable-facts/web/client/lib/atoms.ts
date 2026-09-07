/** A Datalog atom as text: `writes("F", "V")`, `loc(18, "12:5:0", 12, 5, 3, 3)`. */
export interface Atom {
  relation: string
  cols: string[]
}

/**
 * Reads an atom the way a person (or a model) writes it: any spacing, strings in double quotes,
 * numbers bare or quoted. Returns undefined for anything that is not shaped like a tuple, including
 * rule-like text with variables (`writes(F, V)`) and Solidity (`require(msg.sender == owner)`).
 */
export function parseAtom(text: string): Atom | undefined {
  const m = /^\s*(\w+)\s*\(([\s\S]*)\)\s*$/.exec(text)
  if (!m) return undefined
  const relation = m[1] ?? ''
  const body = m[2] ?? ''
  const cols: string[] = []
  let i = 0
  const skipSpaces = () => {
    while (i < body.length && /\s/.test(body[i] ?? '')) i++
  }
  skipSpaces()
  if (i === body.length) return { relation, cols }
  for (;;) {
    skipSpaces()
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
      // a bare value must be a number: anything else is a variable or an expression, not a tuple
      if (!/^-?\d+$/.test(value)) return undefined
      cols.push(value)
      i = j
    }
    skipSpaces()
    if (i >= body.length) return { relation, cols }
    if (body[i] !== ',') return undefined
    i++
  }
}

/** `L25`, `L24-L27`, `L24–27` → the line span. */
export function parseLineRef(
  text: string,
): { from: number; to: number } | undefined {
  const m = /^L(\d+)(?:\s*[-–]\s*L?(\d+))?$/.exec(text.trim())
  if (!m) return undefined
  const from = Number(m[1])
  const to = m[2] ? Number(m[2]) : from
  return { from, to: Math.max(from, to) }
}
