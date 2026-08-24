import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { DashedButton } from '~/components/core/DashedButton'
import { OverflowWrapper } from '~/components/core/OverflowWrapper'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useIsClient } from '~/hooks/useIsClient'
import { useTimeout } from '~/hooks/useTimeout'
import { useUrlStateSync } from '~/hooks/useUrlStateSync'
import { CheckIcon } from '~/icons/Check'
import { CloseIcon } from '~/icons/Close'
import { CopyIcon } from '~/icons/Copy'
import { PlusIcon } from '~/icons/Plus'
import type { CompareProjectEntry } from '~/server/features/layer2s/compare/getCompareProjectEntries'
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
import { CompareChartHoveredProvider } from './CompareChartHoverContext'
import { CompareProjectPicker } from './CompareProjectPicker'
import { CompareSeriesProvider } from './CompareSeriesContext'

interface Props {
  allProjects: CompareProjectEntry[]
  initialState: CompareChartState
  defaultProjectSlugs: string[]
  initialChartRange: ChartRange
}

export function L2CompareCharts({
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
  // The chart card under the pointer, if any. Recharts syncs the hover to
  // every chart; only this one renders the full tooltip.
  const [hoveredChartId, setHoveredChartId] = useState<number>()

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
    const slugs = state.projects ?? defaultProjectSlugs
    return slugs
      .map((slug) => bySlug.get(slug))
      .filter((project) => project !== undefined)
  }, [state.projects, allProjects, defaultProjectSlugs])
  const queryProjects = useDebouncedValue(selectedProjects, 400)

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
        <div className="flex flex-col gap-3 max-md:px-4 lg:px-2">
          <CompareProjectPicker
            allProjects={allProjects}
            metrics={displayedMetrics}
            selectedProjects={selectedProjects}
            isDefaultSelection={state.projects === undefined}
            onChange={(projects) => setState((prev) => ({ ...prev, projects }))}
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
        <div className="flex flex-col md:gap-2">
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
              queryProjects={queryProjects}
              setConfig={setChartConfig(index)}
              isHovered={
                hoveredChartId === undefined || hoveredChartId === index
              }
              onHoverChange={(hovered) =>
                setHoveredChartId((prev) =>
                  hovered ? index : prev === index ? undefined : prev,
                )
              }
              onRemove={
                state.charts.length > 1 ? () => removeChart(index) : undefined
              }
            />
          ))}
        </div>
        <AddChartButton
          onClick={addChart}
          atCap={state.charts.length >= MAX_COMPARE_CHARTS}
        />
      </CompareSeriesProvider>
    </section>
  )
}

function CompareChartCard({
  chartId,
  config,
  chartRange,
  projects,
  queryProjects,
  setConfig,
  isHovered,
  onHoverChange,
  onRemove,
}: {
  chartId: number
  config: CompareChartConfig
  chartRange: ChartRange
  projects: CompareProjectEntry[]
  queryProjects: CompareProjectEntry[]
  setConfig: Dispatch<SetStateAction<CompareChartConfig>>
  /** False while another card is hovered, so this card's tooltip hides. */
  isHovered: boolean
  onHoverChange: (hovered: boolean) => void
  onRemove: (() => void) | undefined
}) {
  const metric = COMPARE_METRICS[config.metric]

  return (
    <PrimaryCard>
      <div className="flex items-center justify-between gap-x-2 md:gap-x-4">
        <MetricSwitcher
          name={`compareMetric-${chartId}`}
          value={config.metric}
          onValueChange={(metric) => setConfig((prev) => ({ ...prev, metric }))}
        />
        {onRemove && (
          <button
            type="button"
            aria-label="Remove chart"
            onClick={onRemove}
            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg hover:bg-surface-secondary primary-card:hover:bg-surface-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <CloseIcon className="size-2.5 fill-secondary" aria-hidden />
          </button>
        )}
      </div>
      <CompareChartHoveredProvider isHovered={isHovered}>
        {/* Touch fires no mouseenter while dragging and Recharts keeps the
            tooltip open after touchend, so the touched card is registered
            explicitly and stays the hovered one until another is touched. */}
        <div
          onMouseEnter={() => onHoverChange(true)}
          onMouseLeave={() => onHoverChange(false)}
          onTouchStart={() => onHoverChange(true)}
        >
          <metric.Chart
            projects={projects}
            queryProjects={queryProjects}
            config={config}
            chartRange={chartRange}
          />
        </div>
      </CompareChartHoveredProvider>
      {metric.Controls && (
        <div className="mt-3 flex flex-wrap items-center gap-1">
          <metric.Controls config={config} setConfig={setConfig} />
        </div>
      )}
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
    return <Skeleton className="h-9 w-[300px] md:w-[340px]" />
  }
  return (
    <OverflowWrapper className="min-w-0">
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
            className="h-full whitespace-nowrap px-1.5 text-xs md:px-2 md:text-sm"
          >
            {metric.label}
          </RadioGroupItem>
        ))}
      </RadioGroup>
    </OverflowWrapper>
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
    <div className="max-md:px-4">
      <Tooltip>
        <TooltipTrigger asChild disabled={!atCap}>
          <DashedButton
            aria-disabled={atCap}
            onClick={atCap ? undefined : onClick}
            className="h-12 w-full rounded-xl"
          >
            <PlusIcon className="size-4" />
            Add chart
          </DashedButton>
        </TooltipTrigger>
        <TooltipContent>
          Maximum of {MAX_COMPARE_CHARTS} charts reached
        </TooltipContent>
      </Tooltip>
    </div>
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
        'bg-surface-primary',
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
