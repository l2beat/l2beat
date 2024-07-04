import React from 'react'
import { cn } from '~/utils/cn'
import { Breakdown } from './breakdown'

export interface TokenBreakdownProps extends Props {
  warning?: string
  warningSeverity: 'warning' | 'bad'
}

interface Props {
  label: React.ReactNode
  associated: number
  ether: number
  stable: number
  other: number
  className?: string
}

export function TokenBreakdown(props: Props) {
  const values = [
    {
      value: props.associated,
      className: 'dark:bg-rose-700 bg-rose-500',
    },
    {
      value: props.ether,
      className: 'dark:bg-green-200 bg-green-900',
    },
    { value: props.stable, className: 'dark:bg-teal-400 bg-teal-500' },
    { value: props.other, className: 'bg-sky-600' },
  ]

  return (
    <Breakdown values={values} className={cn('opacity-80', props.className)} />
  )
}
