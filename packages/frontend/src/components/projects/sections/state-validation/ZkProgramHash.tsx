import type { ProjectScalingStateValidationZkProgramHash } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { CustomLink } from '~/components/link/CustomLink'
import { Markdown } from '~/components/markdown/Markdown'
import {
  ProjectsUsedIn,
  type UsedInProjectWithIcon,
} from '~/components/ProjectsUsedIn'
import { ChevronIcon } from '~/icons/Chevron'
import { CountWithAttesters } from '~/pages/zk-catalog/v2/components/VerifiedCountWithDetails'

export type StateValidationZkProgramHashData = Omit<
  ProjectScalingStateValidationZkProgramHash,
  'proverSystemProject'
> & {
  zkCatalogProject: {
    id: ProjectId
    icon: string
  }
  usedIn: UsedInProjectWithIcon[]
}

export function ZkProgramHash({
  zkProgramHash,
}: {
  zkProgramHash: StateValidationZkProgramHashData
}) {
  return (
    <Collapsible className="group rounded-lg border border-divider">
      <CollapsibleTrigger asChild>
        <div className="flex w-full items-center justify-between gap-1 px-6 py-3 font-bold hover:cursor-pointer">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-label-value-15">
              {zkProgramHash.description}
            </span>
            <span className="text-paragraph-13 text-secondary">
              {zkProgramHash.hash}
            </span>
            <CountWithAttesters
              attesters={[]}
              count={1}
              type={zkProgramHash.verificationStatus}
            />
            <CustomLink
              href={zkProgramHash.programUrl}
              className="text-label-value-13 text-secondary"
            >
              Program Url
            </CustomLink>
            <div className="flex items-center gap-1">
              <span>Zk calatog project</span>
              <img
                src={zkProgramHash.zkCatalogProject.icon}
                alt={zkProgramHash.zkCatalogProject.id}
                className="size-4"
              />
            </div>
            <div className="flex items-center gap-1">
              <span>Used in</span>
              <ProjectsUsedIn usedIn={zkProgramHash.usedIn} />
            </div>
          </div>
          <ChevronIcon className="group-data-[state=open]:-rotate-180 size-4 transition-transform duration-300" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-6">
        <div className="pb-6">
          <HorizontalSeparator className="mb-4" />
          {zkProgramHash.verificationSteps && (
            <div className="space-y-3">
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
