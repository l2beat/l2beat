import { type ClingoFact, parseClingoFact } from './clingo/parseClingoFact'
import { extractFacts, runClingo } from './clingo/runClingo'

export async function infer(
  facts: string,
  rules: string,
): Promise<ClingoFact[]> {
  const program = facts + '\n' + rules

  const result = await runClingo(program, { timeoutMs: 10 * 1000 })
  const rawFacts = extractFacts(result)
  return rawFacts.map(parseClingoFact)
}
