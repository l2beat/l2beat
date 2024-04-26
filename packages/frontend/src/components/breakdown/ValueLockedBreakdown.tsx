import React from 'react'

import { cn } from '../../utils/cn'
import { Breakdown } from './Breakdown'

export interface ValueLockedBreakdownProps {
  canonical: number
  external: number
  native: number
  className?: string
}

export function ValueLockedBreakdown(props: ValueLockedBreakdownProps) {
  const values = [
    {
      value: props.canonical,
      className: 'bg-purple-100',
    },
    {
      value: props.external,
      className: 'bg-yellow-200',
    },
    { value: props.native, className: 'bg-pink-100' },
  ]

  return (
    <Breakdown values={values} className={cn('opacity-80', props.className)} />
  )
}
