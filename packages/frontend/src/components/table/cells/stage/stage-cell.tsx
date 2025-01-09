import { type StageConfig } from '@l2beat/config'

import { StageBadge } from '~/components/badge/stage-badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { useIsMobile } from '~/hooks/use-breakpoint'
import { StageTooltip } from './stage-tooltip'

export interface StageCellProps {
  stageConfig: StageConfig
}

export function StageCell({ stageConfig }: StageCellProps) {
  const isMobile = useIsMobile()

  if (stageConfig.stage === 'NotApplicable' || isMobile) {
    return <StageBadge stage={stageConfig.stage} />
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <StageBadge stage={stageConfig.stage} />
      </TooltipTrigger>
      <TooltipContent>
        <StageTooltip stageConfig={stageConfig} />
      </TooltipContent>
    </Tooltip>
  )
}
