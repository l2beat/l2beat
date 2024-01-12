import { StageConfig } from '@l2beat/config'
import React from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { StageBadge } from './StageBadge'
import { StageTooltip } from './StageTooltip'

export interface StageCellProps {
  stageConfig: StageConfig
}

export function StageCell({ stageConfig }: StageCellProps) {
  if (stageConfig.stage === 'NotApplicable') {
    return <StageBadge stage={stageConfig.stage} oneSize />
  }

  return (
    <Tooltip big disabledOnMobile>
      <TooltipTrigger>
        <StageBadge
          stage={stageConfig.stage}
          icon={
            stageConfig.stage !== 'UnderReview'
              ? stageConfig.message?.type
              : undefined
          }
          oneSize
        />
      </TooltipTrigger>
      <TooltipContent>
        <StageTooltip stageConfig={stageConfig} />
      </TooltipContent>
    </Tooltip>
  )
}
