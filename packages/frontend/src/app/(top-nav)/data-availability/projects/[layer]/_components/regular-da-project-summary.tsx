import Link from 'next/link'
import { ProjectsUsedIn } from '~/app/(side-nav)/data-availability/summary/_components/table/projects-used-in'
import { Button, buttonVariants } from '~/components/core/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '~/components/core/drawer'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { FullPageHeader } from '~/components/full-page-header'
import { DesktopProjectLinks } from '~/components/projects/links/desktop-project-links'
import { MobileProjectLinks } from '~/components/projects/links/mobile-project-links'
import { ProjectHeader } from '~/components/projects/project-header'
import { GrissiniCell } from '~/components/rosette/grissini/grissini-cell'
import { GrissiniDetails } from '~/components/rosette/grissini/grissini-details'
import { GrissiniIcon } from '~/components/rosette/grissini/grissini-icon'
import { NoBridgeGrissiniDetailsPlaceholder } from '~/components/rosette/grissini/no-bridge-grissini-details-placeholder'
import { InfoIcon } from '~/icons/info'
import { type DaProjectPageEntry } from '~/server/features/data-availability/project/get-da-project-entry'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/format-currency'
import {
  DaProjectStats,
  type ProjectStat,
  getCommonDaProjectStats,
} from './da-project-stats'

interface Props {
  project: DaProjectPageEntry
}

export function RegularDaProjectSummary({ project }: Props) {
  const stats: ProjectStat[] = [
    ...getCommonDaProjectStats(project),
    ...(project.header.numberOfOperators
      ? [
          {
            title: 'Number of operators',
            value: project.header.numberOfOperators,
          },
        ]
      : []),

    {
      title: 'Used by',
      value: (
        <ProjectsUsedIn
          usedIn={project.header.usedIn}
          className="flex-wrap justify-start"
          maxProjects={5}
        />
      ),
    },
  ]

  return (
    <FullPageHeader className="pb-0 pt-8 md:pb-8 md:pt-12">
      <section id="summary" className="w-full">
        <ProjectHeader title={project.name} slug={project.slug} />
        <div className="mt-6 flex w-full gap-10">
          <div className="w-full">
            {/* Details row */}
            <div className="flex flex-col gap-6 md:gap-10">
              {/* Links and stats */}
              <div className="flex flex-row items-end gap-10">
                <div className="w-full">
                  <div className="!mb-8 hidden md:flex">
                    <HorizontalSeparator className="max-md:-mx-4 max-md:w-screen" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col gap-4">
                      <div className="max-md:hidden">
                        <DesktopProjectLinks
                          projectLinks={project.header.links}
                        />
                      </div>
                      <DaProjectStats
                        stats={stats}
                        daLayerGrissiniValues={
                          project.header.daLayerGrissiniValues
                        }
                      />
                    </div>
                  </div>
                </div>
                {/* Right side (DA Layer Grissini details) */}
                <div className="hidden lg:block">
                  <div className="flex flex-col gap-4 pt-3">
                    <div className="whitespace-pre text-xs text-secondary">
                      {project.name} risks
                    </div>
                    <GrissiniDetails
                      values={project.header.daLayerGrissiniValues}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <div>
                  <div className="-mx-4 border-y border-divider px-4 md:hidden">
                    <MobileProjectLinks projectLinks={project.header.links} />
                  </div>
                </div>
                {/* Table row */}
                <div className="flex flex-row items-end gap-10 py-8 max-md:pt-6 md:py-0">
                  {/* Left side (table with title and banner) */}
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="whitespace-pre text-xs uppercase text-secondary">
                      Select a bridge
                    </div>
                    <div className="hidden flex-row items-center gap-2 rounded-md border border-blue-500 bg-blue-400 px-3 py-2 text-xs font-medium text-blue-700 dark:text-blue-700 md:flex lg:px-6">
                      <InfoIcon className="size-4 shrink-0 fill-current dark:fill-current" />
                      Please select one of the available DA bridges to view its
                      risks and detailed analysis.
                    </div>
                    <div className="flex flex-col rounded-lg bg-surface-table-group lg:h-[278px]">
                      <div className="hidden flex-row gap-4 rounded-t-lg border-divider bg-surface-secondary px-4 py-2 text-xs font-semibold uppercase text-secondary md:flex md:border-b">
                        <div className="w-12"></div>
                        <div className="flex-1">DA Bridge</div>
                        <div className="flex-1 text-center">DA Risks</div>
                        <div className="flex-1 pr-12 text-right">TVS</div>
                        <div className="flex-[1.5] lg:flex-1">Used by</div>
                      </div>
                      <div className="flex flex-1 flex-col gap-2 overflow-y-auto rounded-lg bg-surface-table-group md:gap-0 md:rounded-t-none md:bg-none dark:md:bg-none">
                        {project.bridges.map((bridge, index) => (
                          <div
                            key={bridge.id}
                            className={cn(
                              'flex min-h-[56px] flex-row gap-4 rounded-lg border-divider px-4 py-2 max-md:bg-surface-secondary md:rounded-none md:border-b',
                              index === project.bridges.length - 1 &&
                                'md:border-b-0',
                              // Hide 3rd and further bridges on mobile (will be shown in a drawer)
                              index > 2 && 'max-md:hidden',
                              index === 0 && 'md:rounded-t-none',
                            )}
                          >
                            <div className="flex items-center px-1 md:px-3">
                              <Link
                                href={`/data-availability/projects/${project.slug}/${bridge.slug}`}
                              >
                                <RadioButtonLikeIcon
                                  selected={
                                    bridge.id === project.selectedBridge.id
                                  }
                                />
                              </Link>
                            </div>
                            <div className="flex flex-1 items-center text-sm font-bold text-primary">
                              {bridge.name}
                            </div>
                            <div className="flex flex-1 items-center justify-center">
                              <GrissiniCell
                                values={bridge.grissiniValues}
                                hasNoBridge={bridge.type === 'NoBridge'}
                              />
                            </div>
                            <div className="flex flex-1 items-center justify-end pr-1 text-sm font-bold text-primary md:pr-12">
                              {formatCurrency(bridge.tvs, 'usd')}
                            </div>
                            <div className="hidden flex-[1.5] flex-row items-center md:flex lg:flex-1">
                              {bridge.usedIn.length > 0 ? (
                                <ProjectsUsedIn
                                  className="h-5 justify-start"
                                  usedIn={bridge.usedIn}
                                  maxProjects={4}
                                />
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <span className="text-sm font-medium">
                                      No L2 😔
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    There are no scaling projects listed on
                                    L2BEAT that use this solution.
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        ))}
                        <div
                          className={cn(
                            'md:hidden',
                            // Show "View all bridges" button if there are more than 3 bridges
                            project.bridges.length < 3 && 'hidden',
                          )}
                        >
                          <Drawer>
                            <DrawerTrigger
                              className={cn(
                                buttonVariants({ variant: 'outline' }),
                                'w-full py-3.5',
                              )}
                            >
                              View all bridges
                            </DrawerTrigger>
                            <DrawerContent className="bg-pure-white dark:bg-pure-black">
                              <div className="mb-2 text-lg font-semibold text-zinc-800 dark:text-zinc-300">
                                Select bridge
                              </div>
                              <div>
                                {project.bridges.map((bridge) => (
                                  <div
                                    key={bridge.id}
                                    className="flex flex-row items-center gap-2 border-b border-gray-200 py-3 dark:border-zinc-700"
                                  >
                                    <div>
                                      <RadioButtonLikeIcon
                                        selected={
                                          bridge.id ===
                                          project.selectedBridge.id
                                        }
                                      />
                                    </div>
                                    <div className="flex-1 text-sm font-semibold text-zinc-800 dark:text-zinc-300">
                                      {bridge.name}
                                    </div>
                                    <div>
                                      <GrissiniIcon
                                        values={bridge.grissiniValues}
                                        hasNoBridge={bridge.type === 'NoBridge'}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <DrawerFooter className="flex flex-row justify-center pt-6">
                                <DrawerClose asChild>
                                  <Button className="bg-transparent text-sm text-zinc-500 underline dark:bg-transparent">
                                    Close
                                  </Button>
                                </DrawerClose>
                              </DrawerFooter>
                            </DrawerContent>
                          </Drawer>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side (Grissini details) */}
                  <div className="hidden w-full max-w-[264px] flex-col space-y-4 pt-3 lg:flex">
                    <div className="whitespace-pre text-xs text-secondary">
                      {project.selectedBridge.name} risks
                    </div>

                    {project.selectedBridge.type === 'NoBridge' ? (
                      <NoBridgeGrissiniDetailsPlaceholder />
                    ) : (
                      <GrissiniDetails
                        values={project.header.daBridgeGrissiniValues}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </FullPageHeader>
  )
}

function RadioButtonLikeIcon({ selected }: { selected: boolean }) {
  return (
    <div
      className={cn(
        'flex size-5 items-center justify-center rounded-full border-2 bg-pure-white',
        selected ? 'border-brand' : 'border-divider',
      )}
    >
      {selected ? <div className="size-3 rounded-full bg-brand"></div> : null}
    </div>
  )
}
