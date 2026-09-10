import type { CropKey, CropSentiment, ResolvedCrops } from '@l2beat/config'
import { CROP_COLUMNS, type CropDefinition } from '~/pages/garden/crops'

/** A crop's definition and its evaluation together, in garden order. */
export interface CropEntry {
  definition: CropDefinition
  key: CropKey
  evaluation: ResolvedCrops[CropKey]
  index: number
}

export function toCropEntries(crops: ResolvedCrops): CropEntry[] {
  return CROP_COLUMNS.map((definition, index) => ({
    definition,
    key: definition.key,
    evaluation: crops[definition.key],
    index,
  }))
}

// Mirrors CropBadge's PALETTE so the project page cannot drift from the garden.
export const SENTIMENT_TEXT: Record<CropSentiment, string> = {
  good: 'text-crop-good-ink',
  warning: 'text-crop-warning-ink',
  bad: 'text-crop-bad-ink',
  neutral: 'text-secondary',
}

export const SENTIMENT_BORDER: Record<CropSentiment, string> = {
  good: 'border-crop-good/50',
  warning: 'border-crop-warning/50',
  bad: 'border-crop-bad/50',
  neutral: 'border-crop-neutral/60',
}

export const SENTIMENT_TINT: Record<CropSentiment, string> = {
  good: 'bg-crop-good/10',
  warning: 'bg-crop-warning/10',
  bad: 'bg-crop-bad/10',
  neutral: 'bg-crop-neutral/15',
}

/** The verdict tally swatches. */
export const SENTIMENT_SWATCH: Record<CropSentiment, string> = {
  good: 'bg-crop-good',
  warning: 'bg-crop-warning',
  bad: 'bg-crop-bad',
  neutral: 'bg-crop-neutral/60',
}
