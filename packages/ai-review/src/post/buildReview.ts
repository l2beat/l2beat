import type { Finding, Location, ReviewOutput, RunMeta } from './schema.js'

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
  commit_id: string
  body: string
  comments: InlineComment[]
}

// Line numbers come straight from the engine; a hallucinated line outside the
// diff makes GitHub reject the whole review with a 422. `inline: false` builds
// the fallback payload posted in that case, with every finding in the body.
export function buildReview(
  review: ReviewOutput,
  meta: RunMeta,
  opts: { inline?: boolean } = {},
): ReviewPayload {
  const inline: InlineComment[] = []
  const topLevel: Finding[] = []
  for (const f of review.findings) {
    const loc = f.location
    if ((opts.inline ?? true) && loc?.range) {
      inline.push({
        path: loc.file,
        line: loc.range.end,
        ...(loc.range.end !== loc.range.start
          ? { start_line: loc.range.start, start_side: 'RIGHT' as const }
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
    commit_id: meta.commit_id,
    body: buildBody(review, meta, inline.length, topLevel),
    comments: inline,
  }
}

export function formatFinding(f: Finding): string {
  const loc = f.location ? ` — \`${formatLocation(f.location)}\`` : ''
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

function formatLocation({ file, range }: Location): string {
  if (!range) return file
  const end = range.end !== range.start ? `-${range.end}` : ''
  return `${file}:${range.start}${end}`
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
          (topLevel.length ? ` ${topLevel.length} listed here:` : ''),
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
