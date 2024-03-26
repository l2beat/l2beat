import React from 'react'

import { Badge } from '../../../../components/badge/Badge'
import { CostsBreakdown } from '../../../../components/CostsBreakdown'
import { Square } from '../../../../components/Square'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/tooltip/Tooltip'
import { cn } from '../../../../utils/cn'
import { formatPercent } from '../../../../utils/utils'
import { CostsData, CostsDataBreakdown, CostsDataDetails } from '../types'
type TableCellType = keyof CostsDataDetails

interface Props {
  data: CostsData
  type: TableCellType
  className?: string
}

export function CostsTableCell(props: Props) {
  return (
    <div
      className={cn('group/costs-cell', props.className)}
      data-role="costs-table-cell"
      data-time-range="7D"
      data-unit="USD"
    >
      <Cell
        details={props.data.last24h}
        type={props.type}
        className='hidden group-data-[time-range="24H"]/costs-cell:flex'
      />
      <Cell
        details={props.data.last7d}
        type={props.type}
        className='hidden group-data-[time-range="7D"]/costs-cell:flex'
      />
      <Cell
        details={props.data.last30d}
        type={props.type}
        className='hidden group-data-[time-range="30D"]/costs-cell:flex'
      />
      <Cell
        details={props.data.last90d}
        type={props.type}
        className='hidden group-data-[time-range="90D"]/costs-cell:flex'
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
      <div className={className}>
        <CostsBreakdownTooltip details={details} type={type} />
      </div>
    )
  }

  const detailsData = details[type]

  if (!detailsData) {
    return (
      <Badge type="gray" className={className}>
        N/A
      </Badge>
    )
  }

  return (
    <div className={className}>
      <span className="hidden group-data-[unit=ETH]/costs-cell:inline">
        {details[type]?.ethCost.displayValue}
      </span>
      <span className="hidden group-data-[unit=USD]/costs-cell:inline">
        {details[type]?.usdCost.displayValue}
      </span>
      <span className="hidden group-data-[unit=GAS]/costs-cell:inline">
        {details[type]?.gas.displayValue}
      </span>
    </div>
  )
}

function CostsBreakdownTooltip({ details }: CellProps) {
  return (
    <>
      <Tooltip className="hidden group-data-[unit=ETH]/costs-cell:block">
        <TooltipTrigger className="text-right">
          <span className="text-lg font-semibold">
            {details.total.ethCost.displayValue}
          </span>
          <CostsBreakdown
            blobs={details.blobs?.ethCost.value}
            calldata={details.calldata.ethCost.value}
            compute={details.compute.ethCost.value}
            overhead={details.overhead.ethCost.value}
          />
        </TooltipTrigger>
        <TooltipContent>
          <CostsBreakdownTooltipContent details={details} unit="ethCost" />
        </TooltipContent>
      </Tooltip>
      <Tooltip className="hidden group-data-[unit=USD]/costs-cell:block">
        <TooltipTrigger className="text-right">
          <span className="text-lg font-semibold">
            {details.total.usdCost.displayValue}
          </span>
          <CostsBreakdown
            blobs={details.blobs?.usdCost.value}
            calldata={details.calldata.usdCost.value}
            compute={details.compute.usdCost.value}
            overhead={details.overhead.usdCost.value}
          />
        </TooltipTrigger>
        <TooltipContent>
          <CostsBreakdownTooltipContent details={details} unit="usdCost" />
        </TooltipContent>
      </Tooltip>
      <Tooltip className="hidden group-data-[unit=GAS]/costs-cell:block">
        <TooltipTrigger className="text-right">
          <span className="text-lg font-semibold">
            {details.total.gas.displayValue}
          </span>
          <CostsBreakdown
            blobs={details.blobs?.gas.value}
            calldata={details.calldata.gas.value}
            compute={details.compute.gas.value}
            overhead={details.overhead.gas.value}
          />
        </TooltipTrigger>
        <TooltipContent>
          <CostsBreakdownTooltipContent details={details} unit="gas" />
        </TooltipContent>
      </Tooltip>
    </>
  )
}

function CostsBreakdownTooltipContent({
  details,
  unit,
}: {
  details: CostsDataDetails
  unit: keyof CostsDataBreakdown
}) {
  return (
    <div>
      <span className="text-xs font-medium uppercase text-gray-500 dark:text-gray-50">
        Costs breakdown
      </span>
      <div className="mt-3 flex flex-col gap-2">
        <CostsBreakdownDetailRow
          label="Calldata"
          data={details.calldata}
          percentage={details.calldata[unit].value / details.total[unit].value}
          squareClassName="fill-blue-700 dark:fill-blue-400"
          unit={unit}
        />
        {details.blobs && (
          <CostsBreakdownDetailRow
            label="Blobs"
            data={details.blobs}
            percentage={details.blobs[unit].value / details.total[unit].value}
            squareClassName="dark:fill-yellow-100 fill-orange-400"
            unit={unit}
          />
        )}
        <CostsBreakdownDetailRow
          label="Compute"
          data={details.compute}
          percentage={details.compute[unit].value / details.total[unit].value}
          squareClassName="fill-pink-100"
          unit={unit}
        />
        <CostsBreakdownDetailRow
          label="Overhead"
          data={details.overhead}
          percentage={details.overhead[unit].value / details.total[unit].value}
          squareClassName="fill-green-500"
          unit={unit}
        />
      </div>
    </div>
  )
}

function CostsBreakdownDetailRow({
  label,
  data,
  percentage,
  squareClassName,
  unit,
}: {
  label: string
  data: CostsDataBreakdown
  percentage: number
  unit: keyof CostsDataBreakdown
  squareClassName: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Square
          width={16}
          height={16}
          className={cn('rounded', squareClassName)}
        />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className="text-xs font-medium">
        {data[unit].displayValue}{' '}
        <span className="font-normal text-gray-500 dark:text-gray-50">
          ({formatPercent(percentage)})
        </span>
      </span>
    </div>
  )
}
