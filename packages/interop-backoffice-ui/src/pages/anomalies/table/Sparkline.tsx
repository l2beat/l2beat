const SPARKLINE_WIDTH = 140
const SPARKLINE_HEIGHT = 26

export function Sparkline(props: {
  values: number[]
  color: string
  width?: number
  height?: number
  domain?: { min: number; max: number }
}) {
  const width = props.width ?? SPARKLINE_WIDTH
  const height = props.height ?? SPARKLINE_HEIGHT
  const points = toSparklinePoints(props.values, width, height, props.domain)

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className="block"
    >
      <polyline
        points={points}
        fill="none"
        stroke={props.color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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
