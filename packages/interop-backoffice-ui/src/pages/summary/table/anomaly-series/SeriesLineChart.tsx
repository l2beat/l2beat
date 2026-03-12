import { cn } from '~/utils/cn'

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

function buildLinePath(
  values: number[],
  width: number,
  height: number,
  minValue: number,
  maxValue: number,
) {
  if (values.length === 0) {
    return ''
  }

  const range = Math.max(maxValue - minValue, 1)
  const xDenominator = Math.max(values.length - 1, 1)

  return values
    .map((value, index) => {
      const x = (index / xDenominator) * (width - 1)
      const normalized = (value - minValue) / range
      const y = (1 - normalized) * (height - 1)
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

export function SeriesLineChart({
  title,
  labels,
  series,
}: SeriesLineChartProps) {
  const width = 1000
  const height = 220
  const allValues = series.flatMap((dataset) => dataset.values)
  const minValue = Math.min(...allValues, 0)
  const maxValue = Math.max(...allValues, 0)

  return (
    <div className="rounded-md border p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-medium text-sm">{title}</h3>
        <div className="flex flex-wrap items-center gap-3">
          {series.map((dataset) => (
            <div
              key={dataset.label}
              className="flex items-center gap-1 text-xs"
            >
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: dataset.color }}
              />
              {dataset.label}
            </div>
          ))}
        </div>
      </div>

      <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="block rounded bg-slate-50"
        role="img"
        aria-label={title}
      >
        <line
          x1={0}
          x2={width}
          y1={height - 1}
          y2={height - 1}
          stroke="#cbd5e1"
          strokeWidth={1}
        />

        {series.map((dataset) => (
          <path
            key={dataset.label}
            d={buildLinePath(dataset.values, width, height, minValue, maxValue)}
            fill="none"
            stroke={dataset.color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>

      <div
        className={cn(
          'mt-2 flex items-center justify-between',
          labels.length === 0 && 'hidden',
        )}
      >
        <span className="text-muted-foreground text-xs">{labels[0]}</span>
        <span className="text-muted-foreground text-xs">
          {labels[labels.length - 1]}
        </span>
      </div>
    </div>
  )
}
