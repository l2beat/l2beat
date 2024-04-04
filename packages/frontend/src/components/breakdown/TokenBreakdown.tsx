import React from 'react'

import { RoundedWarningIcon } from '../icons'
import { WarningBar } from '../project/WarningBar'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
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
      className: 'dark:fill-rose-700 fill-rose-500',
    },
    {
      value: props.ether,
      className: 'dark:fill-green-200 fill-green-900',
    },
    { value: props.stable, className: 'dark:fill-teal-400 fill-teal-500' },
    { value: props.other, className: 'fill-sky-600' },
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
