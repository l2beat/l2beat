import { TokenBreakdown } from '~/components/breakdown/TokenBreakdown'
import { ValueSecuredBreakdown } from '~/components/breakdown/ValueSecuredBreakdown'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { VerticalSeparator } from '~/components/core/VerticalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { BadgesSection } from '~/components/projects/sections/BadgesSection'
import type { ProjectScalingEntry } from '~/server/features/scaling/project/getScalingProjectEntry'
import { ProjectScalingRosette } from './ScalingProjectRosette'
import { ProjectScalingStats } from './ScalingProjectStats'

interface Props {
  project: ProjectScalingEntry
}

export function ProjectScalingSummary({ project }: Props) {
  return (
    <PrimaryCard className="!rounded-lg !p-6">
      <section id="summary" data-role="project-section">
        <div className="flex">
          <div className="w-full">
            <ProjectScalingStats project={project} />
            <HorizontalSeparator className="mt-5 mb-4" />
            <div className="grid gap-x-10 gap-y-4 md:grid-cols-2">
              <div>
                <p className="label-value-12-medium mb-2 text-secondary">
                  Tokens breakdown
                </p>
                <TokenBreakdown
                  total={project.header.tvs?.tokens.breakdown?.total ?? 0}
                  associated={
                    project.header.tvs?.tokens.breakdown?.associated ?? 0
                  }
                  ether={project.header.tvs?.tokens.breakdown?.ether ?? 0}
                  stablecoin={
                    project.header.tvs?.tokens.breakdown?.stablecoin ?? 0
                  }
                  className="h-1.5 w-full"
                />
              </div>
              <div>
                <p className="label-value-12-medium mb-2 text-secondary">
                  Value secured breakdown
                </p>
                <ValueSecuredBreakdown
                  canonical={project.header.tvs?.breakdown?.canonical ?? 0}
                  external={project.header.tvs?.breakdown?.external ?? 0}
                  native={project.header.tvs?.breakdown?.native ?? 0}
                  className="h-1.5 w-full"
                />
              </div>
            </div>
          </div>
          <VerticalSeparator className="mr-8 ml-12 self-stretch max-lg:hidden" />

          <ProjectScalingRosette project={project} size="small" />
        </div>

        {/* {project.discoUiHref && (
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
        )} */}

        <HorizontalSeparator className="max-md:-mx-4 mt-2 max-md:w-screen md:my-4" />
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
    </PrimaryCard>
  )
}
