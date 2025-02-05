'use client'
import { PROJECT_COUNTDOWNS } from '@l2beat/config/build/src/common/projectCountdowns'
import { externalLinks } from '~/consts/external-links'
import { cn } from '~/utils/cn'
import { TextCountdown } from '../countdown'
import { CustomLink } from '../link/custom-link'
import { useRecategorisationPreviewContext } from './recategorisation-preview-provider'

export function RecategorisationPreviewBanner({
  className,
}: { className?: string }) {
  const { checked, isScalingMainPage } = useRecategorisationPreviewContext()
  if (!checked || !isScalingMainPage) {
    return null
  }

  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center gap-1 bg-brand px-4 py-1.5 text-primary-invert md:flex-row md:gap-3',
        className,
      )}
    >
      <div className="text-balance text-center text-sm">
        You&apos;re viewing a preview of the recategorisation that will come
        into force in{' '}
        <TextCountdown
          expiresAt={PROJECT_COUNTDOWNS.otherMigration.toNumber()}
        />
        .
      </div>
      <BannerActionButton />
    </div>
  )
}

function BannerActionButton() {
  return (
    <CustomLink
      href={externalLinks.articles.recategorisation}
      variant="plain"
      underline={false}
      className="text-white dark:text-white"
    >
      <div className="flex items-center justify-center gap-1 rounded-lg border border-[#9360BC] bg-[#53227A] px-5 py-1 transition-colors duration-200 hover:bg-[#53227A]/80">
        <span className="text-center text-xs font-medium">Learn more</span>
      </div>
    </CustomLink>
  )
}
