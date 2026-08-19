import type { ComponentType, Dispatch, SetStateAction } from 'react'
import type { CompareProjectEntry } from '~/server/features/layer2s/compare/getCompareProjectEntries'
import type { SsrHelpers } from '~/trpc/server'
import type { ChartRange } from '~/utils/range/range'
import type {
  CompareChartConfig,
  CompareChartControls,
  CompareMetricId,
} from '../utils/compareChartState'

export interface CompareMetricChartProps {
  projects: CompareProjectEntry[]
  config: CompareChartConfig
  chartRange: ChartRange
}

export interface CompareMetricControlsProps {
  config: CompareChartConfig
  setConfig: Dispatch<SetStateAction<CompareChartConfig>>
}

/** The `key=value` fields of a chart's URL token, after its metric id. */
export type CompareUrlFields = Record<string, string>

/**
 * The pure half of a compare metric, shared by the URL codec, the SSR
 * prefetch and the client registry. Nothing here imports React, so the URL
 * utils and server code can use it.
 */
export interface CompareMetricDef {
  id: CompareMetricId
  label: string
  /**
   * URL codec of the metric's controls. `parse` reads the token's fields
   * (unknown keys and values fall back to defaults), `serialize` emits the
   * non-default ones. Omit for metrics without controls.
   */
  urlControls?: {
    parse: (fields: CompareUrlFields) => Partial<CompareChartControls>
    serialize: (controls: CompareChartControls) => CompareUrlFields
  }
  /**
   * Prefetches the metric's chart query into the SSR query client with the
   * same input the client chart queries, so the first paint needs no refetch.
   */
  prefetch: (
    helpers: SsrHelpers,
    projects: CompareProjectEntry[],
    config: CompareChartConfig,
    chartRange: ChartRange,
  ) => Promise<void>
  /**
   * Whether the project has data for this metric. Projects failing this
   * check stay selectable but are marked with `noDataLabel` in the picker
   * and chip strip instead of rendering an empty series. Omit when every
   * project has the metric.
   */
  hasData?: (project: CompareProjectEntry) => boolean
  /** Shown on chips and picker rows of projects failing `hasData`. */
  noDataLabel?: string
}

/**
 * A compare page metric: its definition plus its React components. The page
 * shell contains no metric-specific conditionals - adding a metric means
 * adding an entry to `COMPARE_METRIC_DEFS` and `COMPARE_METRICS`, no route,
 * page or URL codec changes.
 */
export interface CompareMetric extends CompareMetricDef {
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
}
