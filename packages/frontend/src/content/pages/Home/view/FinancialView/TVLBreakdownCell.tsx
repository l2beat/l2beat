import React from 'react'

import { InfoIcon, WarningIcon } from '../../../../common/icons'

export interface TVLBreakdownCellProps {
  warning?: string
  warningSeverity: 'info' | 'warning' | 'bad'
  label: string
  associated: number
  ether: number
  stable: number
  other: number
}

export function TVLBreakdownCell(props: TVLBreakdownCellProps) {
  return (
    <span className="TVLBreakdownCell">
      {props.warning && (
        <div className="TVLBreakdownCell-TvlWarning">
          <div className="Tooltip" title={props.warning}>
            {props.warningSeverity === 'info' && (
              <InfoIcon fill="var(--text-info)" />
            )}
            {props.warningSeverity === 'warning' && (
              <WarningIcon fill="var(--text-warning)" />
            )}
            {props.warningSeverity === 'bad' && (
              <WarningIcon fill="var(--text-bad)" />
            )}
          </div>
        </div>
      )}
      <span className="Tooltip" data-tooltip-align="right" title={props.label}>
        <svg
          className="TVLBreakdownCell-Breakdown"
          width="100"
          height="21"
          viewBox="0 0 100 21"
          fill="none"
        >
          <rect x="0" y="0" width="100" height="21" fill="red" />
        </svg>
      </span>
    </span>
  )
}
