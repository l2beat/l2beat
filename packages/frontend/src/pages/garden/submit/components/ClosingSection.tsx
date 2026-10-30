import { Button } from '~/components/core/Button'
import { CustomLink } from '~/components/link/CustomLink'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { externalLinks } from '~/consts/externalLinks'
import { CustomLinkIcon } from '~/icons/Outlink'
import { SproutIcon } from '../../components/SproutIcon'
import { SUBMISSION_QUESTIONS_PATH } from '../../paths'

export function ClosingSection() {
  return (
    <section className="mt-4 md:mt-6">
      {/* The garden callout tone: a flat tint over the solid card. */}
      <PrimaryCard className="relative overflow-hidden border border-garden-border max-md:mx-4 max-md:rounded-xl md:p-8">
        <span aria-hidden className="absolute inset-0 bg-garden-tint" />
        <div className="relative max-w-2xl">
          <h2 className="text-balance font-bold text-heading-18 md:text-heading-20">
            Ready to submit?
          </h2>
          <p className="mt-2 text-pretty text-paragraph-14 text-secondary md:text-paragraph-15">
            Send us the details and we will take it from there. Questions, or
            comments on the assessments, belong on the{' '}
            <CustomLink href={externalLinks.forum}>forum</CustomLink>.
          </p>
          <Button asChild variant="fill" className="mt-5 w-full gap-2 sm:w-max">
            <a
              href={SUBMISSION_QUESTIONS_PATH}
              target="_blank"
              rel="noreferrer noopener"
            >
              <SproutIcon />
              Submit your protocol
              <CustomLinkIcon className="fill-current" />
            </a>
          </Button>
        </div>
      </PrimaryCard>
    </section>
  )
}
