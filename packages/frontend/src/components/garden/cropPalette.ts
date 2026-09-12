import type { CropSentiment } from '@l2beat/config'

// The one place a sentiment becomes a colour, so the garden badge, the
// legend and the project page cannot drift apart.

/** The plant itself, via `currentColor`. */
export const CROP_PLANT_COLOR: Record<CropSentiment, string> = {
  good: 'text-crop-good',
  warning: 'text-crop-warning',
  bad: 'text-crop-bad',
  neutral: 'text-crop-neutral',
}

/** The same hue adjusted to read as text. */
export const CROP_INK: Record<CropSentiment, string> = {
  good: 'text-crop-good-ink',
  warning: 'text-crop-warning-ink',
  bad: 'text-crop-bad-ink',
  neutral: 'text-secondary',
}

export const CROP_BORDER: Record<CropSentiment, string> = {
  good: 'border-crop-good/50',
  warning: 'border-crop-warning/50',
  bad: 'border-crop-bad/50',
  neutral: 'border-crop-neutral/60',
}

export const CROP_TINT: Record<CropSentiment, string> = {
  good: 'bg-crop-good/10',
  warning: 'bg-crop-warning/10',
  bad: 'bg-crop-bad/10',
  neutral: 'bg-crop-neutral/15',
}

/** The verdict tally swatches. */
export const CROP_SWATCH: Record<CropSentiment, string> = {
  good: 'bg-crop-good',
  warning: 'bg-crop-warning',
  bad: 'bg-crop-bad',
  neutral: 'bg-crop-neutral/60',
}
