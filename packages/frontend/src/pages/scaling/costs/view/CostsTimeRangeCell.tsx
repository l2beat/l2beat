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
      <div className={cn('flex-col items-end', className)}>
        <Tooltip>
          <TooltipTrigger>
            <div className="text-right text-lg font-semibold">
              <span className="hidden group-data-[unit=ETH]/costs-cell:inline">
                {details[type].ethCost.displayValue}
              </span>
              <span className="hidden group-data-[unit=USD]/costs-cell:inline">
                {details[type].usdCost.displayValue}
              </span>
              <span className="hidden group-data-[unit=GAS]/costs-cell:inline">
                {details[type].gas.displayValue}
              </span>
            </div>
            <CostsBreakdown
              blobs={details.blobs?.gas.value}
              calldata={details.calldata.gas.value}
              compute={details.compute.gas.value}
              overhead={details.overhead.gas.value}
            />
          </TooltipTrigger>
          <TooltipContent>
            <CostsBreakdownTooltipContent details={details} type={type} />
          </TooltipContent>
        </Tooltip>
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

function CostsBreakdownTooltipContent({ details }: CellProps) {
  return (
    <div>
      <span className="text-xs font-medium uppercase text-gray-500 dark:text-gray-50">
        Costs breakdown
      </span>
      <div className="mt-3 flex flex-col gap-2">
        <CostsBreakdownDetailRow
          label="Calldata"
          data={details.calldata}
          percentage={details.calldata.gas.value / details.total.gas.value}
          squareClassName="fill-blue-700 dark:fill-blue-400"
        />
        {details.blobs && (
          <CostsBreakdownDetailRow
            label="Blobs"
            data={details.blobs}
            percentage={details.blobs.gas.value / details.total.gas.value}
            squareClassName="dark:fill-yellow-100 fill-orange-400"
          />
        )}
        <CostsBreakdownDetailRow
          label="Compute"
          data={details.compute}
          percentage={details.compute.gas.value / details.total.gas.value}
          squareClassName="fill-pink-100"
        />
        <CostsBreakdownDetailRow
          label="Overhead"
          data={details.overhead}
          percentage={details.overhead.gas.value / details.total.gas.value}
          squareClassName="fill-green-500"
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
}: {
  label: string
  data: CostsDataBreakdown
  percentage: number
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
      <div className="inline-block text-xs font-medium">
        <span className="hidden group-data-[unit=ETH]/costs-cell:inline">
          {data.ethCost.displayValue}
        </span>
        <span>{data.usdCost.displayValue}</span>
        <span className="hidden group-data-[unit=GAS]/costs-cell:inline">
          {data.gas.displayValue}
        </span>{' '}
        <span className="font-normal text-gray-500 dark:text-gray-50">
          ({formatPercent(percentage)})
        </span>
      </div>
    </div>
  )
}
