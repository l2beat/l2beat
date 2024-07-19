import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { DesktopProjectLinks } from '~/app/_components/projects/links/desktop-project-links'
import { MobileProjectLinks } from '~/app/_components/projects/links/mobile-project-links'
import { AboutSection } from '~/app/_components/projects/sections/about-section'
import { BigPentagonRosette } from '~/app/_components/rosette/pentagon/big-pentagon-rosette'
import { type DaProjectEntry } from '~/server/features/data-availability/get-da-project-entry'
import { DaProjectStats } from './da-project-stats'

interface Props {
  project: DaProjectEntry
}

export function DaProjectSummary({ project }: Props) {
  return (
    <section
      id="summary"
      className="max-md:bg-gray-100 max-md:dark:bg-zinc-900 max-md:-mx-4 max-md:px-4"
    >
      <div className="flex gap-10">
        <div className="w-full space-y-4">
          {project.description && (
            <div className="md:hidden">
              <AboutSection description={project.description} />
            </div>
          )}
          <HorizontalSeparator className="!my-6 max-md:-mx-4 max-md:w-screen" />
          <div className="max-md:hidden">
            <DesktopProjectLinks projectLinks={project.header.links} />
          </div>
          <DaProjectStats project={project} />
        </div>
        <BigPentagonRosette
          className="max-lg:hidden mt-auto"
          values={project.header.rosetteValues}
          isUnderReview={project.isUnderReview}
        />
      </div>

      <HorizontalSeparator className="mt-6 md:mb-6 max-md:-mx-4 max-md:w-screen" />
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
