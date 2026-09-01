import { readFileSync } from 'node:fs'
import { v } from '@l2beat/validate'
import { totalTokens } from '../engine/codex/parseTranscript.js'
import { createEngine } from '../engine/createEngine.js'
import { buildPrompt } from '../find/buildPrompt.js'
import { runFind } from '../find/runFind.js'
import { FIND_OUTPUT_SCHEMA } from '../find/schema.js'
import { requireEnv, setOutput, writeText } from './io.js'

const PrMeta = v.object({
  title: v.string().optional(),
  body: v.string().optional(),
})

const engine = createEngine(process.env)

// Unset workflow outputs and vars arrive as '', not undefined.
const prMeta = PrMeta.validate(JSON.parse(process.env.PR_META || '{}'))
const prompt = buildPrompt({
  instructions: readFileSync(
    new URL('../../prompts/find.md', import.meta.url),
    'utf8',
  ),
  title: prMeta.title ?? '',
  body: prMeta.body ?? '',
  baseSha: requireEnv('BASE_SHA'),
  headSha: requireEnv('HEAD_SHA'),
})

const { review, usage } = await runFind(engine, {
  cwd: process.env.REVIEW_CWD ?? process.cwd(),
  prompt,
  outputSchema: FIND_OUTPUT_SCHEMA,
  budget: {
    timeoutMs: Number(process.env.FIND_TIMEOUT_MS || 10 * 60_000),
  },
})
console.log(
  JSON.stringify({
    engine: engine.name,
    usage,
    findings: review.findings.length,
    aborted: review.aborted,
  }),
)
writeText(
  requireEnv('REVIEW_OUTPUT_PATH'),
  JSON.stringify({ ...review, tokens: usage && totalTokens(usage) }, null, 2),
)
setOutput('engine', engine.name)
