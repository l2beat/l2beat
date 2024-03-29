import React from 'react'

import { Badge } from '../../../../components/badge/Badge'
import { DetailedValueWithDisplayValue } from '../../../../components/DetailedValueWithDisplayValue'
import { ValueWithDisplayValue } from '../../../types'
import { CostsData, CostsDataDetails } from '../types'
import { CostsControlsWrapper } from './CostsControlsWrapper'

type BreakdownValueType = Exclude<keyof CostsDataDetails, 'txCount' | 'total'>

interface Props {
  data: CostsData
  type: BreakdownValueType
  className?: string
}

interface CellProps {
  details: CostsDataDetails
  type: BreakdownValueType
  className?: string
}

export function CostsBreakdownValueCell(props: Props) {
  return (
    <CostsControlsWrapper className={props.className}>
      <Cell
        details={props.data.last24h}
        type={props.type}
        className='hidden group-data-[time-range="24H"]/costs-controls-wrapper:flex'
      />
      <Cell
        details={props.data.last7d}
        type={props.type}
        className='hidden group-data-[time-range="7D"]/costs-controls-wrapper:flex'
      />

      <Cell
        details={props.data.last30d}
        type={props.type}
        className='hidden group-data-[time-range="30D"]/costs-controls-wrapper:flex'
      />

      <Cell
        details={props.data.last90d}
        type={props.type}
        className='hidden group-data-[time-range="90D"]/costs-controls-wrapper:flex'
      />
    </CostsControlsWrapper>
  )
}

function Cell({ details, className, type }: CellProps) {
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
      <div className="hidden group-data-[unit=ETH]/costs-controls-wrapper:inline">
        <span className="hidden group-data-[type=TOTAL]/costs-controls-wrapper:inline">
          <Value>{detailsData.ethCost}</Value>
        </span>
        <span className="hidden group-data-[type=AMORTIZED]/costs-controls-wrapper:inline">
          <Value>{detailsData.ethCost.amortized}</Value>
        </span>
      </div>
      <div className="hidden group-data-[unit=USD]/costs-controls-wrapper:inline">
        <span className="hidden group-data-[type=TOTAL]/costs-controls-wrapper:inline">
          <Value>{detailsData.usdCost}</Value>
        </span>
        <span className="hidden group-data-[type=AMORTIZED]/costs-controls-wrapper:inline">
          <Value>{detailsData.usdCost.amortized}</Value>
        </span>
      </div>
      <div className="hidden group-data-[unit=GAS]/costs-controls-wrapper:inline">
        <span className="hidden group-data-[type=TOTAL]/costs-controls-wrapper:inline">
          <Value>{detailsData.gas}</Value>
        </span>
        <span className="hidden group-data-[type=AMORTIZED]/costs-controls-wrapper:inline">
          <Value>{detailsData.gas.amortized}</Value>
        </span>
      </div>
    </div>
  )
}

function Value({ children }: { children: ValueWithDisplayValue | undefined }) {
  if (!children) {
    return <Badge type="gray">Coming soon</Badge>
  }
  return (
    <DetailedValueWithDisplayValue>{children}</DetailedValueWithDisplayValue>
  )
}
