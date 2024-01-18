import React from 'react'

import { ScalingFinalityViewEntry } from '../../pages/scaling/finality/types'
import { RoundedWarningIcon } from '../icons'
import { WarningBar } from '../project/WarningBar'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { DurationCell } from './DurationCell'

interface Props {
  data: ScalingFinalityViewEntry['timeToFinalize']
}

export function FinalityDurationCell(props: Props) {
  return (
    <Tooltip data-testid="finality-duration-cell">
      <TooltipTrigger className="flex items-center gap-1">
        <DurationCell durationInSeconds={props.data.averageInSeconds} />
        {props.data.warning && (
          <RoundedWarningIcon className="h-5 w-5 fill-yellow-700 dark:fill-yellow-300" />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <div className="font-medium">
          <span>30-day avg. time to finality</span>
          <ul className="mt-1 list-inside list-disc">
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
        {props.data.warning && (
          <WarningBar
            className="mt-2"
            icon={RoundedWarningIcon}
            color="yellow"
            text={props.data.warning}
          />
        )}
      </TooltipContent>
    </Tooltip>
  )
}
