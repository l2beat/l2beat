export function MetricLine(props: { children: React.ReactNode }) {
  return (
    <span className="whitespace-nowrap text-muted-foreground text-xs">
      {props.children}
    </span>
  )
}
