import type { TableReadyValue } from '@l2beat/config'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { UpcomingBadge } from '~/components/badge/UpcomingBadge'
import { EM_DASH } from '~/consts/characters'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'
import { UnderReviewBadge } from '../../badge/UnderReviewBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/Tooltip'
import { SentimentText } from '../../SentimentText'
import { sentimentToWarningBarColor, WarningBar } from '../../WarningBar'
import { TableLink } from '../TableLink'
import { NoInfoCell } from './NoInfoCell'
import { TwoRowCell } from './TwoRowCell'

interface Props {
  value: TableReadyValue | undefined
  href?: string
  emptyMode?: 'em-dash' | 'no-info' | 'n/a' | 'no-data' | 'upcoming'
}

export function TableValueCell({ value, href, emptyMode = 'no-info' }: Props) {
  if (!value) {
    if (emptyMode === 'em-dash') {
      return (
        <div className="text-gray-500 text-xs dark:text-gray-400">
          {EM_DASH}
        </div>
      )
    }
    if (emptyMode === 'n/a') {
      return <NotApplicableBadge />
    }
    if (emptyMode === 'no-data') {
      return <NoDataBadge />
    }
    if (emptyMode === 'upcoming') {
      return <UpcomingBadge />
    }
    return <NoInfoCell />
  }

  if (value.sentiment === 'UnderReview') {
    return <UnderReviewBadge />
  }

  const trigger = (
    <TableLink href={href}>
      <TwoRowCell>
        <TwoRowCell.First className="flex items-center gap-1">
          <SentimentText
            sentiment={value.sentiment ?? 'neutral'}
            className="font-medium"
          >
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
    </TableLink>
  )

  if (value.description) {
    return (
      <Tooltip>
        <TooltipTrigger disabledOnMobile className="h-[inherit]">
          {trigger}
        </TooltipTrigger>
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
          {value.description ? value.description : null}
        </TooltipContent>
      </Tooltip>
    )
  }

  return trigger
}
