import { buildComment } from '../post/buildComment.js'
import { ReviewOutput, RunMeta } from '../post/schema.js'
import { readJson, requireEnv, writeText } from './io.js'

const review = ReviewOutput.validate(readJson(requireEnv('REVIEW_OUTPUT_PATH')))
const meta = RunMeta.validate({
  run_id: requireEnv('RUN_ID'),
  lessons_version: process.env.LESSONS_VERSION ?? 'none',
  engine: process.env.ENGINE ?? 'stub',
})
writeText(requireEnv('COMMENT_PATH'), buildComment(review, meta))
