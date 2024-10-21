import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { DesktopProjectLinks } from '~/components/projects/links/desktop-project-links'
import { MobileProjectLinks } from '~/components/projects/links/mobile-project-links'
import { AboutSection } from '~/components/projects/sections/about-section'
import { BigPentagonRosette } from '~/components/rosette/pentagon/big-pentagon-rosette'
import { type DaProjectEntry } from '~/server/features/data-availability/project/get-da-project-entry'
import { DaProjectStats } from './da-project-stats'
import { ProjectHeader } from '~/components/projects/project-header'
import { GrisiniDetails } from '~/components/grisini/grisini-details'

interface Props {
  project: DaProjectEntry
}

export function DaProjectSummary({ project }: Props) {
  return (
    <section
      id="summary"
      className="max-md:bg-gray-100 max-md:px-4 max-md:dark:bg-zinc-900"
    >
      <header className="space-y-4 pt-6 max-md:bg-gray-100 max-md:pb-4 md:space-y-3 max-md:dark:bg-zinc-900">
        <ProjectHeader title={project.name} slug={project.slug} />
      </header>
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
        <GrisiniDetails items={project.header.grisiniValues} />
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
