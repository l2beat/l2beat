import { Button } from '~/components/core/Button'
import { CustomLink } from '~/components/link/CustomLink'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CustomLinkIcon } from '~/icons/Outlink'
import { NativeRollupsHeroIllustration } from '../assets/NativeRollupsHero'
import { NATIVE_ROLLUPS_BOOK_URL, NATIVE_ROLLUPS_EIP_URL } from '../consts'

export function Hero() {
  return (
    <PrimaryCard className="relative overflow-hidden md:p-8">
      {/* Brand gradient wash */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-purple-100/10 via-transparent to-pink-100/10" />
      <div
        aria-hidden
        className="-top-24 -right-24 pointer-events-none absolute size-72 rounded-full bg-radial from-pink-100/25 to-transparent blur-2xl"
      />
      <div className="relative flex w-full items-center justify-between gap-8">
        <div className="flex max-w-2xl flex-col gap-6">
          <span className="w-max font-medium text-purple-100 text-xs uppercase tracking-[0.14px] dark:text-pink-200">
            What is native rollups?
          </span>
          <h2 className="text-balance font-bold text-heading-32 md:text-heading-40">
            The easiest and most secure way to deploy your own EVM chain.
          </h2>
          <p className="text-pretty text-paragraph-16 text-secondary md:text-paragraph-18">
            A native rollup swaps its custom state transition function for the{' '}
            <strong className="text-primary">EXECUTE</strong> precompile — a
            recursive call into Ethereum&apos;s own execution environment. The
            result is a rollup that is EVM-equivalent by construction, upgrades
            in lockstep with L1, and needs no dedicated proof system to trust.
          </p>
          <div className="flex flex-wrap items-center gap-3">
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
            <CustomLink
              href={NATIVE_ROLLUPS_EIP_URL}
              underline={false}
              className="flex items-center gap-1.5 rounded-lg border border-divider bg-surface-secondary px-4 py-2.5 font-semibold text-primary text-sm hover:bg-surface-secondary/60"
            >
              Read EIP-8079
              <CustomLinkIcon className="fill-current" />
            </CustomLink>
          </div>
        </div>
        <NativeRollupsHeroIllustration className="hidden h-auto w-[420px] shrink-0 lg:block" />
      </div>
    </PrimaryCard>
  )
}
