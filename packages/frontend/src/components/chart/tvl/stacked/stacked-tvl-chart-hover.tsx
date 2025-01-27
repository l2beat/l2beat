import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { type ChartUnit } from '../../types'

interface Props {
  timestamp: number
  canonical: number
  external: number
  native: number
  ethPrice: number
  unit: ChartUnit
}

export function StackedTvlChartHover(props: Props) {
  const divideBy = props.unit === 'usd' ? 100 : props.ethPrice
  const total = formatCurrency(
    (props.canonical + props.external + props.native) / divideBy,
    props.unit,
  )
  const values = [
    {
      title: 'Canonical',
      value: props.canonical,
      className: 'bg-purple-100 dark:bg-purple-100',
    },
    {
      title: 'External',
      value: props.external,
      className: 'bg-yellow-200 dark:bg-yellow-200',
    },
    {
      title: 'Native',
      value: props.native,
      className: 'bg-pink-100 dark:bg-pink-100',
    },
  ]
  return (
    <div className="flex w-36 flex-col gap-1 xs:w-52!">
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
          Total value secured
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
                    className={cn('size-3 rounded-sm', v.className)}
                  ></div>
                  <span>{v.title}</span>
                </span>
                <span className="font-medium">
                  {formatCurrency(v.value / divideBy, props.unit)}
                </span>
              </div>
            ),
        )}
      </div>
    </div>
  )
}
