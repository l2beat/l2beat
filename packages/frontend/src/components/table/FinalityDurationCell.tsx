import React from 'react'

import { SyncStatus } from '../../pages/types'
import { HorizontalSeparator } from '../HorizontalSeparator'
import { RoundedWarningIcon } from '../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { WarningBar } from '../WarningBar'
import { DurationCell } from './DurationCell'
import { GrayedOut } from './GrayedOut'
import { FinalityDataPoint } from '@l2beat/shared-pure'

type BaseProps = {
  syncStatus: SyncStatus
  warning?: string
}

type Props =
  | {
      scope: 'timeToInclusion'
      timings: FinalityDataPoint
    }
  | {
      scope: 'stateUpdateDelay'
      timings: Pick<FinalityDataPoint, 'averageInSeconds'>
    }

export function FinalityDurationCell(props: Props & BaseProps) {
  const popUpText =
    props.scope === 'timeToInclusion'
      ? 'time to inclusion'
      : 'state update delay'

  return (
    <Tooltip data-testid="finality-duration-cell">
      <TooltipTrigger className="flex items-center gap-1">
        <GrayedOut grayOut={!props.syncStatus.isSynced}>
          <DurationCell durationInSeconds={props.timings.averageInSeconds} />
        </GrayedOut>
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
          <span>Past day avg. {popUpText}</span>
          <ul className="mt-1 list-inside list-disc">
            {props.scope === 'timeToInclusion' &&
              props.timings.minimumInSeconds && (
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
            {props.scope === 'timeToInclusion' &&
              props.timings.maximumInSeconds && (
                <li className="flex justify-between gap-4">
                  Maximum:
                  <div>
                    <DurationCell
                      durationInSeconds={props.timings.maximumInSeconds}
                    />
                  </div>
                </li>
              )}
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
