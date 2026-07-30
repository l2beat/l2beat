import type { ComponentType } from 'react'
import type { ChartScale } from '~/components/chart/types'
import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import type { ChartRange } from '~/utils/range/range'
import type { CompareMetricId } from '../utils/compareChartState'

export interface CompareMetricChartProps {
  projects: CompareProjectEntry[]
  range: ChartRange
  scale: ChartScale
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
   * value formatting. Per-metric controls and unit options land here with
   * the follow-up metric tickets.
   */
  Chart: ComponentType<CompareMetricChartProps>
}
