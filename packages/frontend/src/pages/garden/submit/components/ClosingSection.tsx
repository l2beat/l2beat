import { Button } from '~/components/core/Button'
import { CustomLink } from '~/components/link/CustomLink'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { externalLinks } from '~/consts/externalLinks'
import { CustomLinkIcon } from '~/icons/Outlink'
import { SproutIcon } from '../../components/SproutIcon'

export function ClosingSection() {
  return (
    <section className="mt-8 md:mt-12">
      <PrimaryCard className="relative overflow-hidden text-center md:p-10">
        <div
          aria-hidden
          className="-bottom-24 pointer-events-none absolute inset-x-0 mx-auto size-72 rounded-full bg-radial from-[#7fae6a]/25 to-transparent blur-2xl"
        />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center">
          <h2 className="text-balance font-bold text-heading-24 md:text-heading-32">
            Ready to plant?
          </h2>
          <p className="mt-3 text-pretty text-paragraph-15 text-secondary md:text-paragraph-16">
            Send us the details and we will take it from there. Questions, or a
            disagreement with a plant already growing, belong on the{' '}
            <CustomLink href={externalLinks.forum}>forum</CustomLink>.
          </p>
          <Button asChild variant="fill" className="mt-6 w-full gap-2 sm:w-max">
            <a
              href={externalLinks.gardenRequest}
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
