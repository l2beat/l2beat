'use client'
import { Callout } from '~/components/callout'
import { Countdown } from '~/components/countdown'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import { CloseIcon } from '~/icons/close'
import { type ProjectCountdownsWithContext } from '~/server/features/scaling/utils/get-countdowns'

type Props = NonNullable<ProjectCountdownsWithContext['otherMigration']>
export function OtherMigrationNotice({ expiresAt, reasons }: Props) {
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'mobile'
  return (
    <div className="mt-10 border-2 border-brand p-8 max-md:border-x-0 md:rounded-lg">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <h2 className="mr-auto text-2xl font-bold md:text-3xl">
          Recategorisation
        </h2>
        <Countdown expiresAt={expiresAt} size={isMobile ? 'sm' : 'md'} />
      </div>
      <p className="mb-4 mt-6 text-lg font-bold">
        The project will move to Others because:
      </p>
      <div className="space-y-6">
        {reasons.map((reason) => (
          <div key={reason.label}>
            <Callout
              body={reason.shortDescription}
              color="red"
              className="p-4 text-lg font-bold text-negative"
              icon={<CloseIcon className="mt-1 size-5 fill-negative" />}
            />
            <p className="mt-3 gap-1">
              <strong>Consequence: </strong>
              {lowercaseFirstLetter(reason.description)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function lowercaseFirstLetter(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1)
}
