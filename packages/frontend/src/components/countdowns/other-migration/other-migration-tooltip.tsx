import { CloseIcon } from '~/icons/close'
import { StopwatchIcon } from '~/icons/stopwatch'
import type { ProjectCountdownsWithContext } from '~/server/features/scaling/utils/get-countdowns'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/tooltip'
import { Countdown } from '../../countdown'

type Props = NonNullable<ProjectCountdownsWithContext['otherMigration']>
export function OtherMigrationTooltip({
  expiresAt,
  pretendingToBe,
  reasons,
}: Props) {
  return (
    <Tooltip>
      <TooltipTrigger className="-top-px relative">
        <StopwatchIcon className="size-3.5 md:size-4" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="heading-16">Recategorisation</p>
        <p className="label-value-14-bold mt-3">
          The project will be moved to Others & no longer considered{' '}
          {pretendingToBe.startsWith('O') ? 'an' : 'a'} {pretendingToBe} in:
        </p>
        <Countdown
          expiresAt={expiresAt}
          size="xs"
          className="mx-auto mt-2 w-full py-1"
          withBackground
        />
        <p className="label-value-14-bold !mb-1.5 !mt-3">Reasons</p>
        {reasons.map((reason) => {
          return (
            <div key={reason.label} className="flex items-start gap-2">
              <CloseIcon className="mt-0.5 size-3 fill-negative" />
              <p>{reason.shortDescription}</p>
            </div>
          )
        })}
      </TooltipContent>
    </Tooltip>
  )
}
