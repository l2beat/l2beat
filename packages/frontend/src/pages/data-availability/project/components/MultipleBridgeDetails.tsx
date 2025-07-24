import { Button, buttonVariants } from '~/components/core/Button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '~/components/core/Drawer'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import { RiskBanner } from '~/components/projects/RiskBanner'
import { GrissiniCell } from '~/components/rosette/grissini/GrissiniCell'
import { GrissiniIcon } from '~/components/rosette/grissini/GrissiniIcon'
import { NoBridgeGrissiniDetailsPlaceholder } from '~/components/rosette/grissini/NoBridgeGrissiniDetailsPlaceholder'
import { useRouter } from '~/hooks/useRouter'
import { UnderReviewIcon } from '~/icons/UnderReview'
import { UnverifiedIcon } from '~/icons/Unverified'
import {
  UNDER_REVIEW_DA_CLASSNAME,
  UNVERIFIED_DA_CLASSNAME,
} from '~/pages/data-availability/summary/components/table/DaSummaryPublicTable'
import type { DaProjectPageEntry } from '~/server/features/data-availability/project/getDaProjectEntry'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { getUnderReviewText } from '~/utils/project/underReview'

interface Props {
  project: DaProjectPageEntry
}

export function MultipleBridgeDetails({ project }: Props) {
  const router = useRouter()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-blue-700 text-paragraph-13 italic">
          Please select DA bridge to view detailed risks & characteristics.
          Bridge selection will define total DA risks.
        </div>
        <div className="flex flex-col rounded-lg bg-surface-secondary">
          <div className="hidden flex-row gap-4 rounded-t-lg border-divider bg-surface-tertiary px-4 py-2 text-secondary text-subtitle-12 uppercase leading-none! md:flex md:border-b">
            <div className="w-12" />
            <div className="flex-1">DA Bridge</div>
            <div className="flex-1 text-center">DA Risks</div>
            <div className="flex-1 pr-12 text-right max-xs:hidden">TVS</div>
            <div className="flex-[1.5] lg:flex-1">Used by</div>
          </div>
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto rounded-lg max-md:bg-surface-secondary md:gap-0 md:rounded-t-none">
            {project.bridges.map((bridge, index) => (
              <label
                key={bridge.slug}
                htmlFor={bridge.slug}
                className={cn(
                  'flex min-h-[56px] cursor-pointer flex-row gap-4 rounded-lg border-divider px-4 py-2 md:rounded-none md:border-b',
                  index === project.bridges.length - 1 && 'md:border-b-0',
                  // Hide 3rd and further bridges on mobile (will be shown in a drawer)
                  index > 2 && 'max-md:hidden',
                  index === 0 && 'md:rounded-t-none',
                  bridge.verificationWarning
                    ? UNVERIFIED_DA_CLASSNAME
                    : bridge.impactfulChangeWarning
                      ? UNDER_REVIEW_DA_CLASSNAME
                      : 'bg-surface-secondary md:bg-transparent',
                )}
              >
                <RadioButton
                  id={bridge.slug}
                  value={bridge.slug}
                  checked={bridge.slug === project.selectedBridge.slug}
                  onChange={() => {
                    router.push(
                      `/data-availability/projects/${project.slug}/${bridge.slug}`,
                    )
                  }}
                />

                <div className="flex flex-1 items-center gap-1 font-bold text-primary text-sm">
                  {bridge.name}
                  {bridge.verificationWarning && (
                    <Tooltip>
                      <TooltipTrigger>
                        <UnverifiedIcon className="size-3.5 fill-red-300 md:size-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        This bridge contains unverified contracts.
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {bridge.impactfulChangeWarning && (
                    <Tooltip>
                      <TooltipTrigger>
                        <UnderReviewIcon className="size-3.5 md:size-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        {getUnderReviewText('impactful-change')}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <div className="flex flex-1 items-center justify-end xs:justify-center">
                  <GrissiniCell values={bridge.grissiniValues} />
                </div>
                <div className="flex flex-1 items-center justify-end pr-1 font-bold text-primary text-sm max-xs:hidden md:pr-12">
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
                        <span className="font-medium text-sm">No L2 😔</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        There are no scaling projects listed on L2BEAT that use
                        this solution.
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </label>
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
                  <div className="mb-2 font-semibold text-lg text-zinc-800 dark:text-zinc-300">
                    Select bridge
                  </div>
                  <div>
                    {project.bridges.map((bridge) => (
                      <label
                        key={bridge.slug}
                        htmlFor={bridge.slug}
                        className="flex cursor-pointer flex-row items-center gap-2 border-gray-200 border-b py-3 dark:border-zinc-700"
                      >
                        <RadioButton
                          id={bridge.slug}
                          value={bridge.slug}
                          checked={bridge.slug === project.selectedBridge.slug}
                          onChange={() => {
                            router.push(
                              `/data-availability/projects/${project.slug}/${bridge.slug}`,
                            )
                          }}
                        />
                        <div className="flex-1 font-semibold text-sm text-zinc-800 dark:text-zinc-300">
                          {bridge.name}
                        </div>
                        <div>
                          <GrissiniIcon values={bridge.grissiniValues} />
                        </div>
                      </label>
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

      <div className="space-y-2">
        <div className="whitespace-pre text-secondary text-xs">
          {project.selectedBridge.name} risks
        </div>

        {project.selectedBridge.isNoBridge ? (
          <NoBridgeGrissiniDetailsPlaceholder />
        ) : (
          <div className="grid gap-2 md:grid-cols-3 md:gap-4">
            {project.header.daBridgeGrissiniValues.map((value) => (
              <RiskBanner
                key={value.name}
                {...value}
                descriptionAsTooltip={true}
                info="compact"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RadioButton({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <div className="grid place-items-center px-1 md:px-3">
      <input
        type="radio"
        name="bridge"
        className={cn(
          'peer relative col-start-1 row-start-1 aspect-square size-5 cursor-pointer',
          'appearance-none rounded-full border-2 border-divider bg-pure-white checked:border-brand dark:bg-pure-black',
          className,
        )}
        {...props}
      />
      <div className="z-2 col-start-1 row-start-1 hidden aspect-square size-3 rounded-full bg-brand peer-checked:block " />
    </div>
  )
}
