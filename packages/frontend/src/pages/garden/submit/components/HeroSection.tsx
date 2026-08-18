import { Button } from '~/components/core/Button'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { externalLinks } from '~/consts/externalLinks'
import { CustomLinkIcon } from '~/icons/Outlink'
import { SproutIcon } from '../../components/SproutIcon'
import { GARDEN_PATH } from '../links'

export function HeroSection() {
  return (
    <PrimaryCard className="relative overflow-hidden md:p-8">
      <div
        aria-hidden
        className="-top-28 -right-20 pointer-events-none absolute size-72 rounded-full bg-radial from-[#7fae6a]/25 to-transparent blur-2xl"
      />
      <div className="relative max-w-2xl">
        <h2 className="text-balance font-bold text-heading-28 md:text-heading-40">
          Get your protocol into the garden
        </h2>
        <p className="mt-4 text-pretty text-paragraph-15 text-secondary md:text-paragraph-18">
          The garden is for protocols that keep the properties Ethereum was
          built for:{' '}
          <strong className="text-primary">anyone can use them</strong>,{' '}
          <strong className="text-primary">anyone can read and run them</strong>
          ,{' '}
          <strong className="text-primary">privacy survives using them</strong>,
          and{' '}
          <strong className="text-primary">
            funds do not depend on anyone behaving well
          </strong>
          . Send yours in and we will review it.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Button asChild variant="fill" className="w-full gap-2 sm:w-max">
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
          <a
            href={GARDEN_PATH}
            className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-divider px-6 py-2 font-bold text-primary sm:w-max lg:rounded-none lg:border-0 lg:p-0 lg:font-medium lg:text-label-value-15 lg:text-link"
          >
            Walk the garden first
          </a>
        </div>
      </div>
    </PrimaryCard>
  )
}
