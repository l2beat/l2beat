import { assert } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  Treemap,
} from 'recharts'
import { ChartTooltipWrapper } from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { OverflowWrapper } from '~/components/core/OverflowWrapper'
import type { TvsProjectFilter } from '~/server/features/scaling/tvs/utils/projectFilterUtils'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

interface Props {
  filter: TvsProjectFilter
  range: TvsChartRange
}

export function ScalingStablecoinPercentageChart({ filter, range }: Props) {
  const [excluded, setExcluded] = useState<string[]>([])

  const { data } = api.tvs.etherAndStablecoinsCharts.useQuery({
    range,
    filter,
  })

  const allItemNames = useMemo(() => {
    return Object.keys(data?.chart.at(-1)?.[1] ?? {})
  }, [data])

  const chartData: { name: string; value: number }[] | undefined =
    useMemo(() => {
      const last = data?.chart.at(-1)?.[1] ?? {}
      return Object.entries(last)
        .map(([name, value]) => {
          if (excluded.includes(name)) {
            return
          }
          return {
            name,
            value,
          }
        })
        .filter((e) => e !== undefined)
    }, [data, excluded])

  return (
    <div className="h-[188px] min-h-[188px] md:h-[228px] md:min-h-[228px] 2xl:h-[258px] 2xl:min-h-[258px]">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={chartData}
          dataKey="value"
          stroke="#fff"
          fill="#8884d8"
          content={<CustomizedContent colors={COLORS} />}
          isAnimationActive={false}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
      <div className="mx-1 mt-3">
        <div className="mx-auto flex w-max max-w-full items-center">
          <OverflowWrapper className="min-w-0">
            <div className={cn('flex h-3.5 w-max items-center gap-2')}>
              {allItemNames.map((name, index) => {
                const isHidden = excluded.includes(name)
                return (
                  <div
                    key={name}
                    className={cn(
                      'group/legend-item flex items-center gap-[3px] transition-opacity [&>svg]:text-secondary',
                      'cursor-pointer select-none',
                      isHidden && 'opacity-50',
                    )}
                    onClick={() =>
                      setExcluded((prev) => {
                        if (prev.includes(name)) {
                          return prev.filter((prevName) => prevName !== name)
                        }
                        return [...prev, name]
                      })
                    }
                  >
                    <ChartDataIndicator
                      type={{ shape: 'square' }}
                      backgroundColor={COLORS[index] ?? COLORS.at(-1)}
                    />
                    <span
                      className={cn(
                        'text-nowrap font-medium text-2xs text-secondary leading-none tracking-[-0.2px] transition-opacity',
                        !isHidden && 'group-hover/legend-item:opacity-50',
                        isHidden && 'line-through',
                      )}
                    >
                      {name}
                    </span>
                  </div>
                )
              })}
            </div>
          </OverflowWrapper>
        </div>
      </div>
    </div>
  )
}

const COLORS = [
  'var(--chart-stablecoin-1)',
  'var(--chart-stablecoin-2)',
  'var(--chart-stablecoin-3)',
  'var(--chart-stablecoin-4)',
  'var(--chart-stablecoin-5)',
  'var(--chart-stablecoin-6)',
  'var(--chart-stablecoin-7)',
  'var(--chart-stablecoin-8)',
  'var(--chart-stablecoin-9)',
  'var(--chart-stablecoin-10)',
  '#ffffff00',
]

// biome-ignore lint/suspicious/noExplicitAny: POC
const CustomizedContent = (props: any) => {
  const { x, y, width, height, index, colors, name } = props

  const fontSize = Math.min(width / 8, height / 4)
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        ry={4}
        style={{
          fill: colors[index] ?? colors.at(-1),
          stroke: '#FAFAFA',
          strokeWidth: 4,
          strokeOpacity: 1,
        }}
      />
      {fontSize >= 5 ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + fontSize / 2}
          textAnchor="middle"
          fill="#fff"
          strokeWidth={0}
          fontSize={fontSize}
        >
          {name}
        </text>
      ) : null}
    </g>
  )
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload) return null

  const actualPayload = payload[0]
  assert(
    actualPayload && actualPayload.payload.name && actualPayload.value,
    'No payload',
  )
  return (
    <ChartTooltipWrapper>
      <div className="flex flex-col">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {actualPayload.payload.name}
        </div>
        <span className="whitespace-nowrap font-medium text-label-value-15 tabular-nums">
          {formatCurrency(actualPayload.value, 'usd')}
        </span>
      </div>
    </ChartTooltipWrapper>
  )
}
