import type { ProjectScalingStage } from '@l2beat/config'

import { SmallStageBadge, StageBadge } from '~/components/badge/StageBadge'
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
import { cn } from '~/utils/cn'
import { StageTooltip } from './StageTooltip'

interface StageCellProps {
  stageConfig: ProjectScalingStage
  isAppchain: boolean
  href?: string
  emergencyWarning?: string
  walkAway?: 'passed' | 'not-passed'
  /**
   * For a compact table: the small badge, on one line. The tooltip says
   * whether it is an appchain.
   */
  compact?: boolean
}

export function StageCell({
  stageConfig,
  isAppchain,
  href,
  emergencyWarning,
  walkAway,
  compact,
}: StageCellProps) {
  // Beside the small badge the icons centre on it; beside the tall one they
  // sit level with its first line.
  const iconClassName = compact ? undefined : 'mt-px md:mt-[3px]'
  const walkAwayClassName = compact ? 'size-5' : '-mt-px size-5 md:size-6'
  const content = (
    <div className={cn('flex gap-1', compact && 'items-center')}>
      {compact ? (
        <SmallStageBadge stage={stageConfig.stage} />
      ) : (
        <StageBadge
          stage={stageConfig.stage}
          isAppchain={isAppchain}
          className="flex flex-col gap-px"
        />
      )}
      {stageConfig.stage !== 'NotApplicable' &&
        stageConfig.stage !== 'UnderReview' &&
        stageConfig.downgradePending &&
        !emergencyWarning && <StopwatchIcon className={iconClassName} />}
      {emergencyWarning && <EmergencyIcon className={iconClassName} />}
      {walkAway === 'passed' && (
        <WalkAwayPassedIcon
          className={cn(walkAwayClassName, 'fill-positive')}
        />
      )}
      {walkAway === 'not-passed' && (
        <WalkAwayNotPassedIcon
          className={cn(walkAwayClassName, 'fill-negative')}
        />
      )}
    </div>
  )

  if (stageConfig.stage === 'NotApplicable') {
    return content
  }

  return (
    <Tooltip contentInHtml>
      <TooltipTrigger disabledOnTouch className="h-full">
        <TableLink href={href}>{content}</TableLink>
      </TooltipTrigger>
      <TooltipContent>
        <StageTooltip
          stageConfig={stageConfig}
          isAppchain={isAppchain}
          emergencyWarning={emergencyWarning}
          walkAway={walkAway}
          compact={compact}
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
