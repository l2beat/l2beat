import React from 'react'

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
import { CostsControlsWrapper } from './CostsControlsWrapper'

interface CellProps {
  data: CostsData
  className?: string
}

export function CostsTotalCell({ data, className }: CellProps) {
  return (
    <CostsControlsWrapper className={className}>
      <div className='hidden group-data-[time-range="24H"]/costs-controls-wrapper:block'>
        <TotalTooltip
          details={data.last24h}
          unit="usdCost"
          className="hidden group-data-[unit=USD]/costs-controls-wrapper:block"
        />
        <TotalTooltip
          className="hidden group-data-[unit=ETH]/costs-controls-wrapper:block"
          unit="ethCost"
          details={data.last24h}
        />
        <TotalTooltip
          className="hidden group-data-[unit=GAS]/costs-controls-wrapper:block"
          unit="gas"
          details={data.last24h}
        />
      </div>
      <div className='hidden group-data-[time-range="7D"]/costs-controls-wrapper:block'>
        <TotalTooltip
          details={data.last7d}
          unit="usdCost"
          className="hidden group-data-[unit=USD]/costs-controls-wrapper:block"
        />
        <TotalTooltip
          className="hidden group-data-[unit=ETH]/costs-controls-wrapper:block"
          unit="ethCost"
          details={data.last7d}
        />
        <TotalTooltip
          className="hidden group-data-[unit=GAS]/costs-controls-wrapper:block"
          unit="gas"
          details={data.last7d}
        />
      </div>
      <div className='hidden group-data-[time-range="30D"]/costs-controls-wrapper:block'>
        <TotalTooltip
          details={data.last30d}
          unit="usdCost"
          className="hidden group-data-[unit=USD]/costs-controls-wrapper:block"
        />
        <TotalTooltip
          className="hidden group-data-[unit=ETH]/costs-controls-wrapper:block"
          unit="ethCost"
          details={data.last30d}
        />
        <TotalTooltip
          className="hidden group-data-[unit=GAS]/costs-controls-wrapper:block"
          unit="gas"
          details={data.last30d}
        />
      </div>
      <div className='hidden group-data-[time-range="90D"]/costs-controls-wrapper:block'>
        <TotalTooltip
          details={data.last90d}
          unit="usdCost"
          className="hidden group-data-[unit=USD]/costs-controls-wrapper:block"
        />
        <TotalTooltip
          className="hidden group-data-[unit=ETH]/costs-controls-wrapper:block"
          unit="ethCost"
          details={data.last90d}
        />
        <TotalTooltip
          className="hidden group-data-[unit=GAS]/costs-controls-wrapper:block"
          unit="gas"
          details={data.last90d}
        />
      </div>
    </CostsControlsWrapper>
  )
}

function TotalTooltip({
  details,
  unit,
  className,
}: {
  className?: string
  details: CostsDataDetails
  unit: keyof CostsDataBreakdown
}) {
  return (
    <Tooltip className={className}>
      <TooltipTrigger className="flex flex-col items-end">
        <div className="text-lg font-semibold">
          {details.total[unit].displayValue}
        </div>
        <CostsBreakdown
          blobs={details.blobs?.[unit].value}
          calldata={details.calldata[unit].value}
          compute={details.compute[unit].value}
          overhead={details.overhead[unit].value}
        />
      </TooltipTrigger>
      <TooltipContent>
        <CostsBreakdownTooltipContent details={details} unit={unit} />
      </TooltipContent>
    </Tooltip>
  )
}

function CostsBreakdownTooltipContent({
  details,
  unit,
}: {
  details: CostsDataDetails
  unit: keyof CostsDataBreakdown
}) {
  if (!details.total[unit].value) {
    return null
  }

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
