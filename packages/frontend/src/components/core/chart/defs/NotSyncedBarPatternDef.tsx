interface Props {
  id: string
  fill: string
}

export function NotSyncedBarPatternDef({ id, fill }: Props) {
  return (
    <pattern
      id={id}
      patternUnits="userSpaceOnUse"
      width="20"
      height="20"
      patternTransform="rotate(45)"
    >
      <rect width="10" height="20" fill={fill} fillOpacity={1} />
    </pattern>
  )
}
