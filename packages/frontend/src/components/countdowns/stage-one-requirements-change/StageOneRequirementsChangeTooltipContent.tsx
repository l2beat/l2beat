import type { StageConfigured } from '@l2beat/config'
import { StageBadge } from '~/components/badge/StageBadge'
import { MissingIcon } from '~/icons/Missing'
import { Countdown } from '../../Countdown'

interface Props {
  downgradePending: NonNullable<StageConfigured['downgradePending']>
}

export function StageOneRequirementsChangeTooltipContent({
  downgradePending,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="font-bold text-label-value-14">
        The project will be downgraded to{' '}
        <StageBadge
          stage={downgradePending.toStage}
          isAppchain={false}
          className="inline"
        />{' '}
        in:
      </div>
      <Countdown
        expiresAt={downgradePending.expiresAt}
        size="xs"
        className="mx-auto w-full py-1"
        withBackground
      />
      <p className="mt-4! font-bold text-label-value-14 text-primary">
        Reasons
      </p>
      <div className="flex gap-2">
        <MissingIcon className="size-4 shrink-0 fill-negative" />
        <span>{downgradePending.reason}</span>
      </div>
    </div>
  )
}
