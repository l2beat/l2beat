import type { ProjectCropStatus, ProjectCrops, Sentiment } from '@l2beat/config'

export const CROP_COLUMNS: {
  key: keyof ProjectCrops
  letter: string
  label: string
}[] = [
  {
    key: 'censorshipResistance',
    letter: 'CR',
    label: 'Censorship resistance',
  },
  { key: 'openSource', letter: 'O', label: 'Open source' },
  { key: 'privacy', letter: 'P', label: 'Privacy' },
  { key: 'security', letter: 'S', label: 'Security' },
]

// The color/quality of a crop, independent of how thoroughly it was reviewed.
export const CROP_SENTIMENT_LABELS: Record<Sentiment, string> = {
  good: 'Good',
  warning: 'Medium',
  bad: 'Bad',
  neutral: 'Neutral',
  UnderReview: 'Under review',
}

// The review state of a crop, independent of its sentiment/color.
export const CROP_STATUS_LABELS: Record<ProjectCropStatus, string> = {
  reviewed: 'Reviewed',
  partiallyReviewed: 'Partially reviewed',
  notReviewed: 'Not reviewed',
}
