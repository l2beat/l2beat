import { formatNumberWithCommas } from '~/utils/number-format/format-number'

interface TableSumProps {
  amount: number
}

export function TableSum(props: TableSumProps) {
  return (
    <div className="flex w-full self-end border-t border-t-black/10 py-2 pl-2 pr-0 text-base font-medium dark:border-t-white/25 md:pl-6 md:pr-4">
      <div>
        <span className="text-gray-500 dark:text-gray-50">Total:&nbsp;</span>
        <span className="text-pink-800 dark:text-pink-200">
          ${formatNumberWithCommas(props.amount)}
        </span>
      </div>
    </div>
  )
}
