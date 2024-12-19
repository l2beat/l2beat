import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/format-currency'

interface Props {
  timestamp: number
  rollups: number
  validiumsAndOptimiums: number
  others: number
}

export function RecategorizedTvlChartHover(props: Props) {
  const total = formatCurrency(
    (props.rollups + props.validiumsAndOptimiums + props.others) / 100,
    'usd',
  )
  const values = [
    {
      title: 'Rollups',
      value: props.rollups,
      className: 'bg-indicator-rollups',
    },
    {
      title: 'Validiums and Optimiums',
      value: props.validiumsAndOptimiums,
      className: 'bg-indicator-validiums-optimiums',
    },
    {
      title: 'Others',
      value: props.others,
      className: 'bg-indicator-others',
    },
  ]
  return (
    <div className="flex w-[158px] flex-col gap-1 [@media(min-width:600px)]:!w-60">
      <div>
        {formatTimestamp(props.timestamp, {
          mode: 'datetime',
        })}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-50 [@media(min-width:600px)]:hidden">
          Total
        </span>
        <span className="hidden text-sm text-gray-700 dark:text-gray-50 [@media(min-width:600px)]:inline">
          Total value locked
        </span>
        {total}
      </div>
      <hr className="w-full border-gray-200 dark:border-gray-650 md:border-t" />
      <div>
        {values.map(
          (v, i) =>
            v.value > 0 && (
              <div key={i} className="flex items-start justify-between gap-x-1">
                <span className="flex items-start gap-1">
                  <div
                    role="img"
                    aria-label="Square icon"
                    className={cn('mt-0.5 size-3 rounded sm:mt-1', v.className)}
                  ></div>
                  <span className="w-20 sm:w-fit">{v.title}</span>
                </span>
                <span className="whitespace-nowrap font-medium">
                  {formatCurrency(v.value / 100, 'usd')}
                </span>
              </div>
            ),
        )}
      </div>
    </div>
  )
}
