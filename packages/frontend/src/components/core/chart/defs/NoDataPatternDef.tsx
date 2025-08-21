export function NoDataPatternDef({
  id = 'noDataFill',
  fill,
  fillOpacity,
}: {
  id?: string
  fill?: string
  fillOpacity?: number
}) {
  return (
    <pattern
      id={id}
      patternUnits="userSpaceOnUse"
      width="20"
      height="20"
      patternTransform="rotate(45)"
    >
      <rect
        width="10"
        height="20"
        fill={fill ?? 'var(--secondary)'}
        fillOpacity={fillOpacity ?? 0.25}
        className="dark:hidden"
      />
      <rect
        width="10"
        height="20"
        fill={fill ?? 'var(--secondary)'}
        fillOpacity={fillOpacity ?? 0.5}
        className="not-dark:hidden"
      />
    </pattern>
  )
}
