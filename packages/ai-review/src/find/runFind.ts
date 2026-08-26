import type { Engine, StageBudget, TokenUsage } from '../engine/types.js'
import type { ReviewOutput } from '../post/schema.js'
import { rankFindings } from '../rank/rankFindings.js'
import { FindOutput, toFindings } from './schema.js'

export interface FindInput {
  cwd: string
  prompt: string
  outputSchema: object
  budget: StageBudget
}

export interface FindResult {
  review: ReviewOutput
  usage?: TokenUsage
}

const CONTEXT_SOURCES = ['diff', 'pr-description', 'checkout']

export async function runFind(
  engine: Engine,
  input: FindInput,
): Promise<FindResult> {
  const result = await engine.run(input)
  const base = { context_sources: CONTEXT_SOURCES, intent: '', findings: [] }
  if (!result.ok) {
    return {
      review: { ...base, aborted: `${result.reason}: ${result.detail}` },
      usage: result.usage,
    }
  }
  const parsed = FindOutput.safeValidate(result.output)
  if (!parsed.success) {
    return {
      review: {
        ...base,
        aborted: `invalid-output: ${parsed.path} ${parsed.message}`,
      },
      usage: result.usage,
    }
  }
  return {
    review: {
      ...base,
      intent: parsed.data.intent,
      findings: rankFindings(toFindings(parsed.data)),
      commands: result.commands,
    },
    usage: result.usage,
  }
}
