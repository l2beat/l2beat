export function NoDataPatternDef() {
  return (
    <pattern
      id="noDataFill"
      patternUnits="userSpaceOnUse"
      width="20"
      height="20"
      patternTransform="rotate(45)"
    >
      <rect
        width="10"
        height="20"
        fill="var(--secondary)"
        fillOpacity={0.25}
        className="dark:hidden"
      />
      <rect
        width="10"
        height="20"
        fill="var(--secondary)"
        fillOpacity={0.5}
        className="not-dark:hidden"
      />
    </pattern>
  )
}
