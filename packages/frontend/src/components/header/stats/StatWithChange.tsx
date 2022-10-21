import React from 'react'

import { PercentChange } from '../../PercentChange'

interface StatWithChangeProps {
  stat: string
  change: string
  className?: string
}

export function StatWithChange(props: StatWithChangeProps) {
  return (
    <span className="flex items-center gap-2">
      <span className={props.className}>{props.stat}</span>
      <PercentChange className="text-base font-semibold" value={props.change} />
    </span>
  )
}
