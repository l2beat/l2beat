import { formatPercent } from '../../utils'

export function ColoredPercent(props: { value: number | null }) {
  return (
    <span
      style={{
        color: getPercentColor(props.value),
        fontWeight: 600,
      }}
    >
      {formatPercent(props.value)}
    </span>
  )
}

function getPercentColor(value: number | null) {
  if (value === null) return 'var(--color-muted-foreground)'

  const capped = Math.min(Math.abs(value), 100)
  const intensity = capped / 100
  const lightness = 55 - Math.round(intensity * 20)
  const hue = value >= 0 ? 140 : 0

  return `hsl(${hue}, 80%, ${lightness}%)`
}
