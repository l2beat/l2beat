import { Button } from '~/components/core/Button'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CustomLinkIcon } from '~/icons/Outlink'
import { SproutIcon } from '../../components/SproutIcon'
import { GARDEN_PATH, SUBMISSION_QUESTIONS_PATH } from '../../paths'

export function HeroSection() {
  return (
    <PrimaryCard className="mt-4 max-md:mx-4 max-md:rounded-xl md:p-8">
      <div className="max-w-2xl">
        <h2 className="text-balance font-bold text-heading-20 md:text-heading-24">
          Get your protocol reviewed
        </h2>
        <p className="mt-3 text-pretty text-paragraph-15 text-secondary md:text-paragraph-16">
          We review protocols against the properties Ethereum was built for:{' '}
          <strong className="font-medium text-primary">
            anyone can use them
          </strong>
          ,{' '}
          <strong className="font-medium text-primary">
            anyone can read and run them
          </strong>
          ,{' '}
          <strong className="font-medium text-primary">
            privacy survives using them
          </strong>
          , and{' '}
          <strong className="font-medium text-primary">
            funds do not depend on anyone behaving well
          </strong>
          . Send yours in and we will review it.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Button asChild variant="fill" className="w-full gap-2 sm:w-max">
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
          {/* A 1 px border around 38 px matches the 40 px fill button. */}
          <a
            href={GARDEN_PATH}
            className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-divider px-6 py-[7px] font-bold text-base text-primary sm:w-max lg:rounded-none lg:border-0 lg:p-0 lg:font-medium lg:text-label-value-15 lg:text-link lg:hover:text-blue-550 lg:hover:underline"
          >
            See reviewed protocols
          </a>
        </div>
      </div>
    </PrimaryCard>
  )
}
