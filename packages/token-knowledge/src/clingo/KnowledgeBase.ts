import type { ClingoFact } from './parseClingoFact'

export class KnowledgeBase {
  constructor(public readonly facts: ClingoFact[]) {}

  getFacts(
    atom: string,
    params: (string | number | undefined)[] = [],
  ): ClingoFact[] {
    return this.facts.filter(
      (fact) =>
        fact.atom === atom &&
        params.every(
          (p, i) => p === undefined || fact.params[i] === p,
        ),
    )
  }

  getFact(
    atom: string,
    params: (string | number | undefined)[],
  ): ClingoFact {
    const facts = this.getFacts(atom, params)
    if (facts.length !== 1) {
      throw new Error(
        `Expected exactly 1 "${atom}" fact for params ${JSON.stringify(params)}, got ${facts.length}`,
      )
    }
    // length is exactly 1, so index 0 is guaranteed
    return facts[0] as ClingoFact
  }
}
