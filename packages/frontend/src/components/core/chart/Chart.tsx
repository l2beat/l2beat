import type { Milestone } from '@l2beat/config'
import * as React from 'react'
import * as RechartsPrimitive from 'recharts'
import { Logo } from '~/components/Logo'
import { useIsClient } from '~/hooks/useIsClient'
import { CursorClickIcon } from '~/icons/CursorClick'
import { cn } from '~/utils/cn'
import { OverflowWrapper } from '../OverflowWrapper'
import { tooltipContentVariants } from '../tooltip/Tooltip'
import {
  ChartDataIndicator,
  type ChartDataIndicatorType,
} from './ChartDataIndicator'
import { useChartLegendOnboarding } from './ChartLegendOnboardingContext'
import { ChartLoader } from './ChartLoader'
import { ChartMilestones } from './ChartMilestones'
import { ChartNoDataSourceState } from './ChartNoDataSourceState'
import { ChartNoDataState } from './ChartNoDataState'

export type ChartMeta = Record<
  string,
  | {
      label: React.ReactNode
      color: string
      legendLabel?: string
      indicatorType: ChartDataIndicatorType
    }
  | undefined
>

type ChartContextProps = {
  meta: ChartMeta
  interactiveLegend?: {
    dataKeys: string[]
    onItemClick: (dataKey: string) => void
    disableOnboarding?: boolean
  }
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

export function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />')
  }

  return context
}

const chartContainerClassNames = cn(
  'group relative',
  "flex aspect-video justify-center text-xs [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
  // Tooltip cursor line
  '[&_.recharts-curve.recharts-tooltip-cursor]:stroke-2 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-primary',
  // Tooltip cursor bar
  '[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-primary/25',
  // Tooltip
  '[&_.recharts-tooltip-wrapper]:z-110 [&_.recharts-tooltip-wrapper]:transition-none!',
  // Active dots
  "[&_.recharts-dot[stroke='#fff']]:fill-primary [&_.recharts-dot[stroke='#fff']]:stroke-none [&_.recharts-layer]:outline-none",
  // Cartesian grid line
  "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-primary/25 dark:[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-primary/40",
  // Cartesian X axis tick text
  '[&_.xAxis_.recharts-cartesian-axis-tick_text]:fill-secondary [&_.xAxis_.recharts-cartesian-axis-tick_text]:font-medium [&_.xAxis_.recharts-cartesian-axis-tick_text]:text-3xs [&_.xAxis_.recharts-cartesian-axis-tick_text]:leading-none',
  // Cartesian Y axis tick text
  '[&_.yAxis_.recharts-cartesian-axis-tick_text]:z-100 [&_.yAxis_.recharts-cartesian-axis-tick_text]:fill-primary/50 [&_.yAxis_.recharts-cartesian-axis-tick_text]:text-sm dark:[&_.yAxis_.recharts-cartesian-axis-tick_text]:fill-primary/70',
  // Polar grid
  "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-primary/25 dark:[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-primary/40",
  // Reference line
  "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-primary/25 dark:[&_.recharts-reference-line_[stroke='#ccc']]:stroke-primary/40",
)

function ChartContainer<T extends { timestamp: number }>({
  className,
  children,
  meta,
  data,
  isLoading,
  milestones,
  loaderClassName,
  logoClassName,
  size = 'regular',
  interactiveLegend,
  ...props
}: React.ComponentProps<'div'> & {
  meta: ChartMeta
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children']
  data: T[] | undefined
  interactiveLegend?: {
    dataKeys: string[]
    onItemClick: (dataKey: string) => void
    disableOnboarding?: boolean
  }
  milestones?: Milestone[]
  loaderClassName?: string
  logoClassName?: string
  isLoading?: boolean
  size?: 'regular' | 'small'
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isClient = useIsClient()

  const hasData = data && data.length > 1

  const noDataSourcesSelected = Object.keys(meta).every(
    (key) => interactiveLegend && !interactiveLegend?.dataKeys.includes(key),
  )
  return (
    <ChartContext.Provider value={{ meta, interactiveLegend }}>
      <div
        ref={ref}
        className={cn(
          chartContainerClassNames,
          size === 'regular' &&
            'h-[188px] min-h-[188px] w-full group-data-project-page/section-wrapper:max-md:h-[50vh] group-data-project-page/section-wrapper:max-md:min-h-[50vh] md:h-[228px] md:min-h-[228px] group-data-project-page/section-wrapper:md:h-[300px] 2xl:h-[258px] 2xl:min-h-[258px]',
          size === 'small' && 'h-[114px] min-h-[114px] w-full',
          noDataSourcesSelected &&
            '[&_.recharts-tooltip-cursor]:hidden [&_.recharts-tooltip-wrapper]:hidden',
          className,
        )}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer
          className={cn(isLoading && 'pointer-events-none')}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
        {(!!isLoading || !isClient) && (
          <ChartLoader
            className={cn(
              'absolute inset-x-0 m-auto select-none opacity-40',
              '-translate-y-1/2 top-[calc(50%-5px)] group-has-[.recharts-legend-wrapper]:top-[calc(50%-18px)]',
              loaderClassName,
            )}
          />
        )}
        {!hasData && !isLoading && <ChartNoDataState size={size} />}
        {noDataSourcesSelected && !isLoading && isClient && (
          <ChartNoDataSourceState />
        )}
        {isClient && size !== 'small' && (
          <Logo
            animated={false}
            className={cn(
              'pointer-events-none absolute right-3 bottom-12 h-8 w-20 opacity-50 group-has-[.recharts-legend-wrapper]:bottom-14',
              logoClassName,
            )}
          />
        )}
        {!isLoading && milestones && (
          <ChartMilestones data={data} milestones={milestones} ref={ref} />
        )}
      </div>
    </ChartContext.Provider>
  )
}
ChartContainer.displayName = 'Chart'

function SimpleChartContainer({
  className,
  children,
  meta,
  ...props
}: React.ComponentProps<'div'> & {
  meta: ChartMeta
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children']
}) {
  return (
    <ChartContext.Provider value={{ meta }}>
      <div className={cn(chartContainerClassNames, className)} {...props}>
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}
SimpleChartContainer.displayName = 'Chart'

const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipWrapper({ children }: { children: React.ReactNode }) {
  return <div className={tooltipContentVariants()}>{children}</div>
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  payload,
  verticalAlign = 'bottom',
  nameKey,
  reverse = false,
  children,
}: React.ComponentProps<'div'> &
  Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
    nameKey?: string
    reverse?: boolean
  }) {
  const id = React.useId()

  const contentRef = React.useRef<HTMLDivElement>(null)
  const { meta, interactiveLegend } = useChart()

  const {
    currentLegendOnboardingId,
    hasFinishedOnboarding,
    setHasFinishedOnboarding,
    hasFinishedOnboardingInitial,
  } = useChartLegendOnboarding()

  if (!payload?.length) {
    return null
  }

  const actualPayload = reverse ? [...payload].reverse() : payload
  return (
    <div
      className={cn(
        'relative mx-auto flex w-max max-w-full items-center',
        interactiveLegend &&
          !hasFinishedOnboardingInitial &&
          !interactiveLegend.disableOnboarding &&
          'mb-3',
      )}
    >
      {children}
      <OverflowWrapper childrenRef={contentRef} className="min-w-0">
        <div
          className={cn(
            'flex h-3.5 w-max items-center gap-2',
            verticalAlign === 'top' && 'pb-3',
            className,
          )}
          ref={contentRef}
        >
          {actualPayload.map((item) => {
            const key = `${nameKey ?? item.dataKey ?? 'value'}`
            const itemConfig = getPayloadConfigFromPayload(meta, item, key)

            if (!itemConfig || item.type === 'none') return null

            const isHidden =
              interactiveLegend && !interactiveLegend?.dataKeys?.includes(key)
            return (
              <div
                key={item.value}
                className={cn(
                  'group/legend-item flex items-center gap-[3px] transition-opacity [&>svg]:text-secondary',
                  interactiveLegend && 'cursor-pointer select-none',
                  isHidden && 'opacity-50',
                )}
                onClick={
                  interactiveLegend
                    ? () => {
                        interactiveLegend.onItemClick(key)
                        if (!interactiveLegend.disableOnboarding) {
                          setHasFinishedOnboarding(true)
                        }
                      }
                    : undefined
                }
              >
                <ChartDataIndicator
                  type={itemConfig.indicatorType}
                  backgroundColor={itemConfig.color}
                />
                <span
                  className={cn(
                    'text-nowrap font-medium text-2xs text-secondary leading-none tracking-[-0.2px] transition-opacity',
                    !isHidden &&
                      interactiveLegend &&
                      'group-hover/legend-item:opacity-50',
                    isHidden && 'line-through',
                  )}
                >
                  {itemConfig.legendLabel ?? itemConfig.label}
                </span>
              </div>
            )
          })}
        </div>
      </OverflowWrapper>
      {!hasFinishedOnboarding &&
        interactiveLegend &&
        !interactiveLegend.disableOnboarding && (
          <div
            id={id}
            className={cn(
              '-bottom-4 pointer-events-none absolute inset-x-0 min-w-44 rounded-xs text-center text-brand text-label-value-12 italic transition-[opacity,scale] ease-out group-hover:scale-[1.15]',
              currentLegendOnboardingId !== id && 'opacity-0',
            )}
            data-role="legend-onboarding"
          >
            <CursorClickIcon className="-top-0.5 relative inline-block fill-current" />
            Try clicking legend items to toggle data
          </div>
        )}
    </div>
  )
}
ChartLegendContent.displayName = 'ChartLegend'

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartMeta,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined
  }

  const payloadPayload =
    'payload' in payload &&
    typeof payload.payload === 'object' &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === 'string'
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  SimpleChartContainer,
}
