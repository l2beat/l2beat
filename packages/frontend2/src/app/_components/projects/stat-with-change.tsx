import React from 'react'
import { PercentChange } from '../percent-change'

interface StatWithChangeProps {
  stat: number
  change: string
  className?: string
}

export function StatWithChange(props: StatWithChangeProps) {
  return (
    <span className="flex items-center gap-2">
      <span className={props.className}>{props.stat.toFixed(2)}</span>
      <PercentChange className="text-base font-semibold" value={props.change} />
    </span>
  )
}
