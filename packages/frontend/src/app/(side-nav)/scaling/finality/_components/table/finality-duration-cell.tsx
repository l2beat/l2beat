import type { WarningWithSentiment } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import {
  WarningBar,
  sentimentToWarningBarColor,
} from '~/components/warning-bar'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import type { FinalityDataPoint } from '~/server/features/scaling/finality/schema'
import { DurationCell } from './duration-cell'
import { SyncStatusWrapper } from './sync-status-wrapper'

type BaseProps = {
  isSynced: boolean
  warning?: WarningWithSentiment
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
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-1">
        <SyncStatusWrapper isSynced={props.isSynced}>
          <DurationCell durationInSeconds={props.timings.averageInSeconds} />
        </SyncStatusWrapper>

        {props.warning && (
          <RoundedWarningIcon
            className="size-5"
            sentiment={props.warning.sentiment}
          />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <div className="font-medium">
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
            color={sentimentToWarningBarColor(props.warning.sentiment)}
            text={props.warning.value}
            ignoreMarkdown
          />
        )}
      </TooltipContent>
    </Tooltip>
  )
}
