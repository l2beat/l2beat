import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChartScale } from '~/components/chart/types'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useEventListener } from '~/hooks/useEventListener'
import { useIsClient } from '~/hooks/useIsClient'
import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import type { ChartRange } from '~/utils/range/range'
import { COMPARE_METRICS } from '../metrics'
import { buildCompareUrl } from '../utils/buildCompareUrl'
import {
  COMPARE_RANGE_OPTIONS,
  type CompareChartState,
  type CompareClientState,
  type CompareMetricId,
  type CompareViewMode,
  isSameCompareState,
  toCompareClientState,
  toCompareUrlState,
} from '../utils/compareChartState'
import { parseCompareStateFromSearchParams } from '../utils/parseCompareStateFromSearchParams'
import { CompareProjectPicker } from './CompareProjectPicker'
import { CompareSeriesProvider } from './CompareSeriesContext'

interface Props {
  allProjects: CompareProjectEntry[]
  initialState: CompareChartState
  defaultProjectSlugs: string[]
  initialChartRange: ChartRange
}

export function ScalingCompareChart({
  allProjects,
  initialState,
  defaultProjectSlugs,
  initialChartRange,
}: Props) {
  // Seeded with the server-resolved range so the SSR-prefetched query input
  // is reused verbatim on first paint.
  const [state, setState] = useState(() =>
    toCompareClientState(initialState, initialChartRange),
  )

  const validSlugs = useMemo(
    () => allProjects.map((project) => project.slug),
    [allProjects],
  )
  useCompareUrlSync(state, validSlugs, (parsed) =>
    setState(toCompareClientState(parsed)),
  )

  const selectedProjects = useMemo(() => {
    const bySlug = new Map(
      allProjects.map((project) => [project.slug, project]),
    )
    const slugs =
      state.projects.length > 0 ? state.projects : defaultProjectSlugs
    return slugs
      .map((slug) => bySlug.get(slug))
      .filter((project) => project !== undefined)
  }, [state.projects, allProjects, defaultProjectSlugs])

  const metric = COMPARE_METRICS[state.metric]

  return (
    <section className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <MetricSwitcher
          value={state.metric}
          onValueChange={(metric) => setState((prev) => ({ ...prev, metric }))}
        />
        {metric.Controls && (
          <metric.Controls state={state} setState={setState} />
        )}
      </div>
      <CompareSeriesProvider projects={selectedProjects}>
        <CompareProjectPicker
          allProjects={allProjects}
          selectedProjects={selectedProjects}
          isDefaultSelection={state.projects.length === 0}
          onChange={(projects) => setState((prev) => ({ ...prev, projects }))}
          className="mt-3 border-divider border-b pb-3"
        />
        <metric.Chart projects={selectedProjects} state={state} />
      </CompareSeriesProvider>
      <Controls
        mode={state.mode}
        setMode={(mode) => setState((prev) => ({ ...prev, mode }))}
        scale={state.scale}
        setScale={(scale) => setState((prev) => ({ ...prev, scale }))}
        range={state.chartRange}
        setRange={(chartRange) => setState((prev) => ({ ...prev, chartRange }))}
      />
    </section>
  )
}

/**
 * Keeps the URL in sync with the chart state (defaults omitted) and applies
 * URL state on browser back/forward, mirroring the interop pages.
 */
function useCompareUrlSync(
  state: CompareClientState,
  validSlugs: string[],
  onPopState: (parsed: CompareChartState) => void,
) {
  const debouncedState = useDebouncedValue(state, 300)
  const skipNextUrlUpdate = useRef(false)

  useEffect(() => {
    if (skipNextUrlUpdate.current) {
      skipNextUrlUpdate.current = false
      return
    }

    const currentState = parseCompareStateFromSearchParams({
      searchParams: new URLSearchParams(window.location.search),
      validSlugs,
    })
    const urlState = toCompareUrlState(debouncedState)
    if (isSameCompareState(currentState, urlState)) {
      return
    }

    const nextUrl = buildCompareUrl(window.location.pathname, urlState)
    const currentUrl = window.location.pathname + window.location.search
    if (nextUrl === currentUrl) {
      return
    }

    window.history.pushState({}, '', nextUrl)
  }, [debouncedState, validSlugs])

  useEventListener('popstate', () => {
    skipNextUrlUpdate.current = true

    onPopState(
      parseCompareStateFromSearchParams({
        searchParams: new URLSearchParams(window.location.search),
        validSlugs,
      }),
    )
  })
}

/**
 * The metric switcher, driven entirely by the registry so new metrics show
 * up without page changes. Switching keeps projects, range and view mode.
 */
function MetricSwitcher({
  value,
  onValueChange,
}: {
  value: CompareMetricId
  onValueChange: (metric: CompareMetricId) => void
}) {
  const isClient = useIsClient()
  if (!isClient) {
    return <Skeleton className="h-9 w-[190px]" />
  }
  return (
    <RadioGroup
      name="compareMetric"
      aria-label="Chart metric"
      value={value}
      onValueChange={(value) => onValueChange(value as CompareMetricId)}
      variant="highlighted"
      className="h-9"
    >
      {Object.values(COMPARE_METRICS).map((metric) => (
        <RadioGroupItem
          key={metric.id}
          value={metric.id}
          className="h-full px-2 text-sm"
        >
          {metric.label}
        </RadioGroupItem>
      ))}
    </RadioGroup>
  )
}

function Controls({
  mode,
  setMode,
  scale,
  setScale,
  range,
  setRange,
}: {
  mode: CompareViewMode
  setMode: (mode: CompareViewMode) => void
  scale: ChartScale
  setScale: (scale: ChartScale) => void
  range: ChartRange
  setRange: (range: ChartRange) => void
}) {
  const isClient = useIsClient()
  return (
    <ChartControlsWrapper className="mt-2">
      <div className="flex flex-wrap gap-1">
        {isClient ? (
          <>
            <RadioGroup
              name="compareViewMode"
              aria-label="View mode"
              value={mode}
              onValueChange={(value) => setMode(value as CompareViewMode)}
            >
              <RadioGroupItem value="absolute">ABSOLUTE</RadioGroupItem>
              <RadioGroupItem value="indexed">INDEXED</RadioGroupItem>
            </RadioGroup>
            {/* Log scale of an index is meaningless, so the toggle is hidden
                in indexed mode. */}
            {mode === 'absolute' && (
              <RadioGroup
                name="compareChartScale"
                aria-label="Chart scale"
                value={scale}
                onValueChange={(value) => setScale(value as ChartScale)}
              >
                <RadioGroupItem value="symlog">LOG</RadioGroupItem>
                <RadioGroupItem value="linear">LIN</RadioGroupItem>
              </RadioGroup>
            )}
          </>
        ) : (
          <Skeleton className="h-8 w-[91px] md:w-[95px]" />
        )}
      </div>
      <ChartRangeControls
        name="compareChart"
        value={range}
        setValue={setRange}
        options={COMPARE_RANGE_OPTIONS.map((value) => ({
          value,
          label: value.toUpperCase(),
        }))}
      />
    </ChartControlsWrapper>
  )
}
