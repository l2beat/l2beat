export {
  type AnomalyEvaluation,
  type AnomalyKind,
  type AnomalyMetric,
  type AnomalySeverity,
  evaluateAnomalies,
  type MetricSignal,
  type SeriesPoint,
  type SideMismatchSignal,
} from './evaluator'
export {
  describeSideMismatch,
  describeSignal,
  formatAnomalyReasons,
} from './formatter'
export {
  EXTREME_VALUE_RATIO_THRESHOLD,
  MIN_BASELINE_COUNT_PER_DAY,
  MIN_BASELINE_VOLUME_USD_PER_DAY,
  MIN_VOLUME_IDENTIFICATION_RATE,
  MINIMUM_SIDE_VALUE_USD_THRESHOLD,
  SIDE_MISMATCH_DIFF_PERCENT,
  SIDE_MISMATCH_MIN_VOLUME_USD,
  VALUE_DIFF_THRESHOLD_PERCENT,
} from './thresholds'
