import { formatTimestamp } from '~/utils/dates'
import { formatCurrencyExactValue } from '~/utils/number-format/format-currency'

export interface TvlChartPointData {
  timestamp: number
  usdValue: number
  ethValue: number
}

export function TvlChartHover({ data }: { data: TvlChartPointData }) {
  const formattedUsd = formatCurrencyExactValue(data.usdValue, 'USD')
  const formattedEth = formatCurrencyExactValue(data.ethValue, 'ETH')
  return (
    <div>
      <div className="mb-1 whitespace-nowrap">
        {formatTimestamp(data.timestamp, {
          mode: 'datetime',
        })}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-50">USD</span>
        {formattedUsd}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-50">ETH</span>
        {formattedEth}
      </div>
    </div>
  )
}
