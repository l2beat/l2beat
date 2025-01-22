'use client'
import { PROJECT_COUNTDOWNS } from '@l2beat/config/build/src/common/projectCountdowns'
import { externalLinks } from '~/consts/external-links'
import { useIsClient } from '~/hooks/use-is-client'
import { cn } from '~/utils/cn'
import { TextCountdown } from '../countdown'
import { CustomLink } from '../link/custom-link'
import { useRecategorisationPreviewContext } from './recategorisation-preview-provider'

export function RecategorisationPreviewBanner({
  className,
}: { className?: string }) {
  const isClient = useIsClient()

  const { checked } = useRecategorisationPreviewContext()

  if (!isClient || !checked) {
    return null
  }

  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center gap-1 bg-brand px-4 py-1.5 text-white md:flex-row md:gap-3',
        className,
      )}
    >
      <div className="text-balance text-center text-sm">
        You&apos;re viewing preview of recategorisation that will come into
        force in{' '}
        <TextCountdown
          expiresAt={PROJECT_COUNTDOWNS.otherMigration.expiresAt.toNumber()}
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
