import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { ArchivedBar } from '~/app/_components/projects/archived-bar'
import { DesktopProjectLinks } from '~/app/_components/projects/links/desktop-project-links'
import { MobileProjectLinks } from '~/app/_components/projects/links/mobile-project-links'
import { ProjectHeader } from '~/app/_components/projects/project-header'
import { AboutSection } from '~/app/_components/projects/sections/about-section'
import { UnderReviewBar } from '~/app/_components/projects/under-review-bar'
import { UpcomingBar } from '~/app/_components/projects/upcoming-bar'
import { WarningBar } from '~/app/_components/warning-bar'
import { type BridgesProjectEntry } from '~/server/features/bridges/project/get-bridges-project-entry'
import { getUnderReviewText } from '~/utils/project/get-under-review-text'
import { BridgesProjectStats } from './bridges-project-stats'

interface Props {
  project: BridgesProjectEntry
}

export function BridgesProjectSummary({ project }: Props) {
  return (
    <section
      id="summary"
      className="pt-6 max-md:-mx-4 max-md:bg-gray-100 max-md:px-4 max-md:dark:bg-zinc-900"
    >
      <div className="w-full space-y-4 md:space-y-6">
        <div className="flex flex-col gap-2">
          <ProjectHeader title={project.name} slug={project.slug} />
          {project.isArchived && <ArchivedBar />}
          {project.isUpcoming && <UpcomingBar />}
          {(project.isUnderReview || project.isImplementationUnderReview) && (
            <UnderReviewBar
              text={getUnderReviewText(
                project.isUnderReview,
                project.isImplementationUnderReview,
              )}
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
        <HorizontalSeparator className="my-4 max-md:-mx-4 max-md:w-screen md:!my-6 md:hidden" />

        <div className="max-md:hidden">
          <DesktopProjectLinks projectLinks={project.header.links} />
        </div>
        <BridgesProjectStats project={project} />
      </div>

      <HorizontalSeparator className="mt-6 max-md:-mx-4 max-md:w-screen md:mb-6" />
      <div className="md:hidden">
        <MobileProjectLinks projectLinks={project.header.links} />
      </div>
      <div className="max-md:hidden">
        <div className="mt-6 flex flex-col gap-4 px-4 max-md:-mx-4 max-md:mt-2 max-md:px-4 md:px-0 lg:flex-row lg:gap-8">
          {project.header.description && (
            <AboutSection description={project.header.description} />
          )}
        </div>
        <HorizontalSeparator className="my-6" />
      </div>
    </section>
  )
}
