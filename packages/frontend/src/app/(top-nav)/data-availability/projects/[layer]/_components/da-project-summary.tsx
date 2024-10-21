import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { DesktopProjectLinks } from '~/components/projects/links/desktop-project-links'
import { MobileProjectLinks } from '~/components/projects/links/mobile-project-links'
import { AboutSection } from '~/components/projects/sections/about-section'
import { BigPentagonRosette } from '~/components/rosette/pentagon/big-pentagon-rosette'
import { type DaProjectEntry } from '~/server/features/data-availability/project/get-da-project-entry'
import { DaProjectStats } from './da-project-stats'
import { ProjectHeader } from '~/components/projects/project-header'
import { GrisiniDetails } from '~/components/grisini/grisini-details'
import { InfoIcon } from '~/icons/info'

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
        <div className="w-full">
          {project.description && (
            <div className="md:hidden">
              <AboutSection description={project.description} />
            </div>
          )}
          <div className="flex flex-col gap-10">
            <div className="flex flex-row gap-10">
              <div className="flex-1">
                <HorizontalSeparator className="!my-6 max-md:-mx-4 max-md:w-screen" />
                <div className="space-y-4">
                  <div className="max-md:hidden">
                    <DesktopProjectLinks projectLinks={project.header.links} />
                  </div>
                  <DaProjectStats project={project} />
                </div>
              </div>
              <div className="lg:block hidden">
                <HorizontalSeparator className="!my-6 max-md:-mx-4 max-md:w-screen" />
                <div className="pt-3 flex flex-col space-y-4">
                  <div className="whitespace-pre text-xs text-gray-500 dark:text-gray-600">
                    {project.name} risks
                  </div>
                  <GrisiniDetails items={project.header.daLayerGrisiniValues} />
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-10">
              <div className="flex-1">
                <div className="whitespace-pre uppercase text-xs text-gray-500 dark:text-gray-600">
                  Select a bridge
                </div>
                <div className="flex flex-row items-center gap-2 bg-blue-400 border border-blue-500 py-2 px-6 rounded-md text-blue-700 dark:text-blue-700 text-xs font-semibold">
                  <InfoIcon className="size-4 fill-current dark:fill-current" />
                  Please select DA bridge to view detailed risks &
                  characteristics. Bridge selection will define total DA risks.
                </div>
              </div>
              <div className="pt-3 flex flex-col space-y-4 w-full max-w-[264px]">
                <div className="whitespace-pre text-xs text-gray-500 dark:text-gray-600">
                  {project.selectedBridge.name} risks
                </div>
                <GrisiniDetails items={project.header.daBridgeGrisiniValues} />
              </div>
            </div>
          </div>
        </div>
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
