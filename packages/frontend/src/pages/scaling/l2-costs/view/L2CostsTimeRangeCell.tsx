import React from 'react'

import {
  L2CostsApiProject,
  L2CostsDetails,
} from '../../../../build/api/DELETE_THIS_FILE'
import { CostsBreakdown } from '../../../../components/CostsBreakdown'
import { cn } from '../../../../utils/cn'

type TableCellType = keyof L2CostsDetails

interface Props {
  data: L2CostsApiProject
  type: TableCellType
}

export function L2CostsTableCell(props: Props) {
  return (
    <div
      className="group"
      data-role="l2-costs-table-cell"
      data-time-range="7D"
      data-unit="ETH"
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
  details: L2CostsDetails
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
            {details[type].ethCost}
          </span>
          <span className="hidden group-data-[unit=USD]:inline">
            {details[type].usdCost}
          </span>
          <span className="hidden group-data-[unit=GAS]:inline">
            {details[type].gas}
          </span>
        </div>
        <CostsBreakdown
          blobs={details.blobs.ethCost}
          calldata={details.calldata.ethCost}
          compute={details.compute.ethCost}
          overhead={details.overhead.ethCost}
        />
      </div>
    )
  }

  return (
    <div className={className}>
      <span className="hidden group-data-[unit=ETH]:inline">
        {details[type].ethCost}
      </span>
      <span className="hidden group-data-[unit=USD]:inline">
        {details[type].usdCost}
      </span>
      <span className="hidden group-data-[unit=GAS]:inline">
        {details[type].gas}
      </span>
    </div>
  )
}
