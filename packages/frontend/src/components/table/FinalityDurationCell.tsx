import React from 'react'

import { ScalingFinalityViewEntryData } from '../../pages/scaling/finality/types'
import { HorizontalSeparator } from '../HorizontalSeparator'
import { RoundedWarningIcon } from '../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { WarningBar } from '../WarningBar'
import { DurationCell } from './DurationCell'
import { GrayedOut } from './GrayedOut'

interface Props {
  data: ScalingFinalityViewEntryData
}

export function FinalityDurationCell(props: Props) {
  return (
    <Tooltip data-testid="finality-duration-cell">
      <TooltipTrigger className="flex items-center gap-1">
        <GrayedOut grayOut={!props.data.syncStatus.isSynced}>
          <DurationCell
            durationInSeconds={props.data.timeToInclusion.averageInSeconds}
          />
        </GrayedOut>
        {props.data.timeToInclusion.warning && (
          <RoundedWarningIcon className="size-5" sentiment="warning" />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <div className="font-medium">
          {!props.data.syncStatus.isSynced && (
            <>
              <span className="whitespace-pre text-balance">
                {`Values have not been synced since\n${props.data.syncStatus.displaySyncedUntil}.`}
              </span>
              <HorizontalSeparator className="my-2 dark:border-slate-600" />
            </>
          )}
          <span>Past day avg. time to inclusion</span>
          <ul className="mt-1 list-inside list-disc">
            {props.data.timeToInclusion.minimumInSeconds && (
              <li className="flex justify-between gap-4">
                Minimum:
                <div>
                  <DurationCell
                    durationInSeconds={
                      props.data.timeToInclusion.minimumInSeconds
                    }
                  />
                </div>
              </li>
            )}
            <li className="flex justify-between gap-4">
              Average:
              <div>
                <DurationCell
                  durationInSeconds={
                    props.data.timeToInclusion.averageInSeconds
                  }
                />
              </div>
            </li>
            <li className="flex justify-between gap-4">
              Maximum:
              <div>
                <DurationCell
                  durationInSeconds={
                    props.data.timeToInclusion.maximumInSeconds
                  }
                />
              </div>
            </li>
          </ul>
        </div>
        {props.data.timeToInclusion.warning && (
          <WarningBar
            className="mt-2"
            icon={RoundedWarningIcon}
            color="yellow"
            text={props.data.timeToInclusion.warning}
          />
        )}
      </TooltipContent>
    </Tooltip>
  )
}
