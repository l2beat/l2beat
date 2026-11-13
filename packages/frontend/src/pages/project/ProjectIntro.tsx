import type { ComponentProps, ReactNode } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import type { ProjectLink } from '~/components/projects/links/types'
import { ProjectSummaryBars } from '~/components/projects/ProjectSummaryBars'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import type { ProjectVersionLinks } from '~/server/features/projects/getProjectVersionLinks'

interface Props {
  /** Archived, under review and warning bars. */
  status: ComponentProps<typeof ProjectSummaryBars>['project']
  versions?: ProjectVersionLinks
  /**
   * A `MobileBadgesSection`, made by the page. Importing `BadgesSection`
   * here would give this component a chunk of its own on every project page,
   * as the monthly updates load that one too (see `smallSharedChunks.mts`).
   */
  badges?: ReactNode
  description?: string
  links: ProjectLink[]
  discoUiHref?: string
}

/**
 * What most project pages show under the title. Badges and the description
 * are here for phones only: from md up the summary card has them.
 */
export function ProjectIntro({
  status,
  versions,
  badges,
  description,
  links,
  discoUiHref,
}: Props) {
  return (
    <>
      <ProjectSummaryBars project={status} versions={versions} />
      {badges}
      {description && (
        <AboutSection description={description} className="md:hidden" />
      )}
      <HorizontalSeparator className="my-4 md:hidden" />
      <div className="mb-3 max-md:hidden">
        <DesktopProjectLinks projectLinks={links} discoUiHref={discoUiHref} />
      </div>
    </>
  )
}
