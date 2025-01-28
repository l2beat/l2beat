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
import { StageTooltip } from '~/components/table/cells/stage/stage-tooltip'
import { useIsMobile } from '~/hooks/use-breakpoint'
import { CircleQuestionMarkIcon } from '~/icons/circle-question-mark'
import { cn } from '~/utils/cn'

export function StageStat({
  stageConfig,
  isAppchain,
  hasNotice,
}: {
  stageConfig: StageConfig
  isAppchain: boolean
  hasNotice: boolean
}) {
  const isMobile = useIsMobile()

  const content = (
    <a href="#stage">
      <StageBadge stage={stageConfig.stage} isAppchain={isAppchain} />
      {hasNotice && (
        <CircleQuestionMarkIcon
          className={cn(
            'mt-0.5 inline-block size-5 fill-current',
            getStageTextClassname(stageConfig.stage),
          )}
        />
      )}
    </a>
  )

  if (isMobile) {
    return content
  }

  return (
    <Tooltip>
      <TooltipTrigger className="relative flex gap-2">{content}</TooltipTrigger>
      <TooltipContent className="max-w-[360px]">
        <StageTooltip stageConfig={stageConfig} isAppchain={isAppchain} />
      </TooltipContent>
    </Tooltip>
  )
}
