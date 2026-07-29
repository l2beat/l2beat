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
  chartRangeToCompareRange,
  compareRangeToChartRange,
  isSameCompareState,
} from '../utils/compareChartState'
import { parseCompareStateFromSearchParams } from '../utils/parseCompareStateFromSearchParams'

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
  const [state, setState] = useState(initialState)
  // The resolved range is kept separately so the SSR-prefetched query input
  // (computed once on the server) is reused verbatim on first paint.
  const [chartRange, setChartRange] = useState(initialChartRange)

  const validSlugs = useMemo(
    () => allProjects.map((project) => project.slug),
    [allProjects],
  )
  useCompareUrlSync(state, validSlugs, (parsed) => {
    setState(parsed)
    setChartRange(compareRangeToChartRange(parsed.range))
  })

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
    <section className="mt-4 flex flex-col gap-2 md:mt-6">
      <metric.Chart
        projects={selectedProjects}
        range={chartRange}
        scale={state.scale}
      />
      <Controls
        scale={state.scale}
        setScale={(scale) => setState((prev) => ({ ...prev, scale }))}
        range={chartRange}
        setRange={(range) => {
          setChartRange(range)
          setState((prev) => ({
            ...prev,
            range: chartRangeToCompareRange(range),
          }))
        }}
      />
    </section>
  )
}

/**
 * Keeps the URL in sync with the chart state (defaults omitted) and applies
 * URL state on browser back/forward, mirroring the interop pages.
 */
function useCompareUrlSync(
  state: CompareChartState,
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
    if (isSameCompareState(currentState, debouncedState)) {
      return
    }

    const nextUrl = buildCompareUrl(window.location.pathname, debouncedState)
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

function Controls({
  scale,
  setScale,
  range,
  setRange,
}: {
  scale: ChartScale
  setScale: (scale: ChartScale) => void
  range: ChartRange
  setRange: (range: ChartRange) => void
}) {
  const isClient = useIsClient()
  return (
    <ChartControlsWrapper>
      <div className="flex gap-1">
        {isClient ? (
          <RadioGroup
            name="compareChartScale"
            value={scale}
            onValueChange={(value) => setScale(value as ChartScale)}
          >
            <RadioGroupItem value="symlog">LOG</RadioGroupItem>
            <RadioGroupItem value="linear">LIN</RadioGroupItem>
          </RadioGroup>
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
