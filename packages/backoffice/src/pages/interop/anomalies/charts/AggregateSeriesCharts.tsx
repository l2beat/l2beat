import { formatLargeNumber, formatSeconds } from '@l2beat/shared-pure'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '~/components/core/Empty'
import { formatDollars } from '~/pages/interop/transfers/utils'
import type { AggregateSeriesPoint } from '../types'

interface AggregateSeriesChartsProps {
  data: AggregateSeriesPoint[]
  emptyMessage: string
  emptyVolumeMessage?: string
}

export function AggregateSeriesCharts({
  data,
  emptyMessage,
  emptyVolumeMessage,
}: AggregateSeriesChartsProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>No chart data</EmptyTitle>
              <EmptyDescription>{emptyMessage}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const hasVolumeData = data.some(
    (point) =>
      point.totalSrcValueUsd !== null || point.totalDstValueUsd !== null,
  )

  return (
    <div className="grid gap-4">
      <ChartCard
        title="Transfers count"
        description="Daily transfer count across the selected aggregate."
      >
        <ChartBase data={data} yAxisTickFormatter={formatCountVolume}>
          <Line
            type="monotone"
            dataKey="transferCount"
            name="Transfers count"
            stroke="var(--color-chart-3)"
            strokeWidth={2}
            dot={false}
          />
        </ChartBase>
      </ChartCard>

      <ChartCard
        title="Average duration"
        description="Daily average duration across transfers with known duration."
      >
        <ChartBase
          data={data}
          valueFormatter={formatDuration}
          yAxisTickFormatter={formatDuration}
        >
          <Line
            type="monotone"
            dataKey="avgDuration"
            name="Average duration"
            stroke="var(--color-chart-2)"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        </ChartBase>
      </ChartCard>

      {hasVolumeData ? (
        <ChartCard
          title="Source vs destination volume"
          description="Daily USD totals on the source and destination sides."
        >
          <ChartBase
            data={data}
            valueFormatter={formatVolumeValue}
            yAxisTickFormatter={formatVolumeValue}
          >
            <Line
              type="monotone"
              dataKey="totalSrcValueUsd"
              name="Source value"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="totalDstValueUsd"
              name="Destination value"
              stroke="var(--color-chart-5)"
              strokeWidth={2}
              dot={false}
            />
          </ChartBase>
        </ChartCard>
      ) : (
        <Card>
          <CardContent className="p-6">
            <Empty className="border">
              <EmptyHeader>
                <EmptyTitle>No volume history</EmptyTitle>
                <EmptyDescription>
                  {emptyVolumeMessage ??
                    'Historical USD volume is unavailable for this series.'}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ChartCard(props: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className="gap-0 pt-6">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-4 h-[320px] px-2 sm:px-4">
        {props.children}
      </CardContent>
    </Card>
  )
}

function ChartBase(props: {
  data: AggregateSeriesPoint[]
  children: React.ReactNode
  valueFormatter?: (value: unknown) => string
  yAxisTickFormatter?: (value: unknown) => string
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={props.data}
        margin={{ top: 12, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" minTickGap={24} tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          width={72}
          tickFormatter={props.yAxisTickFormatter}
        />
        <Tooltip
          formatter={(value) =>
            props.valueFormatter
              ? props.valueFormatter(value)
              : defaultTooltipValue(value)
          }
        />
        <Legend />
        {props.children}
      </LineChart>
    </ResponsiveContainer>
  )
}

function defaultTooltipValue(value: unknown) {
  if (typeof value === 'number') {
    return value.toLocaleString()
  }

  if (typeof value === 'string') {
    return value
  }

  return '-'
}

function formatCountVolume(value: unknown) {
  if (typeof value !== 'number') {
    return '-'
  }

  return formatLargeNumber(value)
}

function formatVolumeValue(value: unknown) {
  if (typeof value !== 'number') {
    return '-'
  }

  return formatDollars(value)
}

function formatDuration(value: unknown) {
  if (typeof value !== 'number') {
    return '-'
  }

  return formatSeconds(value)
}
