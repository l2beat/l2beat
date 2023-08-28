import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { isZeroUSD } from '../../utils/utils'
import { TokenControl } from '../chart/CommonTokenControls'
import { NumberCell } from './NumberCell'

export interface ValueWithPercentageCellProps {
  value?: string
  percentChange?: string
  tokens?: TokenControl[]
}

// NOTE(radomski): This is not an ASCII minus character, but a UTF-8 "Em Dash"
// Look here for more: https://www.compart.com/en/unicode/U+2014
const LONG_HYPHEN = '—'

export function ValueWithPercentageCell(props: ValueWithPercentageCellProps) {
  return (
    <>
      {props.value && !isZeroUSD(props.value) ? (
        <>
          {props.tokens ? (
            <div
              className="Tooltip"
              title={renderToStaticMarkup(
                <TokenGridTooltip tokens={props.tokens} />,
              )}
              data-tooltip-big
            >
              <NumberCell className="font-bold">{props.value}</NumberCell>
              <NumberCell signed className="w-18 ml-1 !text-base font-medium ">
                {props.percentChange}
              </NumberCell>
            </div>
          ) : (
            <div>
              <NumberCell className="font-bold">{props.value}</NumberCell>
              <NumberCell signed className="w-18 ml-1 !text-base font-medium ">
                {props.percentChange}
              </NumberCell>
            </div>
          )}
        </>
      ) : (
        <div className="flex w-full justify-center">
          <span className="text-base font-bold md:text-lg">{LONG_HYPHEN}</span>
        </div>
      )}
    </>
  )
}

interface TokenGridTooltipProps {
  tokens: TokenControl[]
}

function TokenGridTooltip({ tokens }: TokenGridTooltipProps) {
  if (tokens.length === 0) {
    return <span>No tokens</span>
  }

  const top15 = tokens.slice(0, 15)
  // NOTE(radomski): Explanation of the
  // `grid-cols-[repeat(3,minmax(0,_1fr))_auto]`. I want a four columned grid
  // where the first three cells are of equal size and the fourth is free to
  // grow.
  const styling =
    tokens.length <= 4
      ? 'flex flex-wrap gap-x-4'
      : 'grid grid-cols-[repeat(3,minmax(0,_1fr))_auto] gap-x-4 gap-y-3'

  return (
    <div className={styling}>
      {top15.map((t, i) => (
        <div className="flex items-center gap-1.5" key={i}>
          <img src={t.iconUrl} className="h-4 w-4 rounded-full" />
          <span className="text-xs font-bold">{t.symbol}</span>
        </div>
      ))}
      {tokens.length > 15 && (
        <span className="text-xs text-gray-550">
          and {tokens.length - top15.length} more
        </span>
      )}
    </div>
  )
}
