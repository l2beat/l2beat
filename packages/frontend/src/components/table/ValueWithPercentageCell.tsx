import React from 'react'

import { isZeroUSD } from '../../utils/utils'
import { NumberCell } from './NumberCell'

export interface ValueWithPercentageCellProps {
  value?: string
  percentChange?: string
}

// NOTE(radomski): This is not an ASCII minus character, but a UTF-8 "Em Dash"
// Look here for more: https://www.compart.com/en/unicode/U+2014
const LONG_HYPHEN = '—'

export function ValueWithPercentageCell(props: ValueWithPercentageCellProps) {
  return (
    <>
      {props.value && !isZeroUSD(props.value) ? (
        <>
          <NumberCell className="font-bold">{props.value}</NumberCell>
          <NumberCell signed className="ml-1 w-[72px] !text-base font-medium ">
            {props.percentChange}
          </NumberCell>
        </>
      ) : (
        <div className="flex w-full justify-center">
          <span className="text-base font-bold md:text-lg">{LONG_HYPHEN}</span>
        </div>
      )}
    </>
  )
}
