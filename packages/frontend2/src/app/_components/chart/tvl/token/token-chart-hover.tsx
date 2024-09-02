import { Square } from '~/app/_components/square'
import { type ProjectToken } from '~/server/features/scaling/tvl/tokens/get-top-tokens-for-project'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrencyExactValue } from '~/utils/format'
import { type ChartUnit } from '../../types'

interface Props {
  timestamp: number
  amount: number
  usdValue: number
  token: ProjectToken
  unit: ChartUnit
}

export function TokenChartHover({
  timestamp,
  amount,
  usdValue,
  token,
  unit,
}: Props) {
  const tokenHtml = (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex items-center gap-1">
        <Square variant={token.source} size="small" />
        <span className="text-sm text-gray-700 dark:text-gray-50">
          {token.symbol}
        </span>
      </div>
      {formatCurrencyExactValue(amount, token.symbol)}
    </div>
  )
  const usdHtml = (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="ml-4 text-sm text-gray-700 dark:text-gray-50">USD</div>
      {formatCurrencyExactValue(usdValue, 'USD')}
    </div>
  )

  return (
    <div className="flex flex-col gap-1">
      <div className="whitespace-nowrap">
        {formatTimestamp(timestamp, {
          mode: 'datetime',
        })}
      </div>
      <hr className="w-full border-gray-200 dark:border-gray-650 md:border-t" />
      {unit === 'usd' ? (
        <>
          {usdHtml}
          {tokenHtml}
        </>
      ) : (
        <>
          {tokenHtml}
          {usdHtml}
        </>
      )}
    </div>
  )
}
