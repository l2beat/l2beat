interface Props {
  id: string
  fill: string
}

export function EstimatedBarPatternDef({ id, fill }: Props) {
  return (
    <pattern
      id={id}
      patternUnits="userSpaceOnUse"
      width="20"
      height="20"
      patternTransform="rotate(45)"
    >
      <rect width="10" height="20" fill={fill} fillOpacity={1} />
      <rect
        x="10"
        width="10"
        height="20"
        fill={fill}
        fillOpacity={0.25}
        className="dark:hidden"
      />
      <rect
        x="10"
        width="10"
        height="20"
        fill={fill}
        fillOpacity={0.5}
        className="not-dark:hidden"
      />
    </pattern>
  )
}
