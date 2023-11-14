import React from 'react'

interface Props {
  last30Days: React.ReactNode
  last90Days: React.ReactNode
  max: React.ReactNode
}

export function LivenessTimeRangeCell(props: Props) {
  return (
    <span
      data-role="liveness-time-range-cell"
      data-state="30D"
      className="group"
    >
      <span className="hidden group-data-[state='30D']:inline">
        {props.last30Days}
      </span>
      <span className="hidden group-data-[state='90D']:inline">
        {props.last90Days}
      </span>
      <span className="hidden group-data-[state='MAX']:inline">
        {props.max}
      </span>
    </span>
  )
}
