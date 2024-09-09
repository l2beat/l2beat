import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { ArchivedBar } from '~/components/projects/archived-bar'
import { DesktopProjectLinks } from '~/components/projects/links/desktop-project-links'
import { MobileProjectLinks } from '~/components/projects/links/mobile-project-links'
import { ProjectHeader } from '~/components/projects/project-header'
import { AboutSection } from '~/components/projects/sections/about-section'
import { BadgesSection } from '~/components/projects/sections/badges-section'
import { UnderReviewBar } from '~/components/projects/under-review-bar'
import { UpcomingBar } from '~/components/projects/upcoming-bar'
import { BigPizzaRosette } from '~/components/rosette/pizza/big-pizza-rosette'
import { WarningBar } from '~/components/warning-bar'
import { type ScalingProjectEntry } from '~/server/features/scaling/project/get-scaling-project-entry'
import { getUnderReviewText } from '~/utils/project/get-under-review-text'
import { ScalingProjectStats } from './scaling-project-stats'
import { ValueLockedSummary } from './value-locked-summary'

interface Props {
  project: ScalingProjectEntry
}

export function ScalingProjectSummary({ project }: Props) {
  return (
    <section
      id="summary"
      className="pt-6 max-md:bg-gray-100 max-md:px-4 max-md:dark:bg-zinc-900"
    >
      <div className="flex gap-10">
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
                text={
                  typeof project.header.warning === 'string'
                    ? project.header.warning
                    : project.header.warning.text
                }
                href={
                  typeof project.header.warning !== 'string'
                    ? project.header.warning.href
                    : undefined
                }
                color="yellow"
                className="w-full items-center justify-center p-2.5 text-xs md:text-base"
              />
            )}
          </div>
          {project.header.description || project.header.badges ? (
            <div className="mt-6 flex flex-col gap-4 md:hidden">
              {project.header.badges && (
                <BadgesSection badges={project.header.badges} />
              )}
              {project.header.description && (
                <AboutSection description={project.header.description} />
              )}
            </div>
          ) : null}
          <HorizontalSeparator className="my-4 max-md:-mx-4 max-md:w-screen md:!my-6 md:hidden" />

          <div className="max-md:hidden">
            <DesktopProjectLinks projectLinks={project.header.links} />
          </div>
          <div className="grid w-full md:grid-cols-3 md:gap-4">
            <ValueLockedSummary
              breakdown={project.header.tvl?.tvlBreakdown}
              detailedBreakdownHref={`/scaling/projects/${project.slug}/tvl-breakdown`}
              isArchived={project.isArchived}
            />
            <HorizontalSeparator className="my-4 max-md:-mx-4 max-md:w-screen md:!my-6 md:hidden" />
            <ScalingProjectStats project={project} className="md:col-span-2" />
          </div>
        </div>
        <BigPizzaRosette
          className="mt-auto max-lg:hidden"
          values={project.header.rosetteValues}
          isUnderReview={project.isUnderReview}
          isUpcoming={project.isUpcoming}
        />
      </div>

      <HorizontalSeparator className="mt-6 max-md:-mx-4 max-md:w-screen md:mb-6" />
      <div className="md:hidden">
        <MobileProjectLinks projectLinks={project.header.links} />
      </div>
      <div className="max-md:hidden">
        <div className="mt-6 flex flex-col gap-4 px-4 max-md:mt-2 md:px-0 lg:flex-row lg:gap-8">
          {project.header.badges && (
            <BadgesSection badges={project.header.badges} />
          )}
          {project.header.description && (
            <AboutSection description={project.header.description} />
          )}
        </div>
        <HorizontalSeparator className="my-6" />
      </div>
    </section>
  )
}
