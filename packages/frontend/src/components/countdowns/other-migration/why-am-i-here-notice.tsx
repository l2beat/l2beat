'use client'
import { type ReasonForBeingInOther } from '@l2beat/config/build/src/common/ReasonForBeingInOther'
import { Callout } from '~/components/callout'
import { CustomLink } from '~/components/link/custom-link'
import { externalLinks } from '~/consts/external-links'
import { CloseIcon } from '~/icons/close'

export function WhyAmIHereNotice({
  reasons,
}: { reasons: ReasonForBeingInOther[] }) {
  return (
    <div className="border-brand p-4 max-md:border-x-0 max-md:bg-brand/25 max-md:dark:bg-brand/15 md:mt-10 md:rounded-lg md:border-2 md:p-8">
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
    </div>
  )
}

function lowercaseFirstLetter(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1)
}
