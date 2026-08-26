import { readFileSync } from 'node:fs'
import { v } from '@l2beat/validate'
import { CodexEngine } from '../engine/codex/CodexEngine.js'
import { StubEngine } from '../engine/stub/StubEngine.js'
import type { Engine } from '../engine/types.js'
import { buildPrompt } from '../find/buildPrompt.js'
import { runFind } from '../find/runFind.js'
import { readJson, requireEnv, setOutput, writeText } from './io.js'

const PrMeta = v.object({
  title: v.string().optional(),
  body: v.string().optional(),
})

const prompts = new URL('../../prompts/', import.meta.url)
const engineName = process.env.ENGINE ?? 'stub'

const engine: Engine =
  engineName === 'codex'
    ? new CodexEngine({
        model: process.env.CODEX_MODEL,
        reasoningEffort: 'medium',
        sandbox: 'workspace-write',
      })
    : new StubEngine({ intent: 'Stub review: no model engaged.', findings: [] })

const prMeta = PrMeta.validate(JSON.parse(process.env.PR_META ?? '{}'))
const prompt = buildPrompt({
  instructions: readFileSync(new URL('find.md', prompts), 'utf8'),
  title: prMeta.title ?? '',
  body: prMeta.body ?? '',
  diff: readFileSync(requireEnv('DIFF_PATH'), 'utf8'),
  maxDiffChars: Number(process.env.MAX_DIFF_CHARS ?? 200_000),
})

const { review, usage } = await runFind(engine, {
  cwd: process.env.REVIEW_CWD ?? process.cwd(),
  prompt,
  outputSchema: readJson(
    new URL('find.schema.json', prompts).pathname,
  ) as object,
  budget: {
    maxTokens: Number(process.env.FIND_MAX_TOKENS ?? 400_000),
    timeoutMs: Number(process.env.FIND_TIMEOUT_MS ?? 10 * 60_000),
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
writeText(requireEnv('REVIEW_OUTPUT_PATH'), JSON.stringify(review, null, 2))
setOutput('engine', engine.name)
