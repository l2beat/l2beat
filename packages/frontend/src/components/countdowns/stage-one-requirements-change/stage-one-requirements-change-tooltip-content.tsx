import type { StageConfigured } from '@l2beat/config'
import { StageBadge } from '~/components/badge/stage-badge'
import { MissingIcon } from '~/icons/missing'
import { Countdown } from '../../countdown'

interface Props {
  downgradePending: NonNullable<StageConfigured['downgradePending']>
}

export function StageOneRequirementsChangeTooltipContent({
  downgradePending,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="text-[13px]">
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
        size="sm"
        className="mx-auto w-full"
        withBackground
      />
      <p className="!mt-4 font-bold leading-none text-primary">Reasons</p>
      <div className="flex gap-2">
        <MissingIcon className="size-4 shrink-0 fill-negative" />
        <span>{downgradePending.reason}</span>
      </div>
    </div>
  )
}
