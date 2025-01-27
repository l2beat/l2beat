import { Square } from '~/components/square'
import { type ProjectToken } from '~/server/features/scaling/tvl/tokens/get-tokens-for-project'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrencyExactValue } from '~/utils/number-format/format-currency'
import { type ChartUnit } from '../../types'

interface Props {
  timestamp: number
  amount: number
  usdValue: number
  token: ProjectToken
  unit: ChartUnit
  isBridge: boolean
}

export function TokenChartHover({
  timestamp,
  amount,
  usdValue,
  token,
  unit,
  isBridge,
}: Props) {
  const tokenHtml = (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex items-center gap-1">
        {!isBridge ? <Square variant={token.source} size="small" /> : null}
        <span className="text-sm text-gray-700 dark:text-gray-50">
          {token.symbol}
        </span>
      </div>
      {formatCurrencyExactValue(amount, token.symbol)}
    </div>
  )
  const usdHtml = (
    <div className="flex w-full items-center justify-between gap-2">
      <div
        className={cn(
          'text-sm text-gray-700 dark:text-gray-50',
          !isBridge && 'ml-4',
        )}
      >
        USD
      </div>
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
      <hr className="dark:border-gray-650 w-full border-gray-200 md:border-t" />
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
