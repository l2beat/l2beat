import type { ProjectScalingStage } from '@l2beat/config'

import { StageBadge } from '~/components/badge/StageBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TableLink } from '~/components/table/TableLink'
import { EmergencyIcon } from '~/icons/Emergency'
import { StopwatchIcon } from '~/icons/Stopwatch'
import { StageTooltip } from './StageTooltip'

export interface StageCellProps {
  stageConfig: ProjectScalingStage
  isAppchain: boolean
  href?: string
  emergencyWarning?: string
}

export function StageCell({
  stageConfig,
  isAppchain,
  href,
  emergencyWarning,
}: StageCellProps) {
  const content = (
    <div className="flex gap-1">
      <StageBadge
        stage={stageConfig.stage}
        isAppchain={isAppchain}
        className="flex flex-col gap-px"
      />
      {stageConfig.stage !== 'NotApplicable' &&
        stageConfig.stage !== 'UnderReview' &&
        stageConfig.downgradePending &&
        !emergencyWarning && <StopwatchIcon className="mt-px md:mt-[3px]" />}
      {emergencyWarning && <EmergencyIcon className="mt-px md:mt-[3px]" />}
    </div>
  )

  if (stageConfig.stage === 'NotApplicable') {
    return content
  }

  return (
    <Tooltip>
      <TooltipTrigger disabledOnMobile className="h-full">
        <TableLink href={href}>{content}</TableLink>
      </TooltipTrigger>
      <TooltipContent>
        <StageTooltip
          stageConfig={stageConfig}
          isAppchain={isAppchain}
          emergencyWarning={emergencyWarning}
        />
        <p className="mt-3 text-label-value-13 text-secondary">
          Click to view details
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
