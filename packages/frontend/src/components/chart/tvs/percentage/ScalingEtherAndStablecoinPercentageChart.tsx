import compact from 'lodash/compact'
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

export function ScalingEtherAndStablecoinPercentageChart({
  filter,
  range,
}: Props) {
  const [excluded, setExcluded] = useState<string[]>([])

  const { data } = api.tvs.etherAndStablecoinsCharts.useQuery({
    range,
    filter,
  })
  const allItemNames = useMemo(() => {
    return Object.entries({
      ...data?.ether,
      ...data?.stablecoins,
    })
      .sort((a, b) => {
        return b[1].value - a[1].value
      })
      .map((e) => e[0])
  }, [data])

  const chartData:
    | {
        name: string
        children: { name: string; value: number; change: number }[]
      }[]
    | undefined = useMemo(() => {
    const etherChildren = Object.entries(data?.ether ?? {})
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
    const stablecoinsChildren = Object.entries(data?.stablecoins ?? {})
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
    return compact([
      etherChildren.length > 0
        ? {
            name: 'ETH & derivatives',
            color: 'var(--chart-ethereum)',
            value:
              Object.values(data?.ether ?? {}).reduce(
                (acc, curr) => acc + curr.value,
                0,
              ) ?? 0,
            children: etherChildren,
          }
        : undefined,
      stablecoinsChildren.length > 0
        ? {
            name: 'Stablecoins',
            color: 'var(--chart-stablecoin-1)',
            value:
              Object.values(data?.stablecoins ?? {}).reduce(
                (acc, curr) => acc + curr.value,
                0,
              ) ?? 0,
            children: stablecoinsChildren,
          }
        : undefined,
    ])
  }, [data, excluded])

  const maxChange = useMemo(() => {
    return Math.max(
      ...chartData.flatMap((data) => data.children.map((child) => child.value)),
    )
  }, [chartData])

  const minChange = useMemo(() => {
    return Math.min(
      ...chartData.flatMap((data) => data.children.map((child) => child.value)),
    )
  }, [chartData])

  return (
    <div className="h-[162px] min-h-[162px] pb-[26px] md:h-[202px] md:min-h-[202px] 2xl:h-[232px] 2xl:min-h-[232px]">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={chartData}
          dataKey="value"
          content={
            <CustomizedContent
              maxChange={maxChange}
              minChange={minChange}
              onGroupClick={(name) =>
                setExcluded(
                  name === 'Stablecoins'
                    ? Object.keys(data?.ether ?? {})
                    : Object.keys(data?.stablecoins ?? {}),
                )
              }
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

// biome-ignore lint/suspicious/noExplicitAny: POC
const CustomizedContent = (props: any) => {
  const {
    x,
    y,
    children,
    width,
    height,
    name,
    change,
    maxChange,
    minChange,
    depth,
    onGroupClick,
    index,
    root,
  } = props

  const fontSize = Math.min(width / 8, height / 4)
  if (name === 'USDS') {
    console.log(props)
  }
  const opacity = Math.round(
    (1 - (change > 0 ? change / maxChange : change / minChange)) * 50,
  )
  const fill =
    change === 0
      ? 'var(--secondary)'
      : change > 0
        ? `color-mix(in oklch, var(--positive), white ${opacity}%)`
        : `color-mix(in oklch, var(--negative), white ${opacity}%)`

  return (
    <>
      <g>
        {depth > 1 ? (
          <>
            <rect
              x={x + 2}
              y={y + 2}
              width={width - 2}
              height={height - 2}
              rx={4}
              ry={4}
              style={{
                fill,
                stroke: '#ffffff00',
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
          </>
        ) : null}
      </g>
      {depth > 1 &&
      root.children !== null &&
      index === root.children.length - 1 ? (
        <g
          id={`${root.name}-group`}
          rx={4}
          ry={4}
          className="cursor-pointer opacity-80 transition-opacity hover:opacity-100"
          onClick={() => onGroupClick(root.name)}
        >
          {/* <!-- label bar --> */}
          <rect
            x={root.x}
            y={root.y}
            width={root.width}
            fill={root.color}
            height="22"
          />

          {/* <!-- outer frame --> */}
          <rect
            x={root.x + 1}
            y={root.y + 23}
            width={root.width - 2}
            height={root.height - 24}
            fill="none"
            stroke={root.color}
            strokeWidth="2"
          />

          {/* <!-- label text --> */}
          <text
            x={root.x + root.width / 2}
            y={root.y + 16}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
          >
            {root.name}
          </text>
        </g>
      ) : null}
    </>
  )
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload) return null

  const actualPayload = payload[0]
  if (
    !actualPayload ||
    !actualPayload.payload.name ||
    !actualPayload.value ||
    !actualPayload.payload.change
  ) {
    return null
  }

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
