'use client'
import type { ReasonForBeingInOther } from '@l2beat/config'
import { Callout } from '~/components/callout'
import { CustomLink } from '~/components/link/custom-link'
import { externalLinks } from '~/consts/external-links'
import { CloseIcon } from '~/icons/close'
import { CountdownSection } from '../countdown-section'

export function WhyAmIHereNotice({
  reasons,
}: { reasons: ReasonForBeingInOther[] }) {
  return (
    <CountdownSection>
      <h2 className="mr-auto text-2xl font-bold md:text-3xl">
        Why is the project listed in others?
      </h2>
      <div className="mt-6 space-y-6">
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
      <p className="mt-2.5 text-base font-bold">
        Learn more about the recategorisation{' '}
        <CustomLink href={externalLinks.articles.recategorisation}>
          here
        </CustomLink>
        .
      </p>
    </CountdownSection>
  )
}

function lowercaseFirstLetter(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1)
}
