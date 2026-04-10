import { grammar, type Node } from 'ohm-js'

const clingoFactGrammar = grammar(String.raw`
  ClingoFact {
    Fact      = atom "(" ParamList ")"
    ParamList = Param ("," Param)*  -- multiple
              |                     -- empty
    Param     = Fact | String | Number | atom
    String    = "\"" ("\\\"" | ~"\"" any)* "\""
    Number    = "-"? digit+ ("." digit+)?
    atom      = (alnum | "_")+
  }
`)

const semantics = clingoFactGrammar.createSemantics().addOperation('toValue', {
  Fact(atom, _open, paramList, _close) {
    return { atom: atom.toValue(), params: paramList.toValue() }
  },
  Param(inner) {
    return inner.toValue()
  },
  ParamList_multiple(first, _comma, rest) {
    return [first.toValue(), ...rest.toValue()]
  },
  ParamList_empty() {
    return []
  },
  String(_open, chars, _close) {
    return chars.sourceString.replace(/\\"/g, '"')
  },
  Number(_maybeMinus, _digits, _maybeDot, _maybeDecimal) {
    return Number.parseFloat(this.sourceString)
  },
  atom(_chars) {
    return this.sourceString
  },
  _iter(...children) {
    return children.map((child: Node) => child.toValue())
  },
})

export interface ClingoFact {
  atom: string
  params: (string | number | ClingoFact)[]
}

export function parseClingoFact(fact: string): ClingoFact {
  const parsed = clingoFactGrammar.match(fact, 'Fact')
  if (parsed.failed()) {
    throw new Error(parsed.message)
  }
  return semantics(parsed).toValue()
}
