import type { Fact } from '~/hooks/useFacts'

type Param = Fact['params'][number]

export function paramToString(p: Param): string {
  if (typeof p === 'object') {
    const inner = (p.params as Param[]).map(paramToString).join(', ')
    return inner ? `${p.atom}(${inner})` : p.atom
  }
  return String(p)
}

export function factToString(fact: Fact): string {
  const params = fact.params.map(paramToString).join(', ')
  return params ? `${fact.atom}(${params})` : fact.atom
}

export function searchFacts(facts: Fact[], query: string): Fact[] {
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
