import type { TableReadyValue } from '@l2beat/config'
import { NaBadge } from '~/components/badge/na-badge'
import { NoDataBadge } from '~/components/badge/no-data-badge'
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
  value: TableReadyValue | undefined
  emptyMode?: 'em-dash' | 'no-info' | 'n/a' | 'no-data'
}

export function TableValueCell({ value, emptyMode = 'no-info' }: Props) {
  if (!value) {
    if (emptyMode === 'em-dash') {
      return (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {EM_DASH}
        </div>
      )
    }
    if (emptyMode === 'n/a') {
      return <NaBadge />
    }
    if (emptyMode === 'no-data') {
      return <NoDataBadge />
    }
    return <NoInfoCell />
  }

  if (value.sentiment === 'UnderReview') {
    return <UnderReviewBadge />
  }

  const trigger = (
    <TwoRowCell>
      <TwoRowCell.First className="flex items-center gap-1">
        <SentimentText sentiment={value.sentiment ?? 'neutral'}>
          {value.value}
        </SentimentText>
        {value.warning && (
          <RoundedWarningIcon
            className={cn(
              'size-3.5 md:size-4',
              sentimentToFillColor(value.warning.sentiment),
            )}
          />
        )}
      </TwoRowCell.First>
      {value.secondLine && (
        <TwoRowCell.Second>{value.secondLine}</TwoRowCell.Second>
      )}
    </TwoRowCell>
  )

  if (value.description) {
    return (
      <Tooltip>
        <TooltipTrigger>{trigger}</TooltipTrigger>
        <TooltipContent>
          {value.warning && (
            <WarningBar
              className="mb-2"
              text={value.warning.value}
              icon={RoundedWarningIcon}
              color={sentimentToWarningBarColor(value.warning.sentiment)}
              ignoreMarkdown
            />
          )}
          {!!value.description ? value.description : null}
        </TooltipContent>
      </Tooltip>
    )
  }

  return trigger
}
