import { useMemo, useState } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard'
import { useIsClient } from '~/hooks/useIsClient'
import { useTimeout } from '~/hooks/useTimeout'
import { useUrlStateSync } from '~/hooks/useUrlStateSync'
import { CheckIcon } from '~/icons/Check'
import { CopyIcon } from '~/icons/Copy'
import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import { cn } from '~/utils/cn'
import type { ChartRange } from '~/utils/range/range'
import { COMPARE_METRICS } from '../metrics'
import { buildCompareUrl } from '../utils/buildCompareUrl'
import {
  COMPARE_RANGE_OPTIONS,
  type CompareChartState,
  type CompareClientState,
  type CompareMetricId,
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
          metric={metric}
          selectedProjects={selectedProjects}
          isDefaultSelection={state.projects.length === 0}
          onChange={(projects) => setState((prev) => ({ ...prev, projects }))}
          className="mt-3 border-divider border-b pb-3"
        />
        <metric.Chart projects={selectedProjects} state={state} />
      </CompareSeriesProvider>
      <Controls
        range={state.chartRange}
        setRange={(chartRange) => setState((prev) => ({ ...prev, chartRange }))}
        // Serialized on click from the live state, because the address bar
        // only catches up after the URL-sync debounce.
        getShareUrl={() =>
          window.location.origin +
          buildCompareUrl(window.location.pathname, toCompareUrlState(state))
        }
      />
    </section>
  )
}

/**
 * Keeps the URL in sync with the chart state (defaults omitted) and applies
 * URL state on browser back/forward.
 */
function useCompareUrlSync(
  state: CompareClientState,
  validSlugs: string[],
  onPopState: (parsed: CompareChartState) => void,
) {
  const urlState = useMemo(() => toCompareUrlState(state), [state])
  useUrlStateSync({
    state: urlState,
    debounceMs: 300,
    parse: (searchParams) =>
      parseCompareStateFromSearchParams({ searchParams, validSlugs }),
    build: buildCompareUrl,
    onPopState,
  })
}

/**
 * The metric switcher, driven entirely by the registry so new metrics show
 * up without page changes. Switching keeps projects and range.
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
    return <Skeleton className="h-9 w-[340px]" />
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
  range,
  setRange,
  getShareUrl,
}: {
  range: ChartRange
  setRange: (range: ChartRange) => void
  getShareUrl: () => string
}) {
  return (
    <ChartControlsWrapper className="mt-2">
      <CopyLinkButton getShareUrl={getShareUrl} />
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

function CopyLinkButton({ getShareUrl }: { getShareUrl: () => string }) {
  const copy = useCopyToClipboard()
  const [copied, setCopied] = useState(false)
  useTimeout(() => setCopied(false), copied ? 1400 : null)

  return (
    <button
      type="button"
      aria-live="polite"
      onClick={() => void copy(getShareUrl()).then(setCopied)}
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-lg px-2 font-medium text-xs md:text-sm',
        'bg-surface-primary primary-card:bg-surface-secondary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
      )}
    >
      {copied ? (
        <CheckIcon className="size-4 stroke-green-700 dark:stroke-green-450" />
      ) : (
        <CopyIcon className="size-4 fill-current" />
      )}
      {copied ? 'Copied' : 'Copy link'}
    </button>
  )
}
