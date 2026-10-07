import type { ProjectScalingStage } from '@l2beat/config'

import { StageBadge } from '~/components/badge/StageBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipVisualOnly,
} from '~/components/core/tooltip/Tooltip'
import { TableLink } from '~/components/table/TableLink'
import { EmergencyIcon } from '~/icons/Emergency'
import { StopwatchIcon } from '~/icons/Stopwatch'
import { WalkAwayNotPassedIcon } from '~/icons/WalkAwayNotPassed'
import { WalkAwayPassedIcon } from '~/icons/WalkAwayPassed'
import { StageTooltip } from './StageTooltip'

interface StageCellProps {
  stageConfig: ProjectScalingStage
  isAppchain: boolean
  href?: string
  emergencyWarning?: string
  walkAway?: 'passed' | 'not-passed'
}

export function StageCell({
  stageConfig,
  isAppchain,
  href,
  emergencyWarning,
  walkAway,
}: StageCellProps) {
  const content = (
    <div className="flex gap-1">
      <StageBadge
        stage={stageConfig.stage}
        isAppchain={isAppchain}
        variant="soft"
        className="flex flex-col items-start gap-px"
        appchainClassName="pl-[7px] text-left text-[10.5px]"
      />
      {stageConfig.stage !== 'NotApplicable' &&
        stageConfig.stage !== 'UnderReview' &&
        stageConfig.downgradePending &&
        !emergencyWarning && <StopwatchIcon className="mt-0.5" />}
      {emergencyWarning && <EmergencyIcon className="mt-0.5" />}
      {walkAway === 'passed' && (
        <WalkAwayPassedIcon className="mt-px size-[18px] fill-positive" />
      )}
      {walkAway === 'not-passed' && (
        <WalkAwayNotPassedIcon className="mt-px size-[18px] fill-negative" />
      )}
    </div>
  )

  if (stageConfig.stage === 'NotApplicable') {
    return content
  }

  return (
    <Tooltip contentInHtml>
      <TooltipTrigger disabledOnMobile className="h-full">
        <TableLink href={href}>{content}</TableLink>
      </TooltipTrigger>
      <TooltipContent>
        <StageTooltip
          stageConfig={stageConfig}
          isAppchain={isAppchain}
          emergencyWarning={emergencyWarning}
          walkAway={walkAway}
        />
        <TooltipVisualOnly>
          <p className="mt-3 text-label-value-13 text-secondary">
            Click to view details
          </p>
        </TooltipVisualOnly>
      </TooltipContent>
    </Tooltip>
  )
}
