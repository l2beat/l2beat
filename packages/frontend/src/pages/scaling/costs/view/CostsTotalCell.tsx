import React from 'react'

import { CostsBreakdown } from '../../../../components/breakdown/CostsBreakdown'
import { LONG_HYPHEN } from '../../../../utils/constants'
import { CostsData, CostsDataBreakdown, CostsDataDetails } from '../types'
import { CostsControlsWrapper } from './CostsControlsWrapper'

interface CellProps {
  data: CostsData
  className?: string
}

export function CostsTotalCell({ data, className }: CellProps) {
  return (
    <CostsControlsWrapper className={className} syncStatus={data.syncStatus}>
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
      <div className='hidden group-data-[time-range="180D"]/costs-controls-wrapper:block'>
        <TotalValue
          details={data.last180d}
          unit="usdCost"
          className="hidden group-data-[unit=USD]/costs-controls-wrapper:block"
        />
        <TotalValue
          className="hidden group-data-[unit=ETH]/costs-controls-wrapper:block"
          unit="ethCost"
          details={data.last180d}
        />
        <TotalValue
          className="hidden group-data-[unit=GAS]/costs-controls-wrapper:block"
          unit="gas"
          details={data.last180d}
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
      <div className="hidden flex-col items-end group-data-[type=PER-L2-TX]/costs-controls-wrapper:flex">
        {data.perL2Tx ? (
          <>
            <div className="text-lg font-semibold">
              {data.perL2Tx.displayValue}
            </div>
            <CostsBreakdown
              blobs={details.blobs?.[unit].perL2Tx?.value}
              calldata={details.calldata[unit].perL2Tx?.value}
              compute={details.compute[unit].perL2Tx?.value}
              overhead={details.overhead[unit].perL2Tx?.value}
            />
          </>
        ) : (
          LONG_HYPHEN
        )}
      </div>
    </div>
  )
}
