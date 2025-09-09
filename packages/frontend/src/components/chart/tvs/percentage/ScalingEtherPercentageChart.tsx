import { assert } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  Treemap,
} from 'recharts'
import { ChartTooltipWrapper } from '~/components/core/chart/Chart'
import { OverflowWrapper } from '~/components/core/OverflowWrapper'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import type { TvsProjectFilter } from '~/server/features/scaling/tvs/utils/projectFilterUtils'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

interface Props {
  filter: TvsProjectFilter
  range: TvsChartRange
}

export function ScalingEtherPercentageChart({ filter, range }: Props) {
  const [excluded, setExcluded] = useState<string[]>([])

  const { data } = api.tvs.etherAndStablecoinsCharts.useQuery({
    range,
    filter,
  })
  const allItemNames = useMemo(() => {
    return Object.keys(data?.ether ?? {})
  }, [data])

  const maxChange = useMemo(() => {
    return Math.max(
      ...Object.values(data?.ether ?? {}).map((data) => data.change),
    )
  }, [data])

  const minChange = useMemo(() => {
    return Math.min(
      ...Object.values(data?.ether ?? {}).map((data) => data.change),
    )
  }, [data])

  const chartData:
    | { name: string; value: number; change: number }[]
    | undefined = useMemo(() => {
    const last = data?.ether ?? {}
    return Object.entries(last)
      .map(([name, data]) => {
        if (excluded.includes(name)) {
          return
        }
        return {
          name,
          value: data.value,
          change: data.change,
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
          content={
            <CustomizedContent
              colors={COLORS}
              maxChange={maxChange}
              minChange={minChange}
            />
          }
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
  'var(--chart-ethereum)',
  'var(--chart-ether-1)',
  'var(--chart-ether-2)',
  'var(--chart-ether-3)',
  'var(--chart-ether-4)',
  'var(--chart-ether-5)',
  'var(--chart-ether-6)',
  'var(--chart-ether-7)',
  'var(--chart-ether-8)',
  'var(--chart-ether-9)',
]

// biome-ignore lint/suspicious/noExplicitAny: POC
const CustomizedContent = (props: any) => {
  const { x, y, width, height, name, change, maxChange, minChange } = props

  const fontSize = Math.min(width / 8, height / 4)
  const opacity = Math.round(
    (1 - (change > 0 ? change / maxChange : change / minChange)) * 50,
  )
  console.log(minChange, maxChange)
  const fill =
    change === 0
      ? 'var(--secondary)'
      : change > 0
        ? `color-mix(in oklch, var(--positive), white ${opacity}%)`
        : `color-mix(in oklch, var(--negative), white ${opacity}%)`
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
          fill,
          stroke: '#fff',
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
    actualPayload &&
      actualPayload.payload.name &&
      actualPayload.value &&
      actualPayload.payload.change,
    'No payload',
  )
  return (
    <ChartTooltipWrapper>
      <div className="flex flex-col">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {actualPayload.payload.name}
        </div>
        <ValueWithPercentageChange change={actualPayload.payload.change}>
          {formatCurrency(actualPayload.value, 'usd')}
        </ValueWithPercentageChange>
      </div>
    </ChartTooltipWrapper>
  )
}
