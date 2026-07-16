import { Button } from '~/components/core/Button'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CustomLinkIcon } from '~/icons/Outlink'
import { NativeRollupsHeroIllustration } from '../assets/NativeRollupsHero'
import {
  NATIVE_PROOF_VERIFICATION_URL,
  NATIVE_ROLLUPS_BOOK_URL,
} from '../links'

export function Hero() {
  return (
    <PrimaryCard className="relative overflow-hidden md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-purple-100/10 via-transparent to-pink-100/10" />
      <div
        aria-hidden
        className="-top-24 -right-24 pointer-events-none absolute size-72 rounded-full bg-radial from-pink-100/25 to-transparent blur-2xl"
      />
      <div className="relative grid w-full items-center gap-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-x-8 lg:gap-y-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 text-center lg:mx-0 lg:items-start lg:text-left">
          <h2 className="text-balance font-bold text-heading-32 md:text-heading-40">
            The easiest and most secure way to deploy your own EVM chain.
          </h2>
          <p className="text-pretty text-paragraph-16 text-secondary md:text-paragraph-18">
            Native rollups turn L2 blocks into{' '}
            <strong className="text-primary">
              proof-carrying transactions
            </strong>{' '}
            on L1. Ethereum verifies that every block follows its own EVM rules,
            while the rollup stays free to customize sequencing, messaging, and
            chain policy.
          </p>
        </div>
        <NativeRollupsHeroIllustration className="mx-auto h-auto w-full max-w-[380px] sm:max-w-[400px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:w-[420px] lg:max-w-none" />
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-x-6 lg:col-start-1 lg:row-start-2 lg:mx-0 lg:max-w-none lg:justify-start">
          <Button asChild variant="fill" className="w-full gap-2 sm:w-max">
            <a
              href={NATIVE_ROLLUPS_BOOK_URL}
              target="_blank"
              rel="noreferrer noopener"
            >
              Explore the Book
              <CustomLinkIcon className="fill-current" />
            </a>
          </Button>
          <a
            href={NATIVE_PROOF_VERIFICATION_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-divider px-6 py-2 font-bold text-primary transition-colors sm:w-max lg:rounded-none lg:border-0 lg:p-0 lg:font-medium lg:text-label-value-15 lg:text-link lg:hover:text-(--accent)"
          >
            Explore the research
            <CustomLinkIcon className="size-3.5 fill-current" />
          </a>
        </div>
      </div>
    </PrimaryCard>
  )
}
