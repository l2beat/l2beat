import { buildReview } from '../post/buildReview.js'
import { ReviewOutput, RunMeta } from '../post/schema.js'
import { readJson, requireEnv, writeText } from './io.js'

const review = ReviewOutput.validate(readJson(requireEnv('REVIEW_OUTPUT_PATH')))
const meta = RunMeta.validate({
  run_id: requireEnv('RUN_ID'),
  lessons_version: process.env.LESSONS_VERSION ?? 'none',
  engine: process.env.ENGINE ?? 'stub',
  commit_id: requireEnv('HEAD_SHA'),
})
writeText(
  requireEnv('REVIEW_PAYLOAD_PATH'),
  JSON.stringify(buildReview(review, meta), null, 2),
)
writeText(
  requireEnv('REVIEW_FALLBACK_PATH'),
  JSON.stringify(buildReview(review, meta, { inline: false }), null, 2),
)
