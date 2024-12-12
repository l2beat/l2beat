import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/format-currency'

export interface TvlChartPointData {
  timestamp: number
  rollups: {
    usd: number
    eth: number
  }
  validiumAndOptimiums: {
    usd: number
    eth: number
  }
  others: {
    usd: number
    eth: number
  }
}

export function TvlChartHover2({ data }: { data: TvlChartPointData }) {
  return (
    <div className="flex w-28 flex-col gap-1 xs:!w-44 [@media(min-width:375px)]:w-36">
      <div className="mb-1">
        {formatTimestamp(data.timestamp, {
          mode: 'datetime',
        })}
      </div>
      <hr className="w-full border-gray-200 dark:border-gray-650 md:border-t" />
      <span className="text-sm text-gray-700 dark:text-gray-50">Rollups</span>
      <div>
        <div className="flex w-full items-center justify-between gap-2">
          <span>USD</span>
          <span className="font-medium">
            {formatCurrency(data.rollups.usd, 'usd')}
          </span>
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <span>ETH</span>
          <span className="font-medium">
            {formatCurrency(data.rollups.eth, 'eth')}
          </span>
        </div>
      </div>
      <hr className="w-full border-gray-200 dark:border-gray-650 md:border-t" />
      <span className="text-sm text-gray-700 dark:text-gray-50">
        Validium and Optimiums
      </span>
      <div>
        <div className="flex w-full items-center justify-between gap-2">
          <span>USD</span>
          <span className="font-medium">
            {formatCurrency(data.validiumAndOptimiums.usd, 'usd')}
          </span>
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <span>ETH</span>
          <span className="font-medium">
            {formatCurrency(data.validiumAndOptimiums.eth, 'eth')}
          </span>
        </div>
      </div>
      <hr className="w-full border-gray-200 dark:border-gray-650 md:border-t" />
      <span className="text-sm text-gray-700 dark:text-gray-50">Others</span>
      <div>
        <div className="flex w-full items-center justify-between gap-2">
          <span>USD</span>
          <span className="font-medium">
            {formatCurrency(data.others.usd, 'usd')}
          </span>
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <span>ETH</span>
          <span className="font-medium">
            {formatCurrency(data.others.eth, 'eth')}
          </span>
        </div>
      </div>
    </div>
  )
}
