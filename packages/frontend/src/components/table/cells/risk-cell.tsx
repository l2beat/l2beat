import type { TableReadyValue } from '@l2beat/config'
import { EM_DASH } from '~/consts/characters'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'
import { UnderReviewBadge } from '../../badge/under-review-badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/tooltip'
import { SentimentText } from '../../sentiment-text'
import { WarningBar, sentimentToWarningBarColor } from '../../warning-bar'
import { NoInfoCell } from './no-info-cell'
import { TwoRowCell } from './two-row-cell'

interface Props {
  risk: TableReadyValue | undefined
  emptyMode?: 'em-dash' | 'no-info'
}

export function RiskCell({ risk, emptyMode = 'no-info' }: Props) {
  if (!risk) {
    if (emptyMode === 'em-dash') {
      return (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {EM_DASH}
        </div>
      )
    }
    return <NoInfoCell />
  }

  if (risk.sentiment === 'UnderReview') {
    return <UnderReviewBadge />
  }

  const trigger = (
    <TwoRowCell>
      <TwoRowCell.First className="flex items-center gap-1">
        <SentimentText sentiment={risk.sentiment ?? 'neutral'}>
          {risk.value}
        </SentimentText>
        {risk.warning && (
          <RoundedWarningIcon
            className={cn(
              'size-3.5 md:size-4',
              sentimentToFillColor(risk.warning.sentiment),
            )}
          />
        )}
      </TwoRowCell.First>
      {risk.secondLine && (
        <TwoRowCell.Second>{risk.secondLine}</TwoRowCell.Second>
      )}
    </TwoRowCell>
  )

  if (risk.description) {
    return (
      <Tooltip>
        <TooltipTrigger>{trigger}</TooltipTrigger>
        <TooltipContent>
          {risk.warning && (
            <WarningBar
              className="mb-2"
              text={risk.warning.value}
              icon={RoundedWarningIcon}
              color={sentimentToWarningBarColor(risk.warning.sentiment)}
              ignoreMarkdown
            />
          )}
          {!!risk.description ? risk.description : null}
        </TooltipContent>
      </Tooltip>
    )
  }

  return trigger
}
