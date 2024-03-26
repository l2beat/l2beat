import React from 'react'

import { CostsBreakdown } from '../../../../components/CostsBreakdown'
import { cn } from '../../../../utils/cn'
import { CostsData } from '../types'

type TableCellType = keyof CostsData[keyof CostsData]

interface Props {
  data: CostsData
  type: TableCellType
  className?: string
}

export function CostsTableCell(props: Props) {
  return (
    <div
      className={cn('group', props.className)}
      data-role="costs-table-cell"
      data-time-range="7D"
      data-unit="USD"
    >
      <Cell
        details={props.data.last24h}
        type={props.type}
        className='hidden group-data-[time-range="24H"]:flex'
      />
      <Cell
        details={props.data.last7d}
        type={props.type}
        className='hidden group-data-[time-range="7D"]:flex'
      />
      <Cell
        details={props.data.last30d}
        type={props.type}
        className='hidden group-data-[time-range="30D"]:flex'
      />
      <Cell
        details={props.data.last90d}
        type={props.type}
        className='hidden group-data-[time-range="90D"]:flex'
      />
    </div>
  )
}

interface CellProps {
  details: CostsData[keyof CostsData]
  type: TableCellType
  className?: string
}

function Cell({ details, className, type }: CellProps) {
  const isTotal = type === 'total'

  if (isTotal) {
    return (
      <div className={cn('flex-col items-end', className)}>
        <div className="text-right text-lg font-semibold">
          <span className="hidden group-data-[unit=ETH]:inline">
            {details[type].ethCost.displayValue}
          </span>
          <span className="hidden group-data-[unit=USD]:inline">
            {details[type].usdCost.displayValue}
          </span>
          <span className="hidden group-data-[unit=GAS]:inline">
            {details[type].gas.displayValue}
          </span>
        </div>
        <CostsBreakdown
          blobs={details.blobs.gas.value}
          calldata={details.calldata.gas.value}
          compute={details.compute.gas.value}
          overhead={details.overhead.gas.value}
        />
      </div>
    )
  }

  return (
    <div className={className}>
      <span className="hidden group-data-[unit=ETH]:inline">
        {details[type].ethCost.displayValue}
      </span>
      <span className="hidden group-data-[unit=USD]:inline">
        {details[type].usdCost.displayValue}
      </span>
      <span className="hidden group-data-[unit=GAS]:inline">
        {details[type].gas.displayValue}
      </span>
    </div>
  )
}
