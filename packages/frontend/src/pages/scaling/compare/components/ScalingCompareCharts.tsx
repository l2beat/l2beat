import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard'
import { useIsClient } from '~/hooks/useIsClient'
import { useTimeout } from '~/hooks/useTimeout'
import { useUrlStateSync } from '~/hooks/useUrlStateSync'
import { CheckIcon } from '~/icons/Check'
import { CloseIcon } from '~/icons/Close'
import { CopyIcon } from '~/icons/Copy'
import { PlusIcon } from '~/icons/Plus'
import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import { cn } from '~/utils/cn'
import type { ChartRange } from '~/utils/range/range'
import { COMPARE_METRICS } from '../metrics'
import type { CompareMetric } from '../metrics/types'
import { buildCompareUrl } from '../utils/buildCompareUrl'
import {
  COMPARE_RANGE_OPTIONS,
  type CompareChartConfig,
  type CompareChartState,
  type CompareClientState,
  type CompareMetricId,
  createDefaultChartConfig,
  MAX_COMPARE_CHARTS,
  nextChartMetric,
  toCompareClientState,
  toCompareUrlState,
} from '../utils/compareChartState'
import { parseCompareStateFromSearchParams } from '../utils/parseCompareStateFromSearchParams'
import {
  CompareChartHoverProvider,
  CompareChartIdProvider,
  useCompareChartHover,
} from './CompareChartHoverContext'
import { CompareProjectPicker } from './CompareProjectPicker'
import { CompareSeriesProvider } from './CompareSeriesContext'

interface Props {
  allProjects: CompareProjectEntry[]
  initialState: CompareChartState
  defaultProjectSlugs: string[]
  initialChartRange: ChartRange
}

export function ScalingCompareCharts({
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

  const displayedMetrics = useMemo(() => {
    const unique = new Map<CompareMetricId, CompareMetric>()
    for (const chart of state.charts) {
      unique.set(chart.metric, COMPARE_METRICS[chart.metric])
    }
    return [...unique.values()]
  }, [state.charts])

  const setChartConfig = useCallback(
    (index: number): Dispatch<SetStateAction<CompareChartConfig>> =>
      (update) =>
        setState((prev) => ({
          ...prev,
          charts: prev.charts.map((chart, i) =>
            i === index
              ? typeof update === 'function'
                ? update(chart)
                : update
              : chart,
          ),
        })),
    [],
  )

  const addChart = () =>
    setState((prev) =>
      prev.charts.length >= MAX_COMPARE_CHARTS
        ? prev
        : {
            ...prev,
            charts: [
              ...prev.charts,
              createDefaultChartConfig(nextChartMetric(prev.charts)),
            ],
          },
    )

  const removeChart = (index: number) =>
    setState((prev) =>
      prev.charts.length <= 1
        ? prev
        : { ...prev, charts: prev.charts.filter((_, i) => i !== index) },
    )

  return (
    <section className="flex flex-col gap-2 max-md:mt-4 md:mt-2">
      <CompareSeriesProvider projects={selectedProjects}>
        <CompareChartHoverProvider>
          <div className="flex flex-col gap-3 max-md:px-4 lg:px-2">
            <CompareProjectPicker
              allProjects={allProjects}
              metrics={displayedMetrics}
              selectedProjects={selectedProjects}
              isDefaultSelection={state.projects.length === 0}
              onChange={(projects) =>
                setState((prev) => ({ ...prev, projects }))
              }
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CopyLinkButton
                // Serialized on click from the live state, because the
                // address bar only catches up after the URL-sync debounce.
                getShareUrl={() =>
                  window.location.origin +
                  buildCompareUrl(
                    window.location.pathname,
                    toCompareUrlState(state),
                  )
                }
              />
              <ChartRangeControls
                name="compareChart"
                value={state.chartRange}
                setValue={(chartRange) =>
                  setState((prev) => ({ ...prev, chartRange }))
                }
                options={COMPARE_RANGE_OPTIONS.map((value) => ({
                  value,
                  label: value.toUpperCase(),
                }))}
              />
            </div>
          </div>
          {state.charts.map((config, index) => (
            <CompareChartCard
              // Charts carry no identity of their own in the URL, so the
              // index is the only stable key; card-local state is limited
              // to hydration skeletons, so remounts on removal are cheap.
              key={index}
              chartId={index}
              config={config}
              chartRange={state.chartRange}
              projects={selectedProjects}
              setConfig={setChartConfig(index)}
              onRemove={
                state.charts.length > 1 ? () => removeChart(index) : undefined
              }
            />
          ))}
          <AddChartButton
            onClick={addChart}
            atCap={state.charts.length >= MAX_COMPARE_CHARTS}
          />
        </CompareChartHoverProvider>
      </CompareSeriesProvider>
    </section>
  )
}

function CompareChartCard({
  chartId,
  config,
  chartRange,
  projects,
  setConfig,
  onRemove,
}: {
  chartId: number
  config: CompareChartConfig
  chartRange: ChartRange
  projects: CompareProjectEntry[]
  setConfig: Dispatch<SetStateAction<CompareChartConfig>>
  onRemove: (() => void) | undefined
}) {
  const metric = COMPARE_METRICS[config.metric]
  const { setHoveredChartId } = useCompareChartHover()
  const chartState = useMemo(
    () => ({ ...config, chartRange }),
    [config, chartRange],
  )

  return (
    <PrimaryCard>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <MetricSwitcher
          name={`compareMetric-${chartId}`}
          value={config.metric}
          onValueChange={(metric) => setConfig((prev) => ({ ...prev, metric }))}
        />
        <div className="flex items-center gap-1">
          {metric.Controls && (
            <metric.Controls state={config} setState={setConfig} />
          )}
          {onRemove && (
            <button
              type="button"
              aria-label="Remove chart"
              onClick={onRemove}
              className="ml-1 flex size-7 cursor-pointer items-center justify-center rounded-lg hover:bg-surface-secondary primary-card:hover:bg-surface-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <CloseIcon className="size-2.5 fill-secondary" aria-hidden />
            </button>
          )}
        </div>
      </div>
      <CompareChartIdProvider chartId={chartId}>
        <div
          onMouseEnter={() => setHoveredChartId(chartId)}
          onMouseLeave={() => setHoveredChartId(undefined)}
        >
          <metric.Chart projects={projects} state={chartState} />
        </div>
      </CompareChartIdProvider>
    </PrimaryCard>
  )
}

/**
 * The metric switcher, driven entirely by the registry so new metrics show
 * up without page changes. Switching keeps the card's other settings.
 */
function MetricSwitcher({
  name,
  value,
  onValueChange,
}: {
  name: string
  value: CompareMetricId
  onValueChange: (metric: CompareMetricId) => void
}) {
  const isClient = useIsClient()
  if (!isClient) {
    return <Skeleton className="h-9 w-[340px]" />
  }
  return (
    <RadioGroup
      name={name}
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

function AddChartButton({
  onClick,
  atCap,
}: {
  onClick: () => void
  atCap: boolean
}) {
  return (
    // The button stays visible (not hidden) at the cap: a vanishing button
    // reads as a bug, while the tooltip teaches the limit. It stays a real
    // enabled element so the tooltip still receives pointer events.
    <Tooltip>
      <TooltipTrigger asChild disabled={!atCap}>
        <button
          type="button"
          aria-disabled={atCap}
          onClick={atCap ? undefined : onClick}
          className={cn(
            'flex h-12 w-full items-center justify-center gap-1.5 rounded-xl border border-divider border-dashed font-medium text-secondary text-sm',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
            atCap
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer hover:bg-surface-secondary',
          )}
        >
          <PlusIcon className="size-4" />
          Add chart
        </button>
      </TooltipTrigger>
      <TooltipContent>
        Maximum of {MAX_COMPARE_CHARTS} charts reached
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * Keeps the URL in sync with the page state (defaults omitted) and applies
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
        'bg-surface-primary hover:bg-surface-primary-hover',
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
