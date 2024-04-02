import React from 'react'

import { Badge } from '../../../../components/badge/Badge'
import { CostsBreakdown } from '../../../../components/CostsBreakdown'
import { CostsData, CostsDataBreakdown, CostsDataDetails } from '../types'
import { CostsControlsWrapper } from './CostsControlsWrapper'

interface CellProps {
  data: CostsData
  className?: string
}

export function CostsTotalCell({ data, className }: CellProps) {
  return (
    <CostsControlsWrapper className={className}>
      <div className='hidden group-data-[time-range="1D"]/costs-controls-wrapper:block'>
        <TotalValue
          details={data.last24h}
          unit="usdCost"
          className="hidden group-data-[unit=USD]/costs-controls-wrapper:block"
        />
        <TotalValue
          className="hidden group-data-[unit=ETH]/costs-controls-wrapper:block"
          unit="ethCost"
          details={data.last24h}
        />
        <TotalValue
          className="hidden group-data-[unit=GAS]/costs-controls-wrapper:block"
          unit="gas"
          details={data.last24h}
        />
      </div>
      <div className='hidden group-data-[time-range="7D"]/costs-controls-wrapper:block'>
        <TotalValue
          details={data.last7d}
          unit="usdCost"
          className="hidden group-data-[unit=USD]/costs-controls-wrapper:block"
        />
        <TotalValue
          className="hidden group-data-[unit=ETH]/costs-controls-wrapper:block"
          unit="ethCost"
          details={data.last7d}
        />
        <TotalValue
          className="hidden group-data-[unit=GAS]/costs-controls-wrapper:block"
          unit="gas"
          details={data.last7d}
        />
      </div>
      <div className='hidden group-data-[time-range="30D"]/costs-controls-wrapper:block'>
        <TotalValue
          details={data.last30d}
          unit="usdCost"
          className="hidden group-data-[unit=USD]/costs-controls-wrapper:block"
        />
        <TotalValue
          className="hidden group-data-[unit=ETH]/costs-controls-wrapper:block"
          unit="ethCost"
          details={data.last30d}
        />
        <TotalValue
          className="hidden group-data-[unit=GAS]/costs-controls-wrapper:block"
          unit="gas"
          details={data.last30d}
        />
      </div>
      <div className='hidden group-data-[time-range="90D"]/costs-controls-wrapper:block'>
        <TotalValue
          details={data.last90d}
          unit="usdCost"
          className="hidden group-data-[unit=USD]/costs-controls-wrapper:block"
        />
        <TotalValue
          className="hidden group-data-[unit=ETH]/costs-controls-wrapper:block"
          unit="ethCost"
          details={data.last90d}
        />
        <TotalValue
          className="hidden group-data-[unit=GAS]/costs-controls-wrapper:block"
          unit="gas"
          details={data.last90d}
        />
      </div>
    </CostsControlsWrapper>
  )
}

function TotalValue({
  details,
  unit,
  className,
}: {
  className?: string
  details: CostsDataDetails
  unit: keyof CostsDataBreakdown
}) {
  const data = details.total[unit]
  return (
    <div className={className}>
      <div className="hidden flex-col items-end group-data-[type=TOTAL]/costs-controls-wrapper:flex">
        <div className="text-lg font-semibold">{data.displayValue}</div>
        <CostsBreakdown
          blobs={details.blobs?.[unit].value}
          calldata={details.calldata[unit].value}
          compute={details.compute[unit].value}
          overhead={details.overhead[unit].value}
        />
      </div>
      <div className="hidden flex-col items-end group-data-[type=AMORTIZED]/costs-controls-wrapper:flex">
        {data.amortized ? (
          <>
            <div className="text-lg font-semibold">
              {data.amortized.displayValue}
            </div>
            <CostsBreakdown
              blobs={details.blobs?.[unit].amortized?.value}
              calldata={details.calldata[unit].amortized?.value}
              compute={details.compute[unit].amortized?.value}
              overhead={details.overhead[unit].amortized?.value}
            />
          </>
        ) : (
          <Badge type="gray">Coming soon</Badge>
        )}
      </div>
    </div>
  )
}
