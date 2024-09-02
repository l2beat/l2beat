import { Square } from '~/app/_components/square'
import { type ProjectToken } from '~/server/features/scaling/tvl/tokens/get-top-tokens-for-project'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrencyExactValue } from '~/utils/format'

interface Props {
  timestamp: number
  amount: number
  usdValue: number
  token: ProjectToken
}

export function TokenChartHover({ timestamp, amount, usdValue, token }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <div className="whitespace-nowrap">
        {formatTimestamp(timestamp, {
          mode: 'datetime',
        })}
      </div>
      <hr className="w-full border-gray-200 dark:border-gray-650 md:border-t" />
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Square variant={token.source} size="small" />
          <span className="text-sm text-gray-700 dark:text-gray-50">
            {token.symbol}
          </span>
        </div>
        {formatCurrencyExactValue(amount, token.symbol)}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Square className="bg-transparent dark:bg-transparent" size="small" />
          <span className="text-sm text-gray-700 dark:text-gray-50">USD</span>
        </div>
        {formatCurrencyExactValue(usdValue, 'USD')}
      </div>
    </div>
  )
}
