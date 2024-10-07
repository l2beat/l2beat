import {
  type Sentiment,
  type WarningValueWithSentiment,
} from '@l2beat/shared-pure'
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
import { WarningBar } from '../../warning-bar'
import { NoInfoCell } from './no-info-cell'

interface Risk {
  value: string
  sentiment: Sentiment
  description?: string
  warning?: WarningValueWithSentiment
  secondLine?: string
}

interface Props {
  risk: Risk | undefined
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
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <SentimentText sentiment={risk.sentiment}>{risk.value}</SentimentText>
        {risk.warning && (
          <RoundedWarningIcon
            className={cn(
              'size-4 md:size-5',
              sentimentToFillColor(risk.warning.sentiment),
            )}
          />
        )}
      </div>
      {risk.secondLine && (
        <span
          className={
            '-mt-1 mb-1 text-2xs text-gray-550 dark:text-gray-500 md:m-0 md:text-xs md:leading-none'
          }
        >
          {risk.secondLine}
        </span>
      )}
    </div>
  )

  if (risk.description) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent>
          {risk.warning && (
            <WarningBar
              className="mb-2"
              text={risk.warning.value}
              icon={RoundedWarningIcon}
              color={risk.warning.sentiment === 'bad' ? 'red' : 'yellow'}
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
