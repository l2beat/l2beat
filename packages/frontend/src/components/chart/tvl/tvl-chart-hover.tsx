import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/format-currency'

export interface TvlChartPointData {
  timestamp: number
  usdValue: number
  ethValue: number
}

export function TvlChartHover({ data }: { data: TvlChartPointData }) {
  const formattedUsd = formatCurrency(data.usdValue, 'usd')
  const formattedEth = formatCurrency(data.ethValue, 'eth')
  return (
    <div className="xs:w-44! flex w-28 flex-col gap-1 [@media(min-width:375px)]:w-36">
      <div className="mb-1">
        {formatTimestamp(data.timestamp, {
          mode: 'datetime',
        })}
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-50">Total</span>
      <hr className="dark:border-gray-650 w-full border-gray-200 md:border-t" />
      <div>
        <div className="flex w-full items-center justify-between gap-2">
          <span>USD</span>
          <span className="font-medium">{formattedUsd}</span>
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <span>ETH</span>
          <span className="font-medium">{formattedEth}</span>
        </div>
      </div>
    </div>
  )
}
