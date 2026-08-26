import { existsSync, readFileSync } from 'node:fs'
import { parseDiffLines } from '../diff/parseDiff.js'
import { buildReview } from '../post/buildReview.js'
import { ReviewOutput, RunMeta } from '../post/schema.js'
import { readJson, requireEnv, writeText } from './io.js'

const reviewPath = requireEnv('REVIEW_OUTPUT_PATH')
const diffPath = requireEnv('DIFF_PATH')

// The review job may have failed before producing output; still post the reason.
const review: ReviewOutput = existsSync(reviewPath)
  ? ReviewOutput.validate(readJson(reviewPath))
  : {
      intent: '',
      findings: [],
      context_sources: [],
      aborted: `review job ${process.env.REVIEW_JOB_RESULT ?? 'failed'} without output`,
    }
const meta = RunMeta.validate({
  run_id: requireEnv('RUN_ID'),
  lessons_version: process.env.LESSONS_VERSION ?? 'none',
  engine: process.env.ENGINE ?? 'stub',
})
const diff = parseDiffLines(
  existsSync(diffPath) ? readFileSync(diffPath, 'utf8') : '',
)
writeText(
  requireEnv('REVIEW_PAYLOAD_PATH'),
  JSON.stringify(
    buildReview(review, diff, meta, requireEnv('HEAD_SHA')),
    null,
    2,
  ),
)
