export const OSSIFICATION_SCORE_BANDS = { good: 80, warning: 50 } as const

export const OSSIFICATION_BAND_MEANING = {
  good: 'about a year without a critical change',
  warning: 'a critical change within roughly the last five weeks',
} as const

export type OssificationSentiment = 'good' | 'warning' | 'bad'

export type OssificationBand = OssificationSentiment | 'unscored'

export function getOssificationSentiment(score: number): OssificationSentiment {
  if (score >= OSSIFICATION_SCORE_BANDS.good) return 'good'
  if (score >= OSSIFICATION_SCORE_BANDS.warning) return 'warning'
  return 'bad'
}
