import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { DesktopProjectLinks } from '~/app/_components/projects/links/desktop-project-links'
import { MobileProjectLinks } from '~/app/_components/projects/links/mobile-project-links'
import { AboutSection } from '~/app/_components/projects/sections/about-section'
import { BigPizzaRosette } from '~/app/_components/rosette/pizza/big-pizza-rosette'
import { type ScalingProjectEntry } from '~/server/features/scaling/project/get-scaling-project-entry'
import { ScalingProjectStats } from './scaling-project-stats'

interface Props {
  project: ScalingProjectEntry
}

export function ScalingProjectSummary({ project }: Props) {
  return (
    <section
      id="summary"
      className="max-md:-mx-4 max-md:bg-gray-100 max-md:px-4 max-md:dark:bg-zinc-900"
    >
      <div className="flex gap-10">
        <div className="w-full space-y-4">
          {project.description && (
            <div className="md:hidden">
              <AboutSection description={project.description} />
            </div>
          )}
          <HorizontalSeparator className="!my-6 max-md:-mx-4 max-md:w-screen" />

          <div className="my-2 max-md:hidden">
            <DesktopProjectLinks projectLinks={project.header.links} />
          </div>
          <ScalingProjectStats project={project} />
        </div>
        <BigPizzaRosette
          className="mt-auto max-lg:hidden"
          values={project.header.rosetteValues}
          isUnderReview={project.isUnderReview}
        />
      </div>

      <HorizontalSeparator className="mt-6 max-md:-mx-4 max-md:w-screen md:mb-6" />
      <div className="md:hidden">
        <MobileProjectLinks projectLinks={project.header.links} />
      </div>
      {project.description ? (
        <div className="max-md:hidden">
          <AboutSection description={project.description} />
          <HorizontalSeparator className="my-6" />
        </div>
      ) : null}
    </section>
  )
}
