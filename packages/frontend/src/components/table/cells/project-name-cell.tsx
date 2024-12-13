import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { OtherMigrationTooltip } from '~/components/countdowns/other-migration/other-migration-tooltip'
import { Markdown } from '~/components/markdown/markdown'
import { env } from '~/env'
import { ShieldIcon } from '~/icons/shield'
import { UnderReviewIcon } from '~/icons/under-review'
import { UnverifiedIcon } from '~/icons/unverified'
import { type ProjectCountdownsWithContext } from '~/server/features/scaling/utils/get-countdowns'
import { type SyncStatus } from '~/types/sync-status'
import {
  type UnderReviewStatus,
  getUnderReviewText,
} from '~/utils/project/under-review'
import { NotSyncedIcon } from '../../badge/not-synced-badge'
import { PrimaryValueCell } from './primary-value-cell'

export interface ProjectCellProps {
  project: {
    name: string
    shortName?: string
    isVerified?: boolean
    headerWarning?: string
    redWarning?: string
    underReviewStatus?: UnderReviewStatus
    data?: { syncStatus?: SyncStatus }
    hostChain?: string
    countdowns?: ProjectCountdownsWithContext
  }
  className?: string
}

export function ProjectNameCell({ project, className }: ProjectCellProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5">
        <PrimaryValueCell className="font-bold !leading-none">
          {project.shortName ?? project.name}
        </PrimaryValueCell>
        {project.isVerified === false && (
          <Tooltip>
            <TooltipTrigger>
              <UnverifiedIcon className="size-3.5 fill-red-300 md:size-4" />
            </TooltipTrigger>
            <TooltipContent>
              This project contains unverified contracts.
            </TooltipContent>
          </Tooltip>
        )}
        {project.redWarning && (
          <Tooltip>
            <TooltipTrigger>
              <ShieldIcon className="relative -top-px size-3.5 fill-red-300 md:size-4" />
            </TooltipTrigger>
            <TooltipContent>{project.redWarning}</TooltipContent>
          </Tooltip>
        )}
        {project.underReviewStatus && (
          <Tooltip>
            <TooltipTrigger>
              <UnderReviewIcon className="size-3.5 md:size-4" />
            </TooltipTrigger>
            <TooltipContent>
              {getUnderReviewText(project.underReviewStatus)}
            </TooltipContent>
          </Tooltip>
        )}
        {project.headerWarning && (
          <Tooltip>
            <TooltipTrigger>
              <ShieldIcon className="relative -top-px size-3.5 fill-yellow-700 dark:fill-yellow-300 md:size-4" />
            </TooltipTrigger>
            <TooltipContent>
              <Markdown inline ignoreGlossary>
                {project.headerWarning}
              </Markdown>
            </TooltipContent>
          </Tooltip>
        )}
        {project.data?.syncStatus?.isSynced === false && (
          <NotSyncedIcon syncedUntil={project.data?.syncStatus.syncedUntil} />
        )}
        {env.NEXT_PUBLIC_FEATURE_FLAG_OTHER_PROJECTS &&
          project.countdowns?.otherMigration && (
            <OtherMigrationTooltip {...project.countdowns.otherMigration} />
          )}
      </div>
      {project.hostChain && (
        <span className="block text-[0.8125rem] font-medium leading-[0.9375rem] text-secondary">
          L3 on {project.hostChain}
        </span>
      )}
    </div>
  )
}
