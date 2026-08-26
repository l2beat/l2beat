// Stub agent stage: no model yet, emits an empty schema-valid review.
import type { ReviewOutput } from '../post/schema.js'
import { requireEnv, writeText } from './io.js'

const review: ReviewOutput = {
  intent: 'Stub review: no model engaged yet.',
  findings: [],
  context_sources: ['diff'],
}
writeText(requireEnv('REVIEW_OUTPUT_PATH'), JSON.stringify(review, null, 2))
