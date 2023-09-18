import React from 'react'

import { formatLargeNumberWithCommas } from '../../../utils'

interface TableSumProps {
  type: 'NMV' | 'EBV' | 'CBV'
  amount: number
}

export function TableSum(props: TableSumProps) {
  return (
    <div className="mt-3 flex self-end text-base font-medium">
      <span className="text-gray-50">Total {props.type}:&nbsp;</span>
      <span className="text-pink-200">
        ${formatLargeNumberWithCommas(props.amount)}
      </span>
    </div>
  )
}
