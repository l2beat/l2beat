import type { ComponentType, Dispatch, SetStateAction } from 'react'
import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import type {
  CompareClientState,
  CompareMetricId,
} from '../utils/compareChartState'

export interface CompareMetricChartProps {
  projects: CompareProjectEntry[]
  state: CompareClientState
}

export interface CompareMetricControlsProps {
  state: CompareClientState
  setState: Dispatch<SetStateAction<CompareClientState>>
}

/**
 * A compare page metric. The page shell contains no metric-specific
 * conditionals - adding a metric means adding an entry here and in
 * `COMPARE_SERVER_METRICS`, no route or page changes.
 */
export interface CompareMetric {
  id: CompareMetricId
  label: string
  /**
   * The metric's chart, including its data query, series extraction and
   * value formatting.
   */
  Chart: ComponentType<CompareMetricChartProps>
  /**
   * Metric-specific controls (e.g. the UOPS/TPS switch), rendered in the
   * per-metric slot next to the metric switcher.
   */
  Controls?: ComponentType<CompareMetricControlsProps>
  /**
   * Marks projects the metric has no data for. The picker greys them out
   * with `unavailableReason` and the metric's chart must never render a
   * series for them. Omitted = every project is available.
   */
  isProjectAvailable?: (project: CompareProjectEntry) => boolean
  /** Short note shown on unavailable projects in the picker and chips. */
  unavailableReason?: string
}
