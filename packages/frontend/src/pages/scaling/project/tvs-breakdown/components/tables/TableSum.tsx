import { formatNumberWithCommas } from '~/utils/number-format/formatNumber'

interface TableSumProps {
  amount: number
}

export function TableSum(props: TableSumProps) {
  return (
    <div className="flex w-full self-end border-divider border-t py-2 pr-0 pl-2 font-medium text-base md:pr-4 md:pl-6">
      <div>
        <span className="text-secondary">Total:&nbsp;</span>
        <span className="text-pink-800 dark:text-pink-200">
          ${formatNumberWithCommas(props.amount)}
        </span>
      </div>
    </div>
  )
}
