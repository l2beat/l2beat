import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { FullPageHeader } from '~/components/FullPageHeader'
import { ArchivedBar } from '~/components/projects/ArchivedBar'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { DiscoUiLink } from '~/components/projects/links/DiscoUiLink'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { UnderReviewBar } from '~/components/projects/UnderReviewBar'
import { UpcomingBar } from '~/components/projects/UpcomingBar'
import { WarningBar } from '~/components/WarningBar'
import type { BridgesProjectEntry } from '~/server/features/bridges/project/getBridgesProjectEntry'
import { getUnderReviewText } from '~/utils/project/underReview'
import { BridgesProjectStats } from './BridgesProjectStats'

interface Props {
  project: BridgesProjectEntry
}

export function BridgesProjectSummary({ project }: Props) {
  return (
    <FullPageHeader className="pt-8 pb-0 md:pt-12 md:pb-8">
      <section
        id="summary"
        data-role="project-section"
        className="w-full max-md:bg-header-primary"
      >
        <div className="w-full space-y-4 md:space-y-6">
          <ProjectHeader project={project} />
          <div className="space-y-2">
            {project.archivedAt && <ArchivedBar />}
            {project.isUpcoming && <UpcomingBar />}
            {project.underReviewStatus && (
              <UnderReviewBar
                text={getUnderReviewText(project.underReviewStatus)}
              />
            )}
            {project.header.warning && (
              <WarningBar
                text={project.header.warning}
                color="yellow"
                className="w-full items-center justify-center p-2.5 text-xs md:text-base"
              />
            )}
          </div>
          {project.header.description && (
            <div className="md:hidden">
              <AboutSection description={project.header.description} />
            </div>
          )}
          <HorizontalSeparator className="max-md:-mx-4 my-4 max-md:w-screen md:my-6! md:hidden" />

          <div className="max-md:hidden">
            <DesktopProjectLinks
              projectLinks={project.header.links}
              variant="header"
              discoUiHref={project.discoUiHref}
            />
          </div>
          <BridgesProjectStats project={project} />
        </div>

        <div className="md:hidden">
          <HorizontalSeparator className="max-md:-mx-4 mt-4 mb-2 max-md:w-screen md:hidden" />
          <div className="flex items-center justify-between">
            <a
              className="text-link text-xs underline"
              href={project.discoUiHref}
            >
              Explore more in Discovery UI
            </a>
            <DiscoUiLink href={project.discoUiHref} />
          </div>
        </div>

        <HorizontalSeparator className="max-md:-mx-4 mt-2 max-md:w-screen md:my-6" />
        <div className="md:hidden">
          <MobileProjectLinks projectLinks={project.header.links} />
        </div>
        <div className="mt-6 flex flex-col gap-4 px-4 max-md:mt-2 max-md:hidden md:px-0 lg:flex-row lg:gap-8">
          {project.header.description && (
            <AboutSection description={project.header.description} />
          )}
        </div>
      </section>
    </FullPageHeader>
  )
}
