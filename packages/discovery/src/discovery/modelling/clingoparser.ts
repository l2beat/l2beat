import { type Parser, v } from '@l2beat/validate'

export type ClingoValue =
  | string
  | number
  | null
  | undefined
  | ClingoFact
  | ClingoValue[]

export const ClingoValue: Parser<ClingoValue> = v.lazy(() =>
  v.union([
    v.string(),
    v.number(),
    v.null().transform(() => undefined),
    v.undefined(),
    ClingoFact,
    v.array(ClingoValue),
  ]),
)

export type ClingoFact = {
  atom: string
  params: ClingoValue[]
}

export const ClingoFact: Parser<ClingoFact> = v.object({
  atom: v.string(),
  params: v.array(ClingoValue),
})

export function parseClingoFact(fact: string): ClingoFact {
  const parser = new ClingoFactParser(fact)
  const result = parser.parseFact()
  parser.skipWhitespace()
  if (!parser.eof()) parser.fail('expected end of input')
  return ClingoFact.parse(result)
}

class ClingoFactParser {
  pos = 0
  constructor(private readonly src: string) {}

  eof(): boolean {
    return this.pos >= this.src.length
  }

  peek(): string {
    return this.src[this.pos] ?? ''
  }

  skipWhitespace(): void {
    while (this.pos < this.src.length) {
      // biome-ignore lint/style/noNonNullAssertion: we know it's there
      const ch = this.src[this.pos]!
      if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
        this.pos++
      } else break
    }
  }

  expect(ch: string): void {
    this.skipWhitespace()
    if (this.src[this.pos] !== ch) this.fail(`expected '${ch}'`)
    this.pos++
  }

  fail(msg: string): never {
    const ctx = JSON.stringify(this.src.slice(this.pos, this.pos + 20))
    throw new Error(`Parse error at ${this.pos}: ${msg}, got ${ctx}`)
  }

  parseFact(): ClingoFact {
    this.skipWhitespace()
    const atom = this.parseIdent()
    if (atom === undefined) this.fail('expected atom')
    if (atom === 'cons') this.fail("'cons' is reserved")
    this.expect('(')
    const params = this.parseParamList()
    this.expect(')')
    return { atom, params }
  }

  parseParamList(): ClingoValue[] {
    this.skipWhitespace()
    if (this.peek() === ')') return []
    const params: ClingoValue[] = [this.parseParam()]
    this.skipWhitespace()
    while (this.peek() === ',') {
      this.pos++
      params.push(this.parseParam())
      this.skipWhitespace()
    }
    return params
  }

  parseParam(): ClingoValue {
    this.skipWhitespace()
    const ch = this.peek()
    if (ch === '"') return this.parseString()
    if (ch === '-' || (ch >= '0' && ch <= '9')) return this.parseNumber()
    const ident = this.parseIdent()
    if (ident === undefined) this.fail('expected param')
    this.skipWhitespace()
    if (this.peek() !== '(') {
      if (ident === 'cons') this.fail("'cons' is reserved")
      return ident === 'nil' ? undefined : ident
    }
    this.pos++
    if (ident === 'cons') {
      const head = this.parseParam()
      this.expect(',')
      const tail = this.parseParam()
      this.expect(')')
      return [head, ...((tail as ClingoValue[]) ?? [])]
    }
    const params = this.parseParamList()
    this.expect(')')
    return { atom: ident, params }
  }

  parseIdent(): string | undefined {
    const start = this.pos
    while (this.pos < this.src.length) {
      // biome-ignore lint/style/noNonNullAssertion: we know it's there
      const ch = this.src[this.pos]!
      const isAlnum =
        (ch >= 'a' && ch <= 'z') ||
        (ch >= 'A' && ch <= 'Z') ||
        (ch >= '0' && ch <= '9')
      if (isAlnum || ch === '_') this.pos++
      else break
    }
    return this.pos === start ? undefined : this.src.slice(start, this.pos)
  }

  parseString(): string {
    this.pos++
    let result = ''
    while (this.pos < this.src.length) {
      // biome-ignore lint/style/noNonNullAssertion: we know it's there
      const ch = this.src[this.pos]!
      if (ch === '\\' && this.src[this.pos + 1] === '"') {
        result += '"'
        this.pos += 2
      } else if (ch === '"') {
        this.pos++
        return result
      } else {
        result += ch
        this.pos++
      }
    }
    this.fail('unterminated string')
  }

  parseNumber(): number {
    const start = this.pos
    if (this.peek() === '-') this.pos++
    const digitsStart = this.pos
    while (this.pos < this.src.length) {
      // biome-ignore lint/style/noNonNullAssertion: we know it's there
      const ch = this.src[this.pos]!
      if (ch >= '0' && ch <= '9') this.pos++
      else break
    }
    if (this.pos === digitsStart) this.fail('expected digit')
    if (this.peek() === '.') {
      this.pos++
      const fracStart = this.pos
      while (this.pos < this.src.length) {
        // biome-ignore lint/style/noNonNullAssertion: we know it's there
        const ch = this.src[this.pos]!
        if (ch >= '0' && ch <= '9') this.pos++
        else break
      }
      if (this.pos === fracStart) this.fail('expected digit after decimal')
    }
    return Number.parseFloat(this.src.slice(start, this.pos))
  }
}
