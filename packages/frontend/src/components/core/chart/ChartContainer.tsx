import type { Milestone } from '@l2beat/config'
import type * as React from 'react'
import { useContext, useState, useSyncExternalStore } from 'react'
import { MountedNearViewportContext } from '~/components/LazyHydrate'
import { Logo } from '~/components/Logo'
import { useIsNearViewport } from '~/hooks/useIsNearViewport'
import { cn } from '~/utils/cn'
import { ignorePointerWhileScrollingClassName } from '~/utils/scrollActivity'
import {
  ChartContext,
  type ChartMeta,
  type ChartProject,
  type ChartServerSize,
} from './ChartContext'
import { ChartLegend } from './ChartLegend'
import { useChartLegendOnboarding } from './ChartLegendOnboardingContext'
import { ChartLoader } from './ChartLoader'
import { ChartMilestones } from './ChartMilestones'
import { ChartNoDataSourceState } from './ChartNoDataSourceState'
import { ChartNoDataState } from './ChartNoDataState'
import { ChartProjectLogo } from './ChartProjectLogo'
import { ChartSettledSize } from './ChartSettledSize'

/**
 * The frame around a chart: sizing, settled resizing, the loader and empty
 * states, logos, milestones and the legend under the chart. The live chart
 * mounts only near the viewport; until then a chart whose data was in the
 * server render shows the SVG the server drew.
 */
export function ChartContainer<T extends { timestamp: number }>({
  children,
  meta,
  data,
  isLoading,
  milestones,
  size = 'regular',
  interactiveLegend,
  legend = false,
  legendLeading,
  project,
  loaderClassName,
  logoClassName,
  noDataSourceMessage,
  className,
}: {
  meta: ChartMeta
  children: React.ReactNode
  data: T[] | undefined
  interactiveLegend?: {
    dataKeys: string[]
    onItemClick: (dataKey: string) => void
    disableOnboarding?: boolean
  }
  legend?: boolean
  /** Rendered before the legend items, e.g. a show/hide-all toggle. */
  legendLeading?: React.ReactNode
  project?: ChartProject
  loaderClassName?: string
  logoClassName?: string
  noDataSourceMessage?: string
  milestones?: Milestone[]
  isLoading?: boolean
  size?: 'regular' | 'small'
  className?: string
}) {
  // Building a chart blocks the main thread, so build each one only when it
  // is about to be seen, as it is in a section mounted near the viewport.
  const [ref, isNearViewport] = useIsNearViewport()
  const isInMountedSection = useContext(MountedNearViewportContext)
  const shouldMountChart = isNearViewport || isInMountedSection

  const hasData = data && data.length > 1

  // Decided once: a chart first rendered in the browser (e.g. in a tab opened
  // later) has no server markup to show.
  const isHydrating = useIsHydrating()
  const [hasServerChart] = useState(isHydrating && !isLoading && !!hasData)
  const showsServerChart = hasServerChart && !shouldMountChart
  const showsChart = shouldMountChart || showsServerChart

  const metaKeys = Object.keys(meta)
  // An empty chart has no sources to deselect.
  const noDataSourcesSelected =
    metaKeys.length > 0 &&
    metaKeys.every(
      (key) => interactiveLegend && !interactiveLegend.dataKeys.includes(key),
    )
  const { hasFinishedOnboardingInitial } = useChartLegendOnboarding()
  return (
    <ChartContext.Provider
      value={{
        meta,
        interactiveLegend,
        serverSize: showsServerChart ? getServerSize(size, legend) : undefined,
      }}
    >
      <div ref={ref} className="group relative">
        <ChartSettledSize
          className={cn(
            size === 'regular' &&
              'h-[188px] min-h-[188px] w-full group-data-project-page/section-wrapper:max-md:h-[50vh] group-data-project-page/section-wrapper:max-md:min-h-[50vh] md:h-[228px] md:min-h-[228px] group-data-project-page/section-wrapper:md:h-[300px] 2xl:h-[258px] 2xl:min-h-[258px]',
            size === 'small' && 'h-[114px] min-h-[114px] w-full',
            className,
          )}
        >
          <div className="flex size-full flex-col">
            <div
              className={cn(
                'relative min-h-0 flex-1 select-none text-xs outline-none',
                ignorePointerWhileScrollingClassName,
                (isLoading || !hasData) && 'pointer-events-none',
                noDataSourcesSelected && '[&_[data-chart-tooltip]]:hidden',
              )}
            >
              {showsChart ? children : null}
            </div>
            {legend && showsChart && <ChartLegend leading={legendLeading} />}
          </div>
        </ChartSettledSize>
        {(!!isLoading || !showsChart) && (
          <ChartLoader
            animated={shouldMountChart && !!isLoading}
            className={cn(
              'absolute inset-x-0 m-auto select-none opacity-40',
              '-translate-y-1/2 top-[calc(50%-5px)] group-has-[.chart-legend]:top-[calc(50%-18px)]',
              loaderClassName,
            )}
          />
        )}
        {!hasData && !isLoading && !(noDataSourcesSelected && showsChart) && (
          <ChartNoDataState size={size} />
        )}
        {noDataSourcesSelected && !isLoading && showsChart && (
          <ChartNoDataSourceState message={noDataSourceMessage} />
        )}
        {showsChart && size !== 'small' && (
          <Logo
            animated={false}
            className={cn(
              'pointer-events-none absolute right-3 bottom-12 h-8 w-20 opacity-50 group-has-[.chart-legend]:bottom-14',
              !!interactiveLegend &&
                !interactiveLegend.disableOnboarding &&
                !hasFinishedOnboardingInitial
                ? 'bottom-[60px] group-has-[.chart-legend]:bottom-[68px]'
                : 'bottom-12 group-has-[.chart-legend]:bottom-14',
              logoClassName,
            )}
          />
        )}
        {showsChart && size !== 'small' && project && (
          <ChartProjectLogo
            project={project}
            className={cn(
              'pointer-events-none absolute left-3 opacity-50',
              !!interactiveLegend &&
                !interactiveLegend.disableOnboarding &&
                !hasFinishedOnboardingInitial
                ? 'bottom-[68px] group-has-[.chart-legend]:bottom-[76px]'
                : 'bottom-14 group-has-[.chart-legend]:bottom-16',
            )}
          />
        )}
        {!isLoading && milestones && (
          <ChartMilestones data={data} milestones={milestones} />
        )}
      </div>
    </ChartContext.Provider>
  )
}

const LEGEND_HEIGHT = 18

/**
 * The plot in a 390px-wide window. One HTML serves every device (pages are
 * cached by URL alone), and the server's SVG stretches to the box the chart
 * really gets: exact on phones, which wait longest for the live chart, and
 * drawn narrow, so its axis labels cannot crowd in a wider box.
 */
function getServerSize(
  size: 'regular' | 'small',
  legend: boolean,
): ChartServerSize {
  const legendHeight = legend ? LEGEND_HEIGHT : 0
  const height = size === 'small' ? 114 : 188
  return { width: 358, height: height - legendHeight }
}

const subscribeToNothing = () => () => {}

/** True on the server and while React hydrates its HTML. */
function useIsHydrating() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => false,
    () => true,
  )
}
