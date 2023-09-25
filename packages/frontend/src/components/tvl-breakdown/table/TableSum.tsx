import React from 'react'

import { formatLargeNumberWithCommas } from '../../../utils'

interface TableSumProps {
  amount: number
}

export function TableSum(props: TableSumProps) {
  return (
    <div className="mt-3 flex self-end pr-0 text-base font-medium md:pr-4">
      <span className="text-gray-500 dark:text-gray-50">Total:&nbsp;</span>
      <span className="text-pink-800 dark:text-pink-200">
        ${formatLargeNumberWithCommas(props.amount)}
      </span>
    </div>
  )
}
