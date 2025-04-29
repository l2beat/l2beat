import type { ClingoFact } from './clingoparser'

export class KnowledgeBase {
  constructor(public readonly facts: ClingoFact[]) {}

  getFacts(
    id: string,
    params: (string | number | undefined)[] = [],
  ): ClingoFact[] {
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
}
