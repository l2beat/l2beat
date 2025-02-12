import type { StageConfig } from '@l2beat/config'

import {
  StageBadge,
  getStageTextClassname,
} from '~/components/badge/stage-badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { CircleQuestionMarkIcon } from '~/icons/circle-question-mark'
import { StopwatchIcon } from '~/icons/stopwatch'
import { cn } from '~/utils/cn'
import { StageTooltip } from './stage-tooltip'

export interface StageCellProps {
  stageConfig: StageConfig
  isAppchain: boolean
}

export function StageCell({ stageConfig, isAppchain }: StageCellProps) {
  const hasNotice =
    stageConfig.stage !== 'UnderReview' &&
    stageConfig.stage !== 'NotApplicable' &&
    !!stageConfig.additionalConsiderations

  return (
    <Tooltip>
      <TooltipTrigger
        className="flex gap-1 max-md:pb-[5px] max-md:pt-2"
        disabledOnMobile
      >
        <StageBadge stage={stageConfig.stage} isAppchain={isAppchain} />
        {hasNotice && (
          <CircleQuestionMarkIcon
            className={cn(
              'mt-px size-5 fill-current',
              getStageTextClassname(stageConfig.stage),
            )}
          />
        )}
        {stageConfig.stage !== 'NotApplicable' &&
          stageConfig.stage !== 'UnderReview' &&
          stageConfig.downgradePending && (
            <StopwatchIcon className="mt-[3px]" />
          )}
      </TooltipTrigger>
      <TooltipContent className="max-w-[360px]">
        <StageTooltip stageConfig={stageConfig} isAppchain={isAppchain} />
      </TooltipContent>
    </Tooltip>
  )
}
