import { v } from '@l2beat/validate'
import type {
  DatasetEntry,
  JudgeUsage,
  PrJudgement,
  ReviewComment,
  Verdict,
} from '../types.js'

export interface JudgeEngine {
  readonly name: string
  readonly model?: string
  run(
    prompt: string,
    schema: object,
  ): Promise<{ text: string; usage?: JudgeUsage; latencyMs: number }>
}

export const VERDICTS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['verdicts'],
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['finding_id', 'human_comment_id', 'match', 'reason'],
        properties: {
          finding_id: { type: 'integer' },
          human_comment_id: { type: 'integer' },
          match: { type: 'boolean' },
          reason: { type: 'string' },
        },
      },
    },
  },
} as const

const VerdictsOutput = v.object({
  verdicts: v.array(
    v.object({
      finding_id: v.number(),
      human_comment_id: v.number(),
      match: v.boolean(),
      reason: v.string(),
    }),
  ),
})

export function buildJudgePrompt(entry: DatasetEntry): string {
  const list = (items: ReviewComment[]) =>
    items
      .map(
        (c) =>
          `<comment id="${c.id}"${c.path ? ` file="${c.path}"` : ''}${c.line ? ` line="${c.line}"` : ''}>\n${c.body}\n</comment>`,
      )
      .join('\n')

  return `You are judging an automated code reviewer against human reviewers on a merged pull request.

PR #${entry.pr}: ${entry.title}

Below are HUMAN review comments (ground truth) and AUTOMATED findings. For every (finding, human comment) pair decide whether they point at the SAME underlying issue.

Match by issue identity, not wording:
- Same defect, same root cause, or the same requested change counts as a match even if phrased very differently, at a different line of the same logic, or with a different suggested fix.
- Same file or same general topic is NOT enough. Two comments about different problems in the same function do not match.
- A human comment that is a question, a nit, or a style remark matches only if the finding raises the same concern.

Return exactly one verdict for every pair: ${entry.codexFindings.length} findings x ${entry.humanComments.length} human comments = ${entry.codexFindings.length * entry.humanComments.length} verdicts. Keep each reason to one sentence.

<human_comments>
${list(entry.humanComments)}
</human_comments>

<automated_findings>
${list(entry.codexFindings)}
</automated_findings>`
}

export function parseVerdicts(
  entry: DatasetEntry,
  text: string,
): { verdicts: Verdict[]; missingPairs: number } {
  const parsed = VerdictsOutput.parse(JSON.parse(text))
  const findingIds = new Set(entry.codexFindings.map((f) => f.id))
  const humanIds = new Set(entry.humanComments.map((c) => c.id))
  const seen = new Map<string, Verdict>()
  for (const raw of parsed.verdicts) {
    if (!findingIds.has(raw.finding_id) || !humanIds.has(raw.human_comment_id))
      continue
    const key = `${raw.finding_id}:${raw.human_comment_id}`
    const existing = seen.get(key)
    // duplicated pair: any match wins
    if (existing && !raw.match) continue
    seen.set(key, {
      findingId: raw.finding_id,
      humanCommentId: raw.human_comment_id,
      match: raw.match,
      reason: raw.reason,
    })
  }
  return {
    verdicts: [...seen.values()],
    missingPairs: findingIds.size * humanIds.size - seen.size,
  }
}

export async function judgePr(
  engine: JudgeEngine,
  entry: DatasetEntry,
): Promise<PrJudgement> {
  if (entry.codexFindings.length === 0 || entry.humanComments.length === 0) {
    return {
      pr: entry.pr,
      verdicts: [],
      missingPairs: 0,
      latencyMs: 0,
      cached: false,
    }
  }
  const result = await engine.run(buildJudgePrompt(entry), VERDICTS_SCHEMA)
  return {
    pr: entry.pr,
    ...parseVerdicts(entry, result.text),
    usage: result.usage,
    latencyMs: result.latencyMs,
    cached: false,
  }
}
