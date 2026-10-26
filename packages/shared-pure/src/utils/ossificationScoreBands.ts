/** What an ossification score allows, see `OSSIFICATION_BAND_MEANING`. */
export const OSSIFICATION_SCORE_BANDS = { good: 80, warning: 50 } as const

/**
 * What each band edge means in time, worded to follow "which takes" (`good`)
 * and "which means" (`warning`), so every sentence about the bands reads the
 * same and changes with them.
 */
export const OSSIFICATION_BAND_MEANING = {
  good: 'about a year without a critical change',
  warning: 'a critical change within roughly the last five weeks',
} as const

export type OssificationSentiment = 'good' | 'warning' | 'bad'

export function getOssificationSentiment(score: number): OssificationSentiment {
  if (score >= OSSIFICATION_SCORE_BANDS.good) return 'good'
  if (score >= OSSIFICATION_SCORE_BANDS.warning) return 'warning'
  return 'bad'
}
