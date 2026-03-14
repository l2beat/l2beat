function toSparklinePoints(
  values: number[],
  width: number,
  height: number,
  domain?: { min: number; max: number },
) {
  if (values.length === 0) {
    return ''
  }

  const chartMin = domain?.min ?? Math.min(...values, 0)
  const chartMax = domain?.max ?? Math.max(...values, 0)
  const minMaxEqual = chartMax === chartMin
  const constantNormalized = chartMax === 0 ? 0 : 1
  const range = Math.max(chartMax - chartMin, 1)
  const xDenominator = Math.max(values.length - 1, 1)

  return values
    .map((value, index) => {
      const normalized = minMaxEqual
        ? constantNormalized
        : (value - chartMin) / range
      const x = (index / xDenominator) * (width - 1)
      const y = (1 - normalized) * (height - 1)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

interface SparklineProps {
  values: number[]
  color: string
  width?: number
  height?: number
  domain?: {
    min: number
    max: number
  }
}

export function Sparkline({
  values,
  color,
  width = 140,
  height = 26,
  domain,
}: SparklineProps) {
  const points = toSparklinePoints(values, width, height, domain)

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-hidden="true"
      className="block"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
