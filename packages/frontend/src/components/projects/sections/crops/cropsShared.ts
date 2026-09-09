import type {
  CropKey,
  CropSentiment,
  ResolvedCrops,
} from '@l2beat/config/build/crops/canonicalCrops'
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

/** How many of the four crops are in bloom, for the verdict tally. */
export function countInBloom(crops: ResolvedCrops): number {
  return toCropEntries(crops).filter((c) => c.evaluation.sentiment === 'good')
    .length
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

/** The dashed root that ties a plant to its findings. */
export const SENTIMENT_ROOT: Record<CropSentiment, string> = {
  good: 'border-crop-good/65',
  warning: 'border-crop-warning/65',
  bad: 'border-crop-bad/65',
  neutral: 'border-crop-neutral',
}
