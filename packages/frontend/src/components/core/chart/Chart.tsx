import type { Milestone } from '@l2beat/config'
import * as React from 'react'
import * as RechartsPrimitive from 'recharts'
import { Logo } from '~/components/Logo'
import { useEventListener } from '~/hooks/useEventListener'
import { useIsClient } from '~/hooks/useIsClient'
import { cn } from '~/utils/cn'
import { OverflowWrapper } from '../OverflowWrapper'
import { tooltipContentVariants } from '../tooltip/Tooltip'
import {
  ChartDataIndicator,
  type ChartDataIndicatorType,
} from './ChartDataIndicator'
import { ChartLoader } from './ChartLoader'
import { ChartMilestones } from './ChartMilestones'
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
  ...props
}: React.ComponentProps<'div'> & {
  meta: ChartMeta
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children']
  data: T[] | undefined
  milestones?: Milestone[]
  loaderClassName?: string
  logoClassName?: string
  isLoading?: boolean
  size?: 'regular' | 'small'
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isClient = useIsClient()

  useEventListener(
    'touchstart',
    () => {
      document.body.classList.add('overflow-x-clip')
      document.documentElement.classList.add('overflow-x-clip')
    },
    ref,
  )
  useEventListener(
    'touchend',
    () => {
      document.body.classList.remove('overflow-x-clip')
      document.documentElement.classList.remove('overflow-x-clip')
    },
    ref,
  )

  const hasData = data && data.length > 1
  return (
    <ChartContext.Provider value={{ meta }}>
      <div
        ref={ref}
        className={cn(
          chartContainerClassNames,
          size === 'regular' &&
            'h-[188px] min-h-[188px] w-full group-data-project-page/section-wrapper:max-md:h-[50vh] group-data-project-page/section-wrapper:max-md:min-h-[50vh] md:h-[228px] md:min-h-[228px] group-data-project-page/section-wrapper:md:h-[300px] 2xl:h-[258px] 2xl:min-h-[258px]',
          size === 'small' && 'h-[114px] min-h-[114px] w-full',
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
              '-translate-y-1/2 top-[calc(50%-5px)] group-has-[.recharts-legend-wrapper]:top-[calc(50%-11px)]',
              loaderClassName,
            )}
          />
        )}
        {!hasData && !isLoading && <ChartNoDataState size={size} />}
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
}: React.ComponentProps<'div'> &
  Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
    nameKey?: string
    reverse?: boolean
  }) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const { meta } = useChart()

  if (!payload?.length) {
    return null
  }

  const actualPayload = reverse ? [...payload].reverse() : payload
  return (
    <OverflowWrapper childrenRef={contentRef}>
      <div
        className={cn(
          'mx-auto flex w-fit items-center gap-2',
          verticalAlign === 'top' && 'pb-3',
          className,
        )}
        ref={contentRef}
      >
        {actualPayload.map((item) => {
          const key = `${nameKey ?? item.dataKey ?? 'value'}`
          const itemConfig = getPayloadConfigFromPayload(meta, item, key)

          if (!itemConfig || item.type === 'none') return null

          return (
            <div
              key={item.value}
              className="flex items-center gap-[3px] [&>svg]:text-secondary"
            >
              <ChartDataIndicator
                type={itemConfig.indicatorType}
                backgroundColor={itemConfig.color}
              />
              <span className="text-nowrap font-medium text-2xs text-secondary leading-none tracking-[-0.2px]">
                {itemConfig.legendLabel ?? itemConfig.label}
              </span>
            </div>
          )
        })}
      </div>
    </OverflowWrapper>
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
