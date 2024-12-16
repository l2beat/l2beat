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
    <div className="border-brand p-4 max-md:border-x-0 max-md:bg-brand/25 max-md:dark:bg-brand/15 md:mt-10 md:rounded-lg md:border-2 md:p-8">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <h2 className="mr-auto text-2xl font-bold md:text-3xl">
          Recategorisation
        </h2>
        <Countdown expiresAt={expiresAt} size={isMobile ? 'sm' : 'md'} />
      </div>
      <p className="mt-4 text-base font-medium">
        The project will be classifed as &quot;Other&quot; due to its specific
        risks that set it apart from the standard classifications.
      </p>
      <p className="mb-4 mt-6 text-lg font-bold">
        The project will move to Others because:
      </p>
      <div className="space-y-6">
        {reasons.map((reason) => (
          <div key={reason.label}>
            <Callout
              body={reason.shortDescription}
              color="red"
              className="px-3 py-2 text-xs font-bold text-primary md:p-4 md:text-lg"
              icon={
                <CloseIcon className="mt-[3px] size-3.5 fill-negative md:mt-1 md:size-5" />
              }
            />
            <p className="mt-3 gap-1 max-md:text-xs">
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
