'use client'

import * as React from 'react'
import * as RechartsPrimitive from 'recharts'
import { Logo } from '~/components/logo'

import type { Milestone } from '@l2beat/config'
import { useIsClient } from '~/hooks/use-is-client'
import { cn } from '~/utils/cn'
import { tooltipContentVariants } from '../tooltip/tooltip'
import {
  ChartDataIndicator,
  type ChartDataIndicatorType,
} from './chart-data-indicator'
import { ChartLoader } from './chart-loader'
import { ChartMilestones } from './chart-milestones'
import { ChartNoDataState } from './chart-no-data-state'

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

function ChartContainer<T extends { timestamp: number }>({
  className,
  children,
  meta,
  data,
  isLoading,
  milestones,
  ...props
}: React.ComponentProps<'div'> & {
  meta: ChartMeta
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children']
  data: T[] | undefined
  milestones?: Milestone[]
  isLoading?: boolean
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isClient = useIsClient()
  const hasData = data && data.length > 1
  return (
    <ChartContext.Provider value={{ meta }}>
      <div
        ref={ref}
        className={cn(
          'group relative h-[188px] min-h-[188px] w-full md:h-[228px] md:min-h-[228px] xl:h-[258px] xl:min-h-[258px]',
          "flex aspect-video justify-center text-xs [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          // Tooltip cursor line
          '[&_.recharts-curve.recharts-tooltip-cursor]:stroke-primary [&_.recharts-curve.recharts-tooltip-cursor]:stroke-2',
          // Tooltip cursor bar
          '[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-primary/25',
          // Tooltip
          '[&_.recharts-tooltip-wrapper]:z-110 [&_.recharts-tooltip-wrapper]:!transition-none',
          // Active dots
          "[&_.recharts-dot[stroke='#fff']]:fill-primary [&_.recharts-dot[stroke='#fff']]:stroke-none [&_.recharts-layer]:outline-none",
          // Cartesian grid line
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-primary/25 dark:[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-primary/40",
          // Cartesian X axis tick text
          '[&_.xAxis_.recharts-cartesian-axis-tick_text]:fill-secondary [&_.xAxis_.recharts-cartesian-axis-tick_text]:text-3xs [&_.xAxis_.recharts-cartesian-axis-tick_text]:font-medium [&_.xAxis_.recharts-cartesian-axis-tick_text]:leading-none',
          // Cartesian Y axis tick text
          '[&_.yAxis_.recharts-cartesian-axis-tick_text]:z-100 [&_.yAxis_.recharts-cartesian-axis-tick_text]:fill-primary/50 [&_.yAxis_.recharts-cartesian-axis-tick_text]:text-sm dark:[&_.yAxis_.recharts-cartesian-axis-tick_text]:fill-primary/70',
          // Polar grid
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-primary/25 dark:[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-primary/40",
          // Reference line
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-primary/25 dark:[&_.recharts-reference-line_[stroke='#ccc']]:stroke-primary/40",
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
              'top-[63px] group-has-[.recharts-legend-wrapper]:top-[58px]',
              'md:top-[84px] md:group-has-[.recharts-legend-wrapper]:top-[78px]',
              'xl:top-[98px] xl:group-has-[.recharts-legend-wrapper]:top-[93px]',
            )}
          />
        )}
        {!hasData && !isLoading && <ChartNoDataState />}
        {isClient && (
          <Logo
            animated={false}
            className="pointer-events-none absolute bottom-12 right-3 h-8 w-20 opacity-50 group-has-[.recharts-legend-wrapper]:bottom-14 "
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
  const { meta } = useChart()

  if (!payload?.length) {
    return null
  }

  const actualPayload = reverse ? [...payload].reverse() : payload
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2',
        verticalAlign === 'top' && 'pb-3',
        className,
      )}
    >
      {actualPayload.map((item) => {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        const key = `${nameKey ?? item.dataKey ?? 'value'}`
        const itemConfig = getPayloadConfigFromPayload(meta, item, key)

        if (!itemConfig) return null

        return (
          <div
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            key={item.value}
            className="flex items-center gap-[3px] [&>svg]:text-secondary"
          >
            <ChartDataIndicator
              type={itemConfig.indicatorType}
              backgroundColor={itemConfig.color}
            />
            <span className="text-2xs font-medium leading-none tracking-[-0.2px] text-secondary">
              {itemConfig.legendLabel ?? itemConfig.label}
            </span>
          </div>
        )
      })}
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
  ChartTooltip,
  ChartTooltipWrapper,
  ChartLegend,
  ChartLegendContent,
}
