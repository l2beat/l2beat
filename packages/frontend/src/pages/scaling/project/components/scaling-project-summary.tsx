import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { FullPageHeader } from '~/components/full-page-header'
import { ArchivedBar } from '~/components/projects/archived-bar'
import { DesktopProjectLinks } from '~/components/projects/links/desktop-project-links'
import { DiscoUiLink } from '~/components/projects/links/disco-ui-link'
import { MobileProjectLinks } from '~/components/projects/links/mobile-project-links'
import { ProjectHeader } from '~/components/projects/project-header'
import { AboutSection } from '~/components/projects/sections/about-section'
import { BadgesSection } from '~/components/projects/sections/badges-section'
import { UnderReviewBar } from '~/components/projects/under-review-bar'
import { UpcomingBar } from '~/components/projects/upcoming-bar'
import { WarningBar } from '~/components/warning-bar'
import { EmergencyIcon } from '~/icons/emergency'
import type { ProjectScalingEntry } from '~/server/features/scaling/project/get-scaling-project-entry'
import { getUnderReviewText } from '~/utils/project/under-review'
import { ProjectScalingRosette } from './scaling-project-rosette'
import { ProjectScalingStats } from './scaling-project-stats'
import { ValueSecuredSummary } from './value-secured-summary'

interface Props {
  project: ProjectScalingEntry
}

export function ProjectScalingSummary({ project }: Props) {
  return (
    <FullPageHeader className="pt-8 pb-0 md:pt-12 md:pb-8">
      <section id="summary" className="w-full max-md:bg-header-primary">
        <div className="flex justify-between gap-4">
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

        <div className="md:hidden">
          <HorizontalSeparator className="max-md:-mx-4 mt-4 mb-2 max-md:w-screen md:hidden" />
          <div className="flex items-center justify-between">
            <a
              className="text-link text-xs underline"
              href={project.discoUiHref}
            >
              Explore more in Discovery UI
            </a>
            {project.discoUiHref && <DiscoUiLink href={project.discoUiHref} />}
          </div>
        </div>

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
