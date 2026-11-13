import { Button } from '~/components/core/Button'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CustomLinkIcon } from '~/icons/Outlink'
import { SproutIcon } from '../../components/SproutIcon'
import { GARDEN_PATH, SUBMISSION_FORUM_POST_URL } from '../../paths'

export function HeroSection() {
  return (
    <PrimaryCard className="mt-4 max-md:mx-4 max-md:rounded-xl">
      <div>
        <h2 className="text-balance font-bold text-heading-18 md:text-heading-20">
          Get your protocol reviewed
        </h2>
        <p className="mt-2 text-pretty text-paragraph-14 text-secondary md:text-paragraph-15">
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
              href={SUBMISSION_FORUM_POST_URL}
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
            className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-divider px-6 py-[7px] font-bold text-base text-primary hover:bg-surface-secondary sm:w-max"
          >
            See reviewed protocols
          </a>
        </div>
      </div>
    </PrimaryCard>
  )
}
