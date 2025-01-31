import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/format-currency'

export interface TvsChartPointData {
  timestamp: number
  usdValue: number
  ethValue: number
}

export function TvsChartHover({ data }: { data: TvsChartPointData }) {
  const formattedUsd = formatCurrency(data.usdValue, 'usd')
  const formattedEth = formatCurrency(data.ethValue, 'eth')
  return (
    <div className="flex w-28 flex-col gap-1 xs:!w-44 [@media(min-width:375px)]:w-36">
      <div className="mb-1">
        {formatTimestamp(data.timestamp, {
          mode: 'datetime',
        })}
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-50">Total</span>
      <hr className="w-full border-gray-200 dark:border-gray-650 md:border-t" />
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
