import type { ClingoFact, ClingoValue } from './factTypes'

export class KnowledgeBase {
  private readonly idToNameMap: Record<string, string>
  constructor(
    public readonly projectName: string,
    private readonly facts: ClingoFact[],
  ) {
    this.idToNameMap = this.buildIdToNameMap()
  }

  getFacts(id: string, params: (string | number | undefined)[]): ClingoFact[] {
    return this.facts.filter(
      (fact) =>
        fact.atom === id &&
        fact.params.every(
          (param, index) =>
            params[index] === undefined || param === params[index],
        ),
    )
  }

  getFactOrUndefined(
    id: string,
    params: (string | number | undefined)[],
  ): ClingoFact | undefined {
    const facts = this.getFacts(id, params)
    if (facts.length > 1) {
      throw new Error(
        `Found multiple facts with "${id}" id and params: ${JSON.stringify(params)}`,
      )
    }
    return facts[0]
  }

  getFact(id: string, params: (string | number | undefined)[]): ClingoFact {
    const fact = this.getFactOrUndefined(id, params)
    if (fact === undefined) {
      throw new Error(
        `No fact found with id "${id}" and params: ${JSON.stringify(params)}`,
      )
    }
    return fact
  }

  replaceIdsWithNames(s: string): string {
    return s.replace(
      /@@([a-zA-Z0-9_]+)/g,
      (_, id) => this.idToNameMap[id] ?? id,
    )
  }

  buildIdToNameMap(): Record<string, string> {
    const contractFacts = this.getFacts('contract', [])
    const eoaFacts = this.getFacts('eoa', [])
    const idToNameMap: Record<string, string> = {}
    ;[...contractFacts, ...eoaFacts].forEach((fact) => {
      const id = fact.params[0] as string
      const name = fact.params[3] === '' ? fact.params[2] : fact.params[3]
      idToNameMap[id] = name as string
    })
    return idToNameMap
  }
}

export function groupFacts(
  facts: ClingoFact[],
  onPosition: number,
): ClingoFact[] {
  const groups = new Map<string, ClingoValue[]>()

  for (const fact of facts) {
    if (fact.params[onPosition] === undefined) {
      throw new Error(
        `Trying to group ${JSON.stringify(fact)} on incorrect position ${onPosition}`,
      )
    }
    const keyParams = [
      fact.atom,
      ...fact.params.slice(0, onPosition),
      ...fact.params.slice(onPosition + 1),
    ]
    const key = JSON.stringify(keyParams)
    const current = groups.get(key) || []
    current.push(fact.params[onPosition])
    groups.set(key, current)
  }

  const result: ClingoFact[] = []
  for (const [key, values] of groups) {
    const keyParts: [string, ...ClingoValue[]] = JSON.parse(key)
    const [atom, ...keyParams] = keyParts

    const newParams = [
      ...keyParams.slice(0, onPosition),
      values,
      ...keyParams.slice(onPosition),
    ]

    result.push({
      atom,
      params: newParams,
    })
  }

  return result
}
