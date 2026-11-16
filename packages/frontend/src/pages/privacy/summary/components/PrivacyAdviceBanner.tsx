import { CustomLink } from '~/components/link/CustomLink'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import {
  PRIVACY_ADVICE_HREF,
  PRIVACY_ADVICE_TITLE,
} from '~/pages/privacy/methodology/paths'
import { cn } from '~/utils/cn'

/**
 * A flat inverted block, like the question card on home and the mandate's
 * closing block: ink in light mode, a step up from the page in dark.
 */
export function PrivacyAdviceBanner({ className }: { className?: string }) {
  return (
    <div className={cn('home-theme mt-4', className)}>
      <PrimaryCard asChild className="home-inverted text-primary">
        <CustomLink
          variant="plain"
          underline={false}
          href={PRIVACY_ADVICE_HREF}
          className="group flex items-center justify-between gap-4"
        >
          <span className="flex flex-col gap-1">
            <span className="font-medium text-2xs text-secondary uppercase">
              Ready for a new identity?
            </span>
            <span className="font-semibold text-heading-20 underline-offset-4 group-hover:underline md:text-heading-24">
              {PRIVACY_ADVICE_TITLE}
            </span>
          </span>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-secondary transition-colors group-hover:bg-divider">
            <ArrowRightIcon className="size-4 fill-current" />
          </span>
        </CustomLink>
      </PrimaryCard>
    </div>
  )
}
