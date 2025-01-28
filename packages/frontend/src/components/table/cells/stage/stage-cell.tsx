import { type StageConfig } from '@l2beat/config'

import {
  StageBadge,
  getStageTextClassname,
} from '~/components/badge/stage-badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { useIsMobile } from '~/hooks/use-breakpoint'
import { InfoIcon } from '~/icons/info'
import { cn } from '~/utils/cn'
import { StageTooltip } from './stage-tooltip'

export interface StageCellProps {
  stageConfig: StageConfig
  isAppchain: boolean
}

export function StageCell({ stageConfig, isAppchain }: StageCellProps) {
  const isMobile = useIsMobile()

  if (stageConfig.stage === 'NotApplicable' || isMobile) {
    return <StageBadge stage={stageConfig.stage} isAppchain={isAppchain} />
  }

  return (
    <Tooltip>
      <TooltipTrigger className="flex gap-1">
        <StageBadge stage={stageConfig.stage} isAppchain={isAppchain} />
        {isAppchain && (
          <InfoIcon
            className={cn(
              'mt-[3px] size-4 fill-current',
              getStageTextClassname(stageConfig.stage),
            )}
          />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <StageTooltip stageConfig={stageConfig} isAppchain={isAppchain} />
      </TooltipContent>
    </Tooltip>
  )
}
