import { type Node, grammar } from 'ohm-js'
import * as z from 'zod'

// In Ohm grammar, uppercase ids are for syntactic rules
// which allow spaces in-between tokens.
// Lowercase ids are for lexical rules, which do not allow spaces.
const clingoFactGrammar = grammar(String.raw`
  ClingoFact {
    Fact      = atom "(" ParamList ")"
    ParamList = Param ("," Param)*  -- multiple
              |                     -- empty
    Param     = ConsList | Fact | String | Number | atom
    String    = "\"" ("\\\"" | ~"\"" any)* "\""
    Number    = "-"? digit+ ("." digit+)?
    atom      = "nil" | ~keyword<"cons"> (alnum | "_" )+
    ConsList  = "cons" "(" Param "," Param ")"
    keyword<word> = word ~(alnum | "_")
  }
`)

// Cast properly formed `cons lists` to arrays, and `nil` to `undefined`.
const semantics = clingoFactGrammar.createSemantics().addOperation('toValue', {
  Fact(atom, _open, paramList, _close) {
    return {
      atom: atom.toValue(),
      params: paramList.toValue(),
    }
  },

  Param(inner) {
    return inner.toValue()
  },

  ParamList_multiple(first, _comma, rest) {
    const params = [first.toValue(), ...rest.toValue()]
    return params
  },

  String(_open, chars, _close) {
    return chars.sourceString.replace(/\\"/g, '"')
  },

  Number(_maybeMinus, _digits, _maybeDot, _maybeDecimal) {
    return parseFloat(this.sourceString)
  },

  atom(_chars) {
    return this.sourceString === 'nil' ? undefined : this.sourceString
  },

  ConsList(_cons, _open, head, _comma, tail, _close) {
    return [head.toValue(), ...(tail.toValue() ?? [])]
  },

  _iter(...children) {
    return children.map((child: Node) => child.toValue())
  },
})

export type ClingoValue =
  | string
  | number
  | null
  | undefined
  | ClingoFact
  | ClingoValue[]
export const ClingoValue: z.ZodType<ClingoValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.null().transform(() => undefined),
    z.undefined(),
    ClingoFact,
    z.array(ClingoValue),
  ]),
)

export type ClingoFact = {
  atom: string
  params: ClingoValue[]
}

export const ClingoFact: z.ZodType<ClingoFact> = z.object({
  atom: z.string(),
  params: z.array(ClingoValue),
})

export function parseClingoFact(fact: string): ClingoFact {
  const parsed = clingoFactGrammar.match(fact, 'Fact')
  if (parsed.failed()) {
    throw new Error(parsed.message)
  }
  return ClingoFact.parse(semantics(parsed).toValue())
}
