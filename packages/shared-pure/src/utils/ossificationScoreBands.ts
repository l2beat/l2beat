/**
 * What an ossification score allows. From `good` up the code counts as
 * ossified, about a year without a critical change; below `warning`, a
 * critical change landed within roughly the last five weeks.
 */
export const OSSIFICATION_SCORE_BANDS = { good: 80, warning: 50 } as const

export type OssificationSentiment = 'good' | 'warning' | 'bad'

export function getOssificationSentiment(score: number): OssificationSentiment {
  if (score >= OSSIFICATION_SCORE_BANDS.good) return 'good'
  if (score >= OSSIFICATION_SCORE_BANDS.warning) return 'warning'
  return 'bad'
}
