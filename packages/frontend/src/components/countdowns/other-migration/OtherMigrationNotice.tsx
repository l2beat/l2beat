import { Callout } from '~/components/Callout'
import { Countdown } from '~/components/Countdown'
import { CustomLink } from '~/components/link/CustomLink'
import { externalLinks } from '~/consts/externalLinks'
import { useIsMobile } from '~/hooks/useIsMobile'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { CloseIcon } from '~/icons/Close'
import type { ProjectCountdownsWithContext } from '~/server/features/scaling/utils/getCountdowns'
import { CountdownSection } from '../CountdownSection'

type Props = NonNullable<ProjectCountdownsWithContext['otherMigration']>

export function OtherMigrationNotice({ expiresAt, reasons }: Props) {
  const isMobile = useIsMobile()
  return (
    <CountdownSection>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <h2 className="mr-auto font-bold text-2xl md:text-3xl">
          Recategorisation
        </h2>
        <Countdown expiresAt={expiresAt} size={isMobile ? 'sm' : 'md'} />
      </div>
      <p className="mt-4 font-medium text-base">
        The project will be classified as &quot;Other&quot; due to its specific
        risks that set it apart from the standard classifications.
      </p>
      <p className="mt-6 mb-4 font-bold text-lg">
        The project will move to Others because:
      </p>
      <div className="space-y-6">
        {reasons.map((reason) => (
          <div key={reason.label}>
            <Callout
              body={reason.shortDescription}
              color="red"
              className="px-3 py-2 font-bold text-primary text-xs md:p-4 md:text-lg"
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
      <CustomLink
        href={externalLinks.articles.recategorisation}
        className="mt-2.5 flex items-center gap-1 font-bold text-base"
      >
        Learn more about the recategorisation <ArrowRightIcon />
      </CustomLink>
    </CountdownSection>
  )
}

function lowercaseFirstLetter(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1)
}
