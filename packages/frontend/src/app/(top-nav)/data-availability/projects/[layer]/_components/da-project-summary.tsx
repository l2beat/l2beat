import Link from 'next/link'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { Grisini } from '~/components/grisini/grisini'
import { GrisiniDetails } from '~/components/grisini/grisini-details'
import { DesktopProjectLinks } from '~/components/projects/links/desktop-project-links'
import { MobileProjectLinks } from '~/components/projects/links/mobile-project-links'
import { ProjectHeader } from '~/components/projects/project-header'
import { AboutSection } from '~/components/projects/sections/about-section'
import { InfoIcon } from '~/icons/info'
import { type DaProjectEntry } from '~/server/features/data-availability/project/get-da-project-entry'
import { cn } from '~/utils/cn'
import { DaProjectStats } from './da-project-stats'

interface Props {
  project: DaProjectEntry
}

export function DaProjectSummary({ project }: Props) {
  return (
    <section
      id="summary"
      className="max-md:bg-gray-100 max-md:px-4 max-md:dark:bg-zinc-900"
    >
      <header className="space-y-4 pt-6 max-md:bg-gray-100 max-md:pb-4 max-md:dark:bg-zinc-900 md:space-y-3">
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
              <div className="hidden lg:block">
                <HorizontalSeparator className="!my-6 max-md:-mx-4 max-md:w-screen" />
                <div className="flex flex-col space-y-4 pt-3">
                  <div className="whitespace-pre text-xs text-gray-500 dark:text-gray-600">
                    {project.name} risks
                  </div>
                  <GrisiniDetails items={project.header.daLayerGrisiniValues} />
                </div>
              </div>
            </div>
            <div className="flex flex-row items-end gap-10">
              <div className="flex flex-1 flex-col gap-4">
                <div className="whitespace-pre text-xs uppercase text-gray-500 dark:text-gray-600">
                  Select a bridge
                </div>
                <div className="flex flex-row items-center gap-2 rounded-md border border-blue-500 bg-blue-400 px-6 py-2 text-xs font-semibold text-blue-700 dark:text-blue-700">
                  <InfoIcon className="size-4 fill-current dark:fill-current" />
                  Please select DA bridge to view detailed risks &
                  characteristics. Bridge selection will define total DA risks.
                </div>
                <div className="flex h-[278px] flex-col">
                  <div className="flex flex-row gap-4 rounded-t-lg bg-surface-secondary px-4 py-2 text-xs font-semibold uppercase text-secondary dark:bg-zinc-800">
                    <div className="w-12"></div>
                    <div className="flex-1">DA Bridge</div>
                    <div className="flex-1 text-center">DA Risks</div>
                    <div className="flex-1 pr-12 text-right">TVS</div>
                    <div className="flex-1">Used by</div>
                  </div>
                  <div className="flex-1 overflow-y-auto rounded-b-lg bg-zinc-100 dark:bg-zinc-900">
                    {project.bridges.map((bridge) => (
                      <div
                        key={bridge.id}
                        className="flex min-h-[56px] flex-row gap-4 border-b border-surface-tertiary px-4 py-2"
                      >
                        <div className="flex w-12 items-center justify-center">
                          <Link
                            href={`/data-availability/projects/${project.slug}/${bridge.slug}`}
                          >
                            <div
                              className={cn(
                                'flex size-5 items-center justify-center rounded-full border-2 bg-pure-white',
                                bridge.id === project.selectedBridge.id
                                  ? 'border-brand'
                                  : 'border-gray-400',
                              )}
                            >
                              {bridge.id === project.selectedBridge.id ? (
                                <div className="size-3 rounded-full bg-brand"></div>
                              ) : null}
                            </div>
                          </Link>
                        </div>
                        <div className="flex flex-1 items-center text-sm font-bold text-primary">
                          {bridge.name}
                        </div>
                        <div className="flex flex-1 items-center justify-center">
                          <Grisini items={bridge.grisiniValues} />
                        </div>
                        <div className="flex flex-1 items-center justify-end pr-12 text-sm font-bold text-primary">
                          TODO
                        </div>
                        <div className="flex flex-1 items-center">TODO</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden w-full max-w-[264px] flex-col space-y-4 pt-3 lg:flex">
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
