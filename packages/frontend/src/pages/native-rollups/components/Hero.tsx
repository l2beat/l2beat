import { Button } from '~/components/core/Button'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CustomLinkIcon } from '~/icons/Outlink'
import { NativeRollupsHeroIllustration } from '../assets/NativeRollupsHero'
import {
  NATIVE_PROOF_VERIFICATION_URL,
  NATIVE_ROLLUPS_BOOK_URL,
} from '../consts'

export function Hero() {
  return (
    <PrimaryCard className="relative overflow-hidden md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-purple-100/10 via-transparent to-pink-100/10" />
      <div
        aria-hidden
        className="-top-24 -right-24 pointer-events-none absolute size-72 rounded-full bg-radial from-pink-100/25 to-transparent blur-2xl"
      />
      <div className="relative flex w-full items-center justify-between gap-8">
        <div className="flex max-w-2xl flex-col gap-6">
          <h2 className="text-balance font-bold text-heading-32 md:text-heading-40">
            Rollups verified by Ethereum itself
          </h2>
          <p className="text-pretty text-paragraph-16 text-secondary md:text-paragraph-18">
            Native rollups turn L2 blocks into{' '}
            <strong className="text-primary">
              proof-carrying transactions
            </strong>{' '}
            on L1. Ethereum verifies that every block follows its own EVM rules,
            while the rollup stays free to customize sequencing, messaging, and
            chain policy. Native rollups are an active research effort, not yet
            part of any scheduled Ethereum upgrade.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button asChild variant="fill" className="gap-2">
              <a
                href={NATIVE_ROLLUPS_BOOK_URL}
                target="_blank"
                rel="noreferrer noopener"
              >
                Read the Book
                <CustomLinkIcon className="fill-current" />
              </a>
            </Button>
            <a
              href={NATIVE_PROOF_VERIFICATION_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 font-medium text-label-value-15 text-link transition-colors hover:text-purple-100 dark:hover:text-pink-200"
            >
              Read the research proposal
              <CustomLinkIcon className="size-3.5 fill-current" />
            </a>
          </div>
        </div>
        <NativeRollupsHeroIllustration className="hidden h-auto w-[420px] shrink-0 lg:block" />
      </div>
    </PrimaryCard>
  )
}
