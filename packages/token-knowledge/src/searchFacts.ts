import type { ClingoFact } from './clingo/parseClingoFact'

export function factToString(fact: ClingoFact): string {
  const params = fact.params
    .map((p) => (typeof p === 'object' ? factToString(p) : String(p)))
    .join(', ')
  return params.length > 0 ? `${fact.atom}(${params})` : fact.atom
}

export function searchFacts(facts: ClingoFact[], query: string): ClingoFact[] {
  if (!query) return facts
  try {
    const regex = new RegExp(query, 'i')
    return facts.filter((fact) => regex.test(factToString(fact)))
  } catch {
    const lower = query.toLowerCase()
    return facts.filter((fact) =>
      factToString(fact).toLowerCase().includes(lower),
    )
  }
}
