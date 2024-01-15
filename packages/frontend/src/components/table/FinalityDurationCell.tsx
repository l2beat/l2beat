import React from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { DurationCell } from './DurationCell'

interface Props {
  data: {
    averageInSeconds: number
    minimumInSeconds: number
    maximumInSeconds: number
  }
}

export function FinalityDurationCell(props: Props) {
  return (
    <Tooltip data-testid="finality-duration-cell">
      <TooltipTrigger>
        <DurationCell durationInSeconds={props.data.averageInSeconds} />
      </TooltipTrigger>
      <TooltipContent>
        <div className="font-medium">
          <span>30-day time to finality:</span>
          <ul className="mt-1 list-inside list-disc">
            <li className="flex justify-between gap-4">
              Minimum:
              <DurationCell durationInSeconds={props.data.minimumInSeconds} />
            </li>
            <li className="flex justify-between gap-4">
              Average:
              <DurationCell durationInSeconds={props.data.averageInSeconds} />
            </li>
            <li className="flex justify-between gap-4">
              Maximum:
              <DurationCell durationInSeconds={props.data.maximumInSeconds} />
            </li>
          </ul>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
