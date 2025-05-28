import type { ProjectScalingStage, Stage } from '@l2beat/config'

import { StageBadge } from '~/components/badge/stage-badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { TableLink } from '~/components/table/table-link'
import { CircleQuestionMarkIcon } from '~/icons/circle-question-mark'
import { EmergencyIcon } from '~/icons/emergency'
import { StopwatchIcon } from '~/icons/stopwatch'
import { cn } from '~/utils/cn'
import { StageTooltip } from './stage-tooltip'

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
  const hasNotice =
    stageConfig.stage !== 'UnderReview' &&
    stageConfig.stage !== 'NotApplicable' &&
    !!stageConfig.additionalConsiderations

  const content = (
    <div className="flex gap-1">
      <StageBadge
        stage={stageConfig.stage}
        isAppchain={isAppchain}
        className="flex flex-col gap-px"
      />
      {hasNotice && (
        <CircleQuestionMarkIcon
          className={cn(
            '-mt-px size-5 fill-current md:mt-px',
            getCircleQuestionMarkClassName(stageConfig.stage),
          )}
          questionMarkClassName={getQuestionMarkClassName(stageConfig.stage)}
        />
      )}
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
      </TooltipContent>
    </Tooltip>
  )
}

function getQuestionMarkClassName(
  stage: Stage | 'UnderReview' | 'NotApplicable',
): string {
  switch (stage) {
    case 'Stage 2':
      return 'fill-white'
    case 'Stage 1':
      return 'fill-yellow-900'
    case 'Stage 0':
      return 'text-white'
    default:
      return ''
  }
}

function getCircleQuestionMarkClassName(
  stage: Stage | 'UnderReview' | 'NotApplicable',
): string {
  switch (stage) {
    case 'Stage 2':
      return 'fill-green-900'
    case 'Stage 1':
      return 'fill-[#FFC61B]'
    case 'Stage 0':
      return 'fill-orange-600 dark:fill-[#E03109]'
    default:
      return ''
  }
}
