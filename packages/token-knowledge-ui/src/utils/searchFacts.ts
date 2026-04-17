import type { Fact } from '../hooks/useFacts'

type Param = Fact['params'][number]

export function paramToString(p: Param): string {
  if (Array.isArray(p)) return `[${p.map(paramToString).join(', ')}]`
  if (p == null) return 'nil'
  if (typeof p === 'object')
    return `${p.atom}(${p.params.map(paramToString).join(', ')})`
  return String(p)
}

export function factToString(fact: Fact): string {
  const params = fact.params.map(paramToString).join(', ')
  return params ? `${fact.atom} ${params}` : fact.atom
}

export function factToSearchString(fact: Fact): string {
  return `${fact.atom}(${fact.params.map(paramToString).join(', ')})`
}

function escapeForSearch(query: string) {
  return query.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
}

export function searchFacts(facts: Fact[], query: string): Fact[] {
  if (!query) return facts
  const pattern = query.split('*').map(escapeForSearch).join('.*')
  const regex = new RegExp(pattern, 'i')
  return facts.filter((fact) => regex.test(factToSearchString(fact)))
}
