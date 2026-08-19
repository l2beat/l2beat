// Re-exported from config so the garden pages and the public API can never
// disagree about what a crop is called or what it means.
export {
  CROP_DEFINITIONS as CROP_COLUMNS,
  CROP_SENTIMENT_LABELS,
  CROP_STATUS_LABELS,
  type CropDefinition,
} from '@l2beat/config/build/crops/vocabulary'
