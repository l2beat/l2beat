import { KnowledgeBase } from './clingo/KnowledgeBase'
import { parseClingoFact } from './clingo/parseClingoFact'
import { extractFacts, runClingo } from './clingo/runClingo'

export async function infer(
  facts: string,
  rules: string,
): Promise<KnowledgeBase> {
  const program = facts + '\n' + rules

  const result = await runClingo(program)
  const rawFacts = extractFacts(result)
  const parsed = rawFacts.map(parseClingoFact)

  return new KnowledgeBase(parsed)
}
