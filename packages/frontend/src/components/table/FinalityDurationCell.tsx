import React from 'react'

import {
  ScalingFinalityViewEntry,
  SyncStatus,
} from '../../pages/scaling/finality/types'
import { cn } from '../../utils/cn'
import { HorizontalSeparator } from '../HorizontalSeparator'
import { RoundedWarningIcon } from '../icons'
import { WarningBar } from '../project/WarningBar'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { DurationCell } from './DurationCell'

interface Props {
  data: ScalingFinalityViewEntry['timeToInclusion']
  syncStatus: SyncStatus
}

export function FinalityDurationCell(props: Props) {
  return (
    <Tooltip data-testid="finality-duration-cell">
      <TooltipTrigger className="flex items-center gap-1">
        <div className={cn(!props.syncStatus.isSynced && '*:!text-gray-500')}>
          <DurationCell durationInSeconds={props.data.averageInSeconds} />
        </div>
        {props.data.warning && (
          <RoundedWarningIcon className="size-5 fill-yellow-700 dark:fill-yellow-300" />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <div className="font-medium">
          {!props.syncStatus.isSynced && (
            <>
              <span className="whitespace-pre text-balance">
                {`Values has not been synced since\n${props.syncStatus.displaySyncedUntil}.`}
              </span>
              <HorizontalSeparator className="my-2 dark:border-slate-600" />
            </>
          )}
          <span>30-day avg. time to inclusion</span>
          <ul className="mt-1 list-inside list-disc">
            {props.data.minimumInSeconds && (
              <li className="flex justify-between gap-4">
                Minimum:
                <div>
                  <DurationCell
                    durationInSeconds={props.data.minimumInSeconds}
                  />
                </div>
              </li>
            )}
            <li className="flex justify-between gap-4">
              Average:
              <div>
                <DurationCell durationInSeconds={props.data.averageInSeconds} />
              </div>
            </li>
            <li className="flex justify-between gap-4">
              Maximum:
              <div>
                <DurationCell durationInSeconds={props.data.maximumInSeconds} />
              </div>
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
