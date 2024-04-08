import { WarningWithSentiment } from '@l2beat/config'
import React from 'react'

import { CostsBreakdown } from '../../../../components/breakdown/CostsBreakdown'
import { DetailedValueWithDisplayValue } from '../../../../components/DetailedValueWithDisplayValue'
import { RoundedWarningIcon } from '../../../../components/icons'
import { Callout } from '../../../../components/project/Callout'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/tooltip/Tooltip'
import { LONG_HYPHEN } from '../../../../utils/constants'
import { CostsData, CostsDataBreakdown, CostsDataDetails } from '../types'
import { CostsControlsWrapper } from './CostsControlsWrapper'

interface CellProps {
  data: CostsData
  warning?: WarningWithSentiment
  className?: string
}

export function CostsTotalCell({ data, className, warning }: CellProps) {
  return (
    <CostsControlsWrapper className={className} syncStatus={data.syncStatus}>
      <div className='hidden group-data-[time-range="1D"]/costs-controls-wrapper:block'>
        <TotalValue
          details={data.last24h}
          unit="usdCost"
          warning={warning}
          className="hidden group-data-[unit=USD]/costs-controls-wrapper:block"
        />
        <TotalValue
          details={data.last24h}
          unit="ethCost"
          warning={warning}
          className="hidden group-data-[unit=ETH]/costs-controls-wrapper:block"
        />
        <TotalValue
          details={data.last24h}
          unit="gas"
          warning={warning}
          className="hidden group-data-[unit=GAS]/costs-controls-wrapper:block"
        />
      </div>
      <div className='hidden group-data-[time-range="7D"]/costs-controls-wrapper:block'>
        <TotalValue
          details={data.last7d}
          unit="usdCost"
          warning={warning}
          className="hidden group-data-[unit=USD]/costs-controls-wrapper:block"
        />
        <TotalValue
          details={data.last7d}
          unit="ethCost"
          warning={warning}
          className="hidden group-data-[unit=ETH]/costs-controls-wrapper:block"
        />
        <TotalValue
          details={data.last7d}
          unit="gas"
          warning={warning}
          className="hidden group-data-[unit=GAS]/costs-controls-wrapper:block"
        />
      </div>
      <div className='hidden group-data-[time-range="30D"]/costs-controls-wrapper:block'>
        <TotalValue
          details={data.last30d}
          unit="usdCost"
          warning={warning}
          className="hidden group-data-[unit=USD]/costs-controls-wrapper:block"
        />
        <TotalValue
          details={data.last30d}
          unit="ethCost"
          warning={warning}
          className="hidden group-data-[unit=ETH]/costs-controls-wrapper:block"
        />
        <TotalValue
          details={data.last30d}
          unit="gas"
          warning={warning}
          className="hidden group-data-[unit=GAS]/costs-controls-wrapper:block"
        />
      </div>
      <div className='hidden group-data-[time-range="90D"]/costs-controls-wrapper:block'>
        <TotalValue
          details={data.last90d}
          unit="usdCost"
          warning={warning}
          className="hidden group-data-[unit=USD]/costs-controls-wrapper:block"
        />
        <TotalValue
          details={data.last90d}
          unit="ethCost"
          warning={warning}
          className="hidden group-data-[unit=ETH]/costs-controls-wrapper:block"
        />
        <TotalValue
          details={data.last90d}
          unit="gas"
          warning={warning}
          className="hidden group-data-[unit=GAS]/costs-controls-wrapper:block"
        />
      </div>
      <div className='hidden group-data-[time-range="180D"]/costs-controls-wrapper:block'>
        <TotalValue
          details={data.last180d}
          unit="usdCost"
          warning={warning}
          className="hidden group-data-[unit=USD]/costs-controls-wrapper:block"
        />
        <TotalValue
          details={data.last180d}
          unit="ethCost"
          warning={warning}
          className="hidden group-data-[unit=ETH]/costs-controls-wrapper:block"
        />
        <TotalValue
          details={data.last180d}
          unit="gas"
          warning={warning}
          className="hidden group-data-[unit=GAS]/costs-controls-wrapper:block"
        />
      </div>
    </CostsControlsWrapper>
  )
}

function TotalValue({
  details,
  unit,
  className,
  warning,
}: {
  className?: string
  details: CostsDataDetails
  unit: keyof CostsDataBreakdown
  warning?: WarningWithSentiment
}) {
  const data = details.total[unit]
  return (
    <div className={className}>
      <div className="hidden flex-col items-end group-data-[type=TOTAL]/costs-controls-wrapper:flex">
        <div className="flex items-center gap-1">
          {warning && <Warning warning={warning} />}
          <span className="text-lg font-semibold">
            <DetailedValueWithDisplayValue>
              {data}
            </DetailedValueWithDisplayValue>
          </span>
        </div>
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
            <div className="flex items-center gap-1">
              {warning && <Warning warning={warning} />}
              <span className="text-lg font-semibold">
                <DetailedValueWithDisplayValue>
                  {data.perL2Tx}
                </DetailedValueWithDisplayValue>
              </span>
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

function Warning({ warning }: { warning: WarningWithSentiment }) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <RoundedWarningIcon className="size-4" sentiment={warning.sentiment} />
      </TooltipTrigger>
      <TooltipContent>
        <Callout
          icon={
            <RoundedWarningIcon
              className="size-5"
              sentiment={warning.sentiment}
            />
          }
          body={warning.content}
        />
      </TooltipContent>
    </Tooltip>
  )
}
