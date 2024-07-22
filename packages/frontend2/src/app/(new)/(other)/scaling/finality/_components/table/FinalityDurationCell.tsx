import {
  type FinalityDataPoint,
  type WarningValueWithSentiment,
} from '@l2beat/shared-pure'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@radix-ui/react-tooltip'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { WarningBar } from '~/app/_components/warning-bar'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { type SyncStatus } from '~/types/SyncStatus'
import { formatTimestamp } from '~/utils/dates'
import { DurationCell } from './DurationCell'
import { GrayedOut } from './GrayedOut'

type BaseProps = {
  syncStatus: SyncStatus
  warning?: WarningValueWithSentiment
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
          <RoundedWarningIcon
            className="size-5"
            sentiment={props.warning.sentiment}
          />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <div className="font-medium">
          {!props.syncStatus.isSynced && (
            <>
              <span className="whitespace-pre text-balance">
                {`Values have not been synced since\n${format(
                  props.syncStatus,
                )}.`}
              </span>
              <HorizontalSeparator className="my-2 dark:border-slate-600" />
            </>
          )}
          <span>Past day avg. {popUpText}</span>
          <ul className="mt-1 list-inside list-disc">
            {props.scope === 'timeToInclusion' &&
              props.timings.minimumInSeconds !== undefined && (
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
              props.timings.maximumInSeconds !== undefined && (
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
            color={
              (
                {
                  bad: 'red',
                  neutral: 'gray',
                  warning: 'yellow',
                } as const
              )[props.warning.sentiment]
            }
            text={props.warning.value}
            ignoreMarkdown
          />
        )}
      </TooltipContent>
    </Tooltip>
  )
}

function format({ syncedUntil }: SyncStatus) {
  return formatTimestamp(syncedUntil, {
    mode: 'datetime',
    longMonthName: true,
  })
}
