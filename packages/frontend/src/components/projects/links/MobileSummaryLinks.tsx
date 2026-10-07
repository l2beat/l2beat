import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { DiscoUiLink } from './DiscoUiLink'
import { MobileProjectLinks } from './MobileProjectLinks'
import type { ProjectLink } from './types'

/**
 * The mobile counterpart of `DesktopProjectLinks`, closing a project's summary
 * card. Separators are full-bleed to match the card's edge-to-edge mobile layout.
 */
export function MobileSummaryLinks({
  projectLinks,
  discoUiHref,
}: {
  projectLinks: ProjectLink[]
  discoUiHref: string | undefined
}) {
  return (
    <div className="md:hidden">
      {discoUiHref && (
        <>
          <div className="flex items-center justify-between">
            <a className="text-link text-xs underline" href={discoUiHref}>
              Explore more in Discovery UI
            </a>
            <DiscoUiLink href={discoUiHref} />
          </div>
          <HorizontalSeparator className="-mx-4 mt-2 w-[calc(100%+2rem)]" />
        </>
      )}
      <MobileProjectLinks projectLinks={projectLinks} />
    </div>
  )
}
