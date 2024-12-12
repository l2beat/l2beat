import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/format-currency'

interface Props {
  timestamp: number
  rollups: number
  validiumsAndOptimiums: number
  others: number
}

export function StackedRecategorizedTvlChartHover(props: Props) {
  const total = formatCurrency(
    (props.rollups + props.validiumsAndOptimiums + props.others) / 100,
    'usd',
  )
  const values = [
    {
      title: 'Rollups',
      value: props.rollups,
      className: 'bg-purple-100 dark:bg-purple-100',
    },
    {
      title: 'Validiums and Optimiums',
      value: props.validiumsAndOptimiums,
      className: 'bg-yellow-200 dark:bg-yellow-200',
    },
    {
      title: 'Others',
      value: props.others,
      className: 'bg-pink-100 dark:bg-pink-100',
    },
  ]
  return (
    <div className="flex w-36 flex-col gap-1 xs:!w-52">
      <div>
        {formatTimestamp(props.timestamp, {
          mode: 'datetime',
        })}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-50 xs:hidden">
          Total
        </span>
        <span className="hidden text-sm text-gray-700 dark:text-gray-50 xs:inline">
          Total value locked
        </span>
        {total}
      </div>
      <hr className="w-full border-gray-200 dark:border-gray-650 md:border-t" />
      <div>
        {values.map(
          (v, i) =>
            v.value > 0 && (
              <div
                key={i}
                className="flex items-center justify-between gap-x-6"
              >
                <span className="flex items-center gap-1">
                  <div
                    role="img"
                    aria-label="Square icon"
                    className={cn('size-3 rounded', v.className)}
                  ></div>
                  <span>{v.title}</span>
                </span>
                <span className="font-medium">
                  {formatCurrency(v.value / 100, 'usd')}
                </span>
              </div>
            ),
        )}
      </div>
    </div>
  )
}
