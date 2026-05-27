import type { ChartCommonComponentsProps } from '~/components/core/chart/ChartCommonComponents'

/** Period label for all overview chart metrics (see overviewChartRanges). */
export const OVERVIEW_CHART_PERIOD_LABEL = '(past year)'

// Shared padding for overview widget cards (stats, what's new, recent, top chains).
export const OVERVIEW_CARD_PADDING_CLASS = 'p-3 md:px-6 md:py-3'

/** Scaling / Ethereum overview widgets — matched top/bottom inset in compact layout. */
export const OVERVIEW_CHART_WIDGET_CARD_CLASS =
  'p-3 md:px-6 md:pt-3 md:pb-4 xl:pt-4 xl:pb-4'

/** Interop flows — default PrimaryCard vertical padding (taller than chart widgets). */
export const OVERVIEW_INTEROP_CARD_CLASS = 'p-4 md:px-6 md:py-5'

/** Full-width chart area inside overview cards (no horizontal inset). */
export const OVERVIEW_CHART_RIGHT_INSET_CLASS = 'min-w-0 w-full'

/** Vertical breathing room around overview sparklines. */
export const OVERVIEW_CHART_PADDING_CLASS = 'pt-2 pb-2.5'

/** Vertical offset for mirrored y-axis labels above grid lines. */
export const OVERVIEW_SPARKLINE_LABEL_DY = -7

/** Horizontal offset — nudge labels toward the line start. */
export const OVERVIEW_SPARKLINE_LABEL_DX = -4

/**
 * Mirrored y-axis tick labels on overview sparklines: small text sitting above
 * full-width horizontal grid lines (grid stays behind labels).
 */
export const OVERVIEW_SPARKLINE_Y_AXIS_TICK_CLASS = [
  '[&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-label_text]:!text-3xs',
  '[&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-label_text]:!leading-none',
  '[&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-label_text]:!fill-secondary',
  '[&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-label_text]:![text-anchor:start]',
  '[&_.recharts-yAxis-tick-labels]:!z-[200]',
  '[&_.recharts-cartesian-grid]:!z-0',
  "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:!stroke-primary/15",
  "dark:[&_.recharts-cartesian-grid_line[stroke='#ccc']]:!stroke-primary/25",
  '[&_.recharts-wrapper]:!overflow-visible [&_.recharts-surface]:!overflow-visible',
].join(' ')

/** Mirrored in-chart y-axis — labels above ticks, grid spans full plot width. */
export function getOverviewSparklineYAxisProps(
  tickFormatter: (value: number) => string,
): NonNullable<ChartCommonComponentsProps<{ timestamp: number }>['yAxis']> {
  return {
    tickCount: 3,
    tickFormatter,
    mirror: true,
    dy: OVERVIEW_SPARKLINE_LABEL_DY,
    dx: OVERVIEW_SPARKLINE_LABEL_DX,
    tick: { textAnchor: 'start' },
  }
}
