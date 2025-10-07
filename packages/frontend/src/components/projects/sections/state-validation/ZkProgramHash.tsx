import type { ProjectScalingStateValidationZkProgramHash } from '@l2beat/config'
import { CopyButton } from '~/components/CopyButton'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CustomLink } from '~/components/link/CustomLink'
import { Markdown } from '~/components/markdown/Markdown'
import {
  ProjectsUsedIn,
  type UsedInProjectWithIcon,
} from '~/components/ProjectsUsedIn'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { ChevronIcon } from '~/icons/Chevron'
import { GithubIcon } from '~/icons/products/Github'
import { CountWithAttesters } from '~/pages/zk-catalog/v2/components/VerifiedCountWithDetails'
import { cn } from '~/utils/cn'

export type StateValidationZkProgramHashData = Omit<
  ProjectScalingStateValidationZkProgramHash,
  'proverSystemProject'
> & {
  zkCatalogProject?: {
    name: string
    href: string
    icon: string
  }
  usedIn: UsedInProjectWithIcon[]
}

export function ZkProgramHash({
  zkProgramHash,
}: {
  zkProgramHash: StateValidationZkProgramHashData
}) {
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'xs' || breakpoint === 'sm'

  return (
    <Collapsible
      className="group rounded-lg border border-divider"
      open={!zkProgramHash.verificationSteps && !isMobile ? false : undefined}
    >
      <CollapsibleTrigger asChild>
        <div className="flex w-full items-center justify-between gap-6 px-6 py-4 hover:cursor-pointer">
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-label-value-16">
                {zkProgramHash.title}
              </span>
              {zkProgramHash.zkCatalogProject && (
                <ZkProjectTooltip zkProject={zkProgramHash.zkCatalogProject} />
              )}
            </div>
            <div className="flex items-center gap-1.5 max-md:hidden">
              <span className="font-medium text-label-value-14 text-secondary">
                {zkProgramHash.hash}
              </span>
              <CopyButton
                toCopy={zkProgramHash.hash}
                iconClassName="size-3 fill-secondary"
              />
            </div>
            <div className="mt-1 grid grid-cols-2 md:grid-cols-3">
              <div
                className={cn(
                  'flex items-center gap-0.5',
                  !zkProgramHash.programUrl && 'opacity-70',
                )}
              >
                {zkProgramHash.programUrl && (
                  <span className="font-medium text-label-value-12 text-secondary">
                    Repository
                  </span>
                )}
                <GithubIcon className="mx-0.5 size-4" />
                {zkProgramHash.programUrl && (
                  <CustomLink
                    href={zkProgramHash.programUrl}
                    className="font-medium text-label-value-12"
                  >
                    Github
                  </CustomLink>
                )}
                {!zkProgramHash.programUrl && (
                  <span className="font-medium text-label-value-12 text-secondary">
                    Code unknown
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-label-value-12 text-secondary">
                  Verification
                </span>
                <CountWithAttesters
                  attesters={[]}
                  count={1}
                  type={zkProgramHash.verificationStatus}
                  hideCount
                />
              </div>
              <div className="flex items-center gap-1 max-md:hidden">
                <span className="font-medium text-label-value-12 text-secondary">
                  Used in
                </span>
                <ProjectsUsedIn usedIn={zkProgramHash.usedIn} />
              </div>
            </div>
          </div>
          <ChevronIcon
            className={cn(
              'group-data-[state=open]:-rotate-180 size-4 transition-transform duration-300',
              !zkProgramHash.verificationSteps && !isMobile && 'hidden',
            )}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-6">
        <div className="pb-6">
          <HorizontalSeparator className="mb-4" />
          <div className="flex items-center gap-1 md:hidden">
            <span className="font-medium text-label-value-12 text-secondary">
              Used in
            </span>
            <ProjectsUsedIn usedIn={zkProgramHash.usedIn} />
          </div>
          {zkProgramHash.verificationSteps && (
            <div className="mt-2 space-y-3">
              <div className="font-bold text-label-value-16">
                Verification steps
              </div>
              <Markdown className="text-paragraph-15 md:text-paragraph-16">
                {zkProgramHash.verificationSteps}
              </Markdown>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function ZkProjectTooltip({
  zkProject,
}: {
  zkProject: NonNullable<StateValidationZkProgramHashData['zkCatalogProject']>
}) {
  return (
    <Tooltip>
      <a href={zkProject.href} className="size-5 min-h-5 min-w-5">
        <TooltipTrigger>
          <img
            width={20}
            height={20}
            src={zkProject.icon}
            alt={`${zkProject.name} logo`}
          />
        </TooltipTrigger>
      </a>
      <TooltipContent>
        <p className="font-bold">{zkProject.name}</p>
        <p className="text-secondary text-xs">Click to view project page</p>
      </TooltipContent>
    </Tooltip>
  )
}
