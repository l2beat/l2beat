import React from 'react'

import { ScalingFinalityViewEntryData } from '../../pages/scaling/finality/types'
import { cn } from '../../utils/cn'
import { HorizontalSeparator } from '../HorizontalSeparator'
import { RoundedWarningIcon } from '../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { WarningBar } from '../WarningBar'
import { DurationCell } from './DurationCell'

interface Props {
  warning?: string
  timings: ScalingFinalityViewEntryData['timeToInclusion']
  syncStatus: ScalingFinalityViewEntryData['syncStatus']
}

export function FinalityDurationCell(props: Props) {
  return (
    <Tooltip data-testid="finality-duration-cell">
      <TooltipTrigger className="flex items-center gap-1">
        <div className={cn(!props.syncStatus.isSynced && '*:!text-gray-500')}>
          <DurationCell durationInSeconds={props.timings.averageInSeconds} />
        </div>
        {props.warning && (
          <RoundedWarningIcon className="size-5" sentiment="warning" />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <div className="font-medium">
          {!props.syncStatus.isSynced && (
            <>
              <span className="whitespace-pre text-balance">
                {`Values have not been synced since\n${props.syncStatus.displaySyncedUntil}.`}
              </span>
              <HorizontalSeparator className="my-2 dark:border-slate-600" />
            </>
          )}
          <span>Past day avg. time to inclusion</span>
          <ul className="mt-1 list-inside list-disc">
            {props.timings.minimumInSeconds && (
              <li className="flex justify-between gap-4">
                Minimum:
                <div>
                  <DurationCell
                    durationInSeconds={props.timings.minimumInSeconds}
                  />
                </div>
              </li>
            )}
            <li className="flex justify-between gap-4">
              Average:
              <div>
                <DurationCell
                  durationInSeconds={props.timings.averageInSeconds}
                />
              </div>
            </li>
            <li className="flex justify-between gap-4">
              Maximum:
              <div>
                <DurationCell
                  durationInSeconds={props.timings.maximumInSeconds}
                />
              </div>
            </li>
          </ul>
        </div>
        {props.warning && (
          <WarningBar
            className="mt-2"
            icon={RoundedWarningIcon}
            color="yellow"
            text={props.warning}
          />
        )}
      </TooltipContent>
    </Tooltip>
  )
}
