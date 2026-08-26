import { type DiffLines, isInDiff } from '../diff/parseDiff.js'
import type { Finding, ReviewOutput, RunMeta } from './schema.js'

export const MARKER_PREFIX = '<!-- ai-review'

export function buildMarker(review: ReviewOutput, meta: RunMeta): string {
  const fields = [
    `run=${meta.run_id}`,
    `lessons=${meta.lessons_version}`,
    `engine=${meta.engine}`,
    `sources=${review.context_sources.join(',')}`,
  ]
  return `${MARKER_PREFIX} ${fields.join(' ')} -->`
}

export interface InlineComment {
  path: string
  line: number
  start_line?: number
  side: 'RIGHT'
  start_side?: 'RIGHT'
  body: string
}

/** Payload for POST /repos/{owner}/{repo}/pulls/{n}/reviews */
export interface ReviewPayload {
  event: 'COMMENT'
  body: string
  comments: InlineComment[]
}

export function buildReview(
  review: ReviewOutput,
  diff: DiffLines,
  meta: RunMeta,
): ReviewPayload {
  const inline: InlineComment[] = []
  const topLevel: Finding[] = []
  for (const f of review.findings) {
    if (
      f.file &&
      f.line_start &&
      isInDiff(diff, f.file, f.line_start, f.line_end ?? f.line_start)
    ) {
      inline.push({
        path: f.file,
        line: f.line_end ?? f.line_start,
        ...(f.line_end && f.line_end !== f.line_start
          ? { start_line: f.line_start, start_side: 'RIGHT' as const }
          : {}),
        side: 'RIGHT',
        body: formatFinding(f),
      })
    } else {
      topLevel.push(f)
    }
  }
  return {
    event: 'COMMENT',
    body: buildBody(review, meta, inline.length, topLevel),
    comments: inline,
  }
}

export function formatFinding(f: Finding): string {
  const loc = f.file
    ? ` — \`${f.file}${f.line_start ? `:${f.line_start}` : ''}\``
    : ''
  return [
    `**[${f.severity}/${f.category}]** ${f.claim}${loc}`,
    '',
    `Evidence: ${f.evidence}`,
    '',
    `Fix: ${f.fix_sketch}`,
    '',
    `<sub>confidence ${f.confidence.toFixed(2)}</sub>`,
  ].join('\n')
}

function buildBody(
  review: ReviewOutput,
  meta: RunMeta,
  inlineCount: number,
  topLevel: Finding[],
): string {
  const sources = review.context_sources.length
    ? review.context_sources.map((s) => `\`${s}\``).join(', ')
    : 'none'
  const lines = ['## AI review', '']
  if (review.aborted) {
    lines.push(`Review aborted: ${review.aborted}`)
  } else {
    if (review.intent) lines.push(review.intent, '')
    if (review.findings.length === 0) {
      lines.push(`Reviewed, consulted ${sources}, no findings above the bar.`)
    } else {
      lines.push(
        `${review.findings.length} finding(s); ${inlineCount} inline.` +
          (topLevel.length ? ` ${topLevel.length} outside the diff:` : ''),
      )
      for (const f of topLevel) lines.push('', formatFinding(f))
    }
    if (review.commands?.length) {
      lines.push('', '<details><summary>Commands executed</summary>', '')
      for (const c of review.commands) lines.push(`- \`${c}\``)
      lines.push('', '</details>')
    }
  }
  lines.push(
    '',
    `<sub>run \`${meta.run_id}\` · lessons \`${meta.lessons_version}\` · engine \`${meta.engine}\` · sources ${sources}</sub>`,
    buildMarker(review, meta),
  )
  return lines.join('\n')
}
