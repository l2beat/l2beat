import { FullPageHeader } from '~/components/FullPageHeader'
import { WarningBar } from '~/components/WarningBar'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { ArchivedBar } from '~/components/projects/ArchivedBar'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { UnderReviewBar } from '~/components/projects/UnderReviewBar'
import { UpcomingBar } from '~/components/projects/UpcomingBar'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { DiscoUiLink } from '~/components/projects/links/DiscoUiLink'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { BadgesSection } from '~/components/projects/sections/BadgesSection'
import { EmergencyIcon } from '~/icons/Emergency'
import type { ProjectScalingEntry } from '~/server/features/scaling/project/getScalingProjectEntry'
import { getUnderReviewText } from '~/utils/project/underReview'
import { ProjectScalingRosette } from './ScalingProjectRosette'
import { ProjectScalingStats } from './ScalingProjectStats'
import { ValueSecuredSummary } from './ValueSecuredSummary'

interface Props {
  project: ProjectScalingEntry
}

export function ProjectScalingSummary({ project }: Props) {
  return (
    <FullPageHeader className="pt-8 pb-0 md:pt-12 md:pb-8">
      <section
        id="summary"
        data-role="project-section"
        className="w-full max-md:bg-header-primary"
      >
        <div className="flex justify-between gap-4">
          <div className="w-full space-y-4 md:space-y-6">
            <ProjectHeader
              project={project}
              ongoingAnomaly={project.header.ongoingAnomaly}
            />
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
              {project.header.redWarning && (
                <WarningBar
                  text={project.header.redWarning}
                  color="red"
                  className="w-full items-center justify-center p-2.5 text-xs md:text-base"
                />
              )}
              {project.header.emergencyWarning && (
                <WarningBar
                  text={project.header.emergencyWarning}
                  icon={EmergencyIcon}
                  color="yellow"
                  className="w-full items-center justify-center p-2.5 text-xs md:text-base"
                />
              )}
            </div>
            {project.header.description || project.header.badges ? (
              <div className="mt-6 flex flex-col gap-4 md:hidden">
                {project.header.badges && project.header.badges.length > 0 && (
                  <BadgesSection badges={project.header.badges} />
                )}
                {project.header.description && (
                  <AboutSection description={project.header.description} />
                )}
              </div>
            ) : null}
            <HorizontalSeparator className="max-md:-mx-4 md:!my-6 my-4 max-md:w-screen md:hidden" />

            <div className="max-md:hidden">
              <DesktopProjectLinks
                projectLinks={project.header.links}
                variant="header"
                discoUiHref={project.discoUiHref}
              />
            </div>
            <div className="grid w-full md:gap-3 xl:grid-cols-3 [@media(min-width:1000px)]:grid-cols-[260px_1fr_1fr] [@media(min-width:1300px)]:grid-cols-[300px_1fr_1fr]">
              <ValueSecuredSummary
                tvs={project.header.tvs}
                detailedBreakdownHref={`/scaling/projects/${project.slug}/tvs-breakdown`}
                archivedAt={project.archivedAt}
              />
              <HorizontalSeparator className="max-md:-mx-4 md:!my-6 my-4 max-md:w-screen md:hidden" />
              <ProjectScalingStats
                project={project}
                className="md:order-first md:col-span-2 [@media(min-width:1000px)]:order-none"
              />
            </div>
          </div>
          <ProjectScalingRosette project={project} />
        </div>

        {project.discoUiHref && (
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
        )}

        <HorizontalSeparator className="max-md:-mx-4 mt-2 max-md:w-screen md:my-6" />
        <div className="md:hidden">
          <MobileProjectLinks projectLinks={project.header.links} />
        </div>
        <div className="max-md:hidden">
          <div className="mt-6 flex flex-col gap-4 px-4 max-md:mt-2 md:px-0 lg:flex-row lg:gap-8">
            {project.header.badges && project.header.badges.length > 0 && (
              <BadgesSection badges={project.header.badges} />
            )}
            {project.header.description && (
              <AboutSection description={project.header.description} />
            )}
          </div>
        </div>
      </section>
    </FullPageHeader>
  )
}
