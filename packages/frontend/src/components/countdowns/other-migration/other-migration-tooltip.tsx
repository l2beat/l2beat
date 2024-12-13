import { CloseIcon } from '~/icons/close'
import { StopwatchIcon } from '~/icons/stopwatch'
import { type ProjectCountdownsWithContext } from '~/server/features/scaling/utils/get-countdowns'
import { Callout } from '../../callout'
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
      <TooltipTrigger>
        <StopwatchIcon />
      </TooltipTrigger>
      <TooltipContent className="space-y-2">
        <p className="text-lg font-bold leading-none text-primary">
          Recategorisation
        </p>
        <p className="text-[13px]">The project will be moved to Others in:</p>
        <Countdown expiresAt={expiresAt} size="sm" />
        <p className="!mt-4 text-base font-bold leading-none text-primary">
          Reasons
        </p>
        <p className="text-[13px]">
          Items missing for being considered{' '}
          {pretendingToBe.startsWith('O') ? 'an' : 'a'} {pretendingToBe}:
        </p>
        {reasons.map((reason) => {
          return (
            <Callout
              key={reason.shortName}
              color="red"
              body={reason.shortDescription}
              className="px-6 py-3 text-xs font-bold text-red-600"
              icon={<CloseIcon className="mt-1 size-3 fill-red-600" />}
            />
          )
        })}
      </TooltipContent>
    </Tooltip>
  )
}
