import { type StageConfig } from '@l2beat/config'
import React from 'react'

import { StageBadge } from '~/app/_components/badge/stage-badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import { StageTooltip } from './stage-tooltip'

export interface StageCellProps {
  stageConfig: StageConfig
}

export function StageCell({ stageConfig }: StageCellProps) {
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'mobile'

  if (stageConfig.stage === 'NotApplicable') {
    return <StageBadge stage={stageConfig.stage} oneSize />
  }

  if (isMobile) {
    return (
      <StageBadge
        stage={stageConfig.stage}
        icon={
          stageConfig.stage !== 'UnderReview'
            ? stageConfig.message?.type
            : undefined
        }
        oneSize
      />
    )
  }

  return (
    <Tooltip>
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
