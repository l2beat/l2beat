import type { ReviewOutput, RunMeta } from './schema.js'

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

export function buildComment(review: ReviewOutput, meta: RunMeta): string {
  const sources = review.context_sources.length
    ? review.context_sources.map((s) => `\`${s}\``).join(', ')
    : 'none'
  const lines = [
    '## AI review',
    '',
    review.intent,
    '',
    review.findings.length === 0
      ? `Reviewed, consulted ${sources}, no findings above the bar.`
      : formatFindings(review),
    '',
    `<sub>run \`${meta.run_id}\` · lessons \`${meta.lessons_version}\` · engine \`${meta.engine}\`</sub>`,
    buildMarker(review, meta),
  ]
  return lines.join('\n')
}

function formatFindings(review: ReviewOutput): string {
  return review.findings
    .map((f, i) => {
      const loc = f.file
        ? ` — \`${f.file}${f.line_start ? `:${f.line_start}` : ''}\``
        : ''
      return [
        `### ${i + 1}. [${f.severity}/${f.category}] ${f.claim}${loc}`,
        `Evidence: ${f.evidence}`,
        `Fix: ${f.fix_sketch}`,
      ].join('\n')
    })
    .join('\n\n')
}
