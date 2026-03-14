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

interface SeriesDefinition {
  label: string
  values: number[]
  color: string
}

interface SeriesLineChartProps {
  title: string
  labels: string[]
  series: SeriesDefinition[]
}

interface ChartRow {
  label: string
  [key: `series_${number}`]: number | null
}

export function SeriesLineChart({
  title,
  labels,
  series,
}: SeriesLineChartProps) {
  const chartData: ChartRow[] = labels.map((label, index) => {
    const row: ChartRow = {
      label,
    }

    for (const [seriesIndex, dataset] of series.entries()) {
      row[`series_${seriesIndex}`] = dataset.values[index] ?? null
    }

    return row
  })

  return (
    <div className="rounded-md border p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-medium text-sm">{title}</h3>
      </div>

      <div className="h-[260px] w-full rounded bg-slate-50 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 12, bottom: 8, left: 0 }}
          >
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis tick={{ fontSize: 11 }} width={56} />
            <Tooltip
              formatter={(value, name) => [value ?? '-', name]}
              labelFormatter={(value) => `Day: ${value}`}
            />
            <Legend />

            {series.map((dataset, index) => (
              <Line
                key={dataset.label}
                type="monotone"
                dataKey={`series_${index}`}
                name={dataset.label}
                stroke={dataset.color}
                strokeWidth={2}
                dot={false}
                connectNulls
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
