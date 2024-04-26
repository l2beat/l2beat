import React from 'react'

import { RoundedWarningIcon } from '../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { WarningBar } from '../WarningBar'
import { Breakdown } from './Breakdown'

export interface TokenBreakdownProps {
  warning?: string
  warningSeverity: 'warning' | 'bad'
  label: React.ReactNode
  empty: boolean
  associated: number
  ether: number
  stable: number
  other: number
}

export function TokenBreakdown(props: TokenBreakdownProps) {
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
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-1">
        <Breakdown values={values} className="opacity-80" />
        {props.warning && (
          <RoundedWarningIcon sentiment={props.warningSeverity} />
        )}
      </TooltipTrigger>
      <TooltipContent>
        {props.label}
        {props.warning && (
          <WarningBar
            className="mt-2"
            text={props.warning}
            icon={RoundedWarningIcon}
            color={props.warningSeverity === 'warning' ? 'yellow' : 'red'}
          />
        )}
      </TooltipContent>
    </Tooltip>
  )
}
