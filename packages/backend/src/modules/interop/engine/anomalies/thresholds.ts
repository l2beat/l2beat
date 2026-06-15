export {
  MIN_NON_ZERO_HISTORY_POINTS,
  Z_CLASSIC_THRESHOLD,
  Z_ROBUST_THRESHOLD,
  Z_WINDOW_DAYS,
} from '../zScore'

export const FLAT_LINE_WINDOW_DAYS = 3

export const MIN_BASELINE_COUNT_PER_DAY = 50
export const MIN_BASELINE_VOLUME_USD_PER_DAY = 100_000
export const MIN_VOLUME_IDENTIFICATION_RATE = 0.5

// Only extreme moves alert — insane spikes and insane drops.
export const RATIO_DROP_THRESHOLD = 0.02
export const RATIO_COUNT_SPIKE_THRESHOLD = 10
export const RATIO_VOLUME_SPIKE_THRESHOLD = 30

// Relevance gate — a lane must be material (in absolute or share-of-bridge
// terms) to be worth alerting on. Spikes are gated on the candidate-day
// value; drops are gated on the baseline median.
//
// Share is computed as single-side lane value over two-sided bridge total
// (src + dst). For a balanced burn/mint bridge that means the effective
// floor on a single side is ~2x the constant.
export const RELEVANCE_MIN_VOLUME_USD = 1_000_000
export const RELEVANCE_MIN_BRIDGE_SHARE = 0.1
export const RELEVANCE_MIN_COUNT = 250

export const SIDE_MISMATCH_DIFF_PERCENT = 50
export const SIDE_MISMATCH_MIN_VOLUME_USD = 2_000_000

export const VALUE_DIFF_THRESHOLD_PERCENT = 15
export const MINIMUM_SIDE_VALUE_USD_THRESHOLD = 50
export const EXTREME_VALUE_RATIO_THRESHOLD = 5
