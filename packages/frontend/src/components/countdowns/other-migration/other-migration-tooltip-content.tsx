import { CloseIcon } from '~/icons/close'
import type { ProjectCountdownsWithContext } from '~/server/features/scaling/utils/get-countdowns'
import { Callout } from '../../callout'
import { Countdown } from '../../countdown'

type Props = NonNullable<ProjectCountdownsWithContext['otherMigration']>
export function OtherMigrationTooltipContent({
  expiresAt,
  pretendingToBe,
  reasons,
}: Props) {
  return (
    <div className="space-y-2">
      <p className="text-lg font-bold leading-none text-primary">
        Recategorisation
      </p>
      <p className="text-[13px]">The project will be moved to Others in:</p>
      <Countdown
        expiresAt={expiresAt}
        size="sm"
        className="mx-auto w-full"
        withBackground
      />
      <p className="!mt-4 text-base font-bold leading-none text-primary">
        Reasons
      </p>
      <p className="text-[13px]">
        The project will no longer be considered{' '}
        {pretendingToBe.startsWith('O') ? 'an' : 'a'} {pretendingToBe} because:
      </p>
      {reasons.map((reason) => {
        return (
          <Callout
            key={reason.label}
            color="red"
            body={reason.shortDescription}
            className="px-4 py-2 text-xs font-bold text-primary"
            icon={<CloseIcon className="mt-1 size-3 fill-negative" />}
          />
        )
      })}
    </div>
  )
}
