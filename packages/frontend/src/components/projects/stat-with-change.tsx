import { PercentChange } from '../percent-change'

interface StatWithChangeProps {
  stat: number
  change: number
  className?: string
}

export function StatWithChange(props: StatWithChangeProps) {
  return (
    <span className="flex items-center gap-2">
      <span className={props.className}>{props.stat.toFixed(2)}</span>
      <PercentChange className="text-base font-medium" value={props.change} />
    </span>
  )
}
