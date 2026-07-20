import type { ProjectCropStatus, ProjectCrops } from '@l2beat/config'

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

export const CROP_STATUS_LABELS: Record<ProjectCropStatus, string> = {
  good: 'Good',
  partiallyReviewed: 'Partially reviewed',
  medium: 'Medium',
  bad: 'Bad',
  notReviewed: 'Not reviewed',
}
