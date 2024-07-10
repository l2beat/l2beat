import { ProjectHeader } from '~/app/_components/projects/project-header'
import { DaBridgeSelect } from './da-bridge-select'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { DesktopProjectLinks } from '~/app/_components/projects/links/desktop-project-links'
import { DaHeaderDetails } from './da-header-details'
import { type DaProjectEntry } from '~/server/features/data-availability/get-da-project-entry'
import { AboutSection } from '~/app/_components/projects/sections/about-section'
import { MobileProjectLinks } from '~/app/_components/projects/links/mobile-project-links'
import { BigPentagonRosette } from '~/app/_components/rosette/pentagon/big-pentagon-rosette'

interface Props {
  project: DaProjectEntry
}

export function DaHeader({ project }: Props) {
  return (
    <header className="pt-6 max-md:bg-gray-100 max-md:dark:bg-zinc-900 max-md:-mx-4 max-md:px-4">
      <section id="summary">
        <div className="flex gap-10">
          <div className="w-full space-y-4">
            <div className="space-y-4 md:space-y-3">
              <ProjectHeader
                title={project.name}
                src={`/icons/${project.slug}.png`}
              />
              <DaBridgeSelect project={project} />
            </div>
            {project.description && (
              <div className="md:hidden">
                <AboutSection description={project.description} />
              </div>
            )}
            <HorizontalSeparator className="!my-6 max-md:-mx-4 max-md:w-screen" />
            <div className="max-md:hidden">
              <DesktopProjectLinks projectLinks={project.header.links} />
            </div>
            <DaHeaderDetails project={project} />
          </div>
          <BigPentagonRosette
            className="max-lg:hidden mt-auto"
            values={project.header.rosetteValues}
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
    </header>
  )
}
