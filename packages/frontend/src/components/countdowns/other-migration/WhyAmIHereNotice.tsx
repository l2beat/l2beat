import type { ReasonForBeingInOther } from '@l2beat/config'
import lowerFirst from 'lodash/lowerFirst'
import { Callout } from '~/components/Callout'
import { CustomLink } from '~/components/link/CustomLink'
import { WHY_LISTED_IN_OTHERS_HEADING } from '~/components/projects/sections/sectionCopy'
import { externalLinks } from '~/consts/externalLinks'
import { CloseIcon } from '~/icons/Close'
import { CountdownSection } from '../CountdownSection'

export function WhyAmIHereNotice({
  reasons,
}: {
  reasons: ReasonForBeingInOther[]
}) {
  return (
    <CountdownSection>
      <h2 className="mr-auto text-heading-24">
        {WHY_LISTED_IN_OTHERS_HEADING}
      </h2>
      <div className="mt-6 space-y-6">
        {reasons.map((reason) => (
          <div key={reason.label}>
            <Callout
              body={reason.shortDescription}
              color="red"
              className="px-3 py-2 font-bold text-paragraph-15 text-primary md:p-4 md:text-paragraph-16"
              icon={
                <CloseIcon className="mt-[3px] size-[15px] fill-negative md:mt-1 md:size-3.5" />
              }
            />
            {reason.explanation && (
              <p className="mt-3 text-paragraph-15 md:text-paragraph-16">
                {reason.explanation}
              </p>
            )}
            <p className="mt-3 gap-1 text-paragraph-15 md:text-paragraph-16">
              <strong>Consequence: </strong>
              {lowerFirst(reason.description)}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-2.5 font-bold text-paragraph-13 md:text-paragraph-14">
        Learn more about the recategorisation{' '}
        <CustomLink href={externalLinks.articles.recategorisation}>
          here
        </CustomLink>
        .
      </p>
    </CountdownSection>
  )
}
