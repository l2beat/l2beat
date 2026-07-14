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
      {/* Brand gradient wash */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-purple-100/10 via-transparent to-pink-100/10" />
      <div
        aria-hidden
        className="-top-24 -right-24 pointer-events-none absolute size-72 rounded-full bg-radial from-pink-100/25 to-transparent blur-2xl"
      />
      <div className="relative flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-2xl flex-col gap-6">
          <span className="w-max font-medium text-purple-100 text-xs uppercase tracking-[0.14px] dark:text-pink-200">
            What are native rollups?
          </span>
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
          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              variant="fill"
              className="gap-2 border border-transparent"
            >
              <a
                href={NATIVE_ROLLUPS_BOOK_URL}
                target="_blank"
                rel="noreferrer noopener"
              >
                Explore the Book
                <CustomLinkIcon className="fill-current" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="gap-2 border-divider bg-surface-secondary text-primary hover:bg-surface-secondary/60"
            >
              <a
                href={NATIVE_PROOF_VERIFICATION_URL}
                target="_blank"
                rel="noreferrer noopener"
              >
                Explore the research
                <CustomLinkIcon className="fill-current" />
              </a>
            </Button>
          </div>
        </div>
        <NativeRollupsHeroIllustration className="h-auto w-full max-w-[420px] shrink-0 self-center" />
      </div>
    </PrimaryCard>
  )
}
