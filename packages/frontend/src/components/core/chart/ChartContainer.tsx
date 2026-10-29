import type { Milestone } from '@l2beat/config'
import type * as React from 'react'
import { Logo } from '~/components/Logo'
import { useIsNearViewport } from '~/hooks/useIsNearViewport'
import { cn } from '~/utils/cn'
import { ignorePointerWhileScrollingClassName } from '~/utils/scrollActivity'
import {
  ChartContext,
  type ChartInteractiveLegend,
  type ChartMeta,
  type ChartProject,
} from './ChartContext'
import { ChartLegend } from './ChartLegend'
import { useLegendHint } from './ChartLegendOnboardingContext'
import { ChartLoader } from './ChartLoader'
import { ChartMilestones } from './ChartMilestones'
import { ChartNoDataSourceState } from './ChartNoDataSourceState'
import { ChartNoDataState } from './ChartNoDataState'
import { ChartProjectLogo } from './ChartProjectLogo'
import { ChartSettledSize } from './ChartSettledSize'

/**
 * The frame around a chart: sizing, settled resizing, the loader and empty
 * states, logos, milestones and the legend under the chart. The chart itself
 * mounts only near the viewport.
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
  interactiveLegend?: ChartInteractiveLegend
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
  // is about to be seen.
  const [ref, shouldMountChart] = useIsNearViewport()

  const hasData = data && data.length > 1

  const metaKeys = Object.keys(meta)
  // An empty chart has no sources to deselect.
  const noDataSourcesSelected =
    metaKeys.length > 0 &&
    metaKeys.every(
      (key) => interactiveLegend && !interactiveLegend.dataKeys.includes(key),
    )
  const { keepsRoom: keepsHintRoom } = useLegendHint(interactiveLegend)
  return (
    <ChartContext.Provider value={{ meta, interactiveLegend }}>
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
              {shouldMountChart ? children : null}
            </div>
            {legend && shouldMountChart && (
              <ChartLegend leading={legendLeading} />
            )}
          </div>
        </ChartSettledSize>
        {(!!isLoading || !shouldMountChart) && (
          <ChartLoader
            animated={shouldMountChart && !!isLoading}
            className={cn(
              'absolute inset-x-0 m-auto select-none opacity-40',
              '-translate-y-1/2 top-[calc(50%-5px)] group-has-[.chart-legend]:top-[calc(50%-18px)]',
              loaderClassName,
            )}
          />
        )}
        {!hasData &&
          !isLoading &&
          !(noDataSourcesSelected && shouldMountChart) && (
            <ChartNoDataState size={size} />
          )}
        {noDataSourcesSelected && !isLoading && shouldMountChart && (
          <ChartNoDataSourceState message={noDataSourceMessage} />
        )}
        {shouldMountChart && size !== 'small' && (
          <Logo
            animated={false}
            className={cn(
              'pointer-events-none absolute right-3 bottom-12 h-8 w-20 opacity-50 group-has-[.chart-legend]:bottom-14',
              keepsHintRoom
                ? 'bottom-[60px] group-has-[.chart-legend]:bottom-[68px]'
                : 'bottom-12 group-has-[.chart-legend]:bottom-14',
              logoClassName,
            )}
          />
        )}
        {shouldMountChart && size !== 'small' && project && (
          <ChartProjectLogo
            project={project}
            className={cn(
              'pointer-events-none absolute left-3 opacity-50',
              keepsHintRoom
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
