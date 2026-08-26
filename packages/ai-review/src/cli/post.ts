import { readFileSync } from 'node:fs'
import { parseDiffLines } from '../diff/parseDiff.js'
import { buildReview } from '../post/buildReview.js'
import { ReviewOutput, RunMeta } from '../post/schema.js'
import { readJson, requireEnv, writeText } from './io.js'

const review = ReviewOutput.validate(readJson(requireEnv('REVIEW_OUTPUT_PATH')))
const meta = RunMeta.validate({
  run_id: requireEnv('RUN_ID'),
  lessons_version: process.env.LESSONS_VERSION ?? 'none',
  engine: process.env.ENGINE ?? 'stub',
})
const diff = parseDiffLines(readFileSync(requireEnv('DIFF_PATH'), 'utf8'))
writeText(
  requireEnv('REVIEW_PAYLOAD_PATH'),
  JSON.stringify(
    buildReview(review, diff, meta, requireEnv('HEAD_SHA')),
    null,
    2,
  ),
)
