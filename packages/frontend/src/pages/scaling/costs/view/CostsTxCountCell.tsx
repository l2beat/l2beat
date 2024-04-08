import React from 'react'

import { LONG_HYPHEN } from '../../../../utils/constants'
import { ValueWithDisplayValue } from '../../../types'
import { CostsData } from '../types'
import { CostsControlsWrapper } from './CostsControlsWrapper'

interface Props {
  data: CostsData
  className?: string
}

export function CostsTxCountCell(props: Props) {
  return (
    <CostsControlsWrapper className={props.className}>
      <div className='hidden group-data-[time-range="1D"]/costs-controls-wrapper:block'>
        <Cell txCount={props.data.last24h.txCount} />
      </div>
      <div className='hidden group-data-[time-range="7D"]/costs-controls-wrapper:block'>
        <Cell txCount={props.data.last7d.txCount} />
      </div>
      <div className='hidden group-data-[time-range="30D"]/costs-controls-wrapper:block'>
        <Cell txCount={props.data.last30d.txCount} />
      </div>
      <div className='hidden group-data-[time-range="90D"]/costs-controls-wrapper:block'>
        <Cell txCount={props.data.last90d.txCount} />
      </div>
      <div className='hidden group-data-[time-range="180D"]/costs-controls-wrapper:block'>
        <Cell txCount={props.data.last180d.txCount} />
      </div>
    </CostsControlsWrapper>
  )
}

function Cell(props: { txCount: ValueWithDisplayValue | undefined }) {
  if (!props.txCount) {
    return LONG_HYPHEN
  }

  return props.txCount.displayValue
}
