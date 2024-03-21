import { ScalingProjectRiskViewEntry } from '@l2beat/config'
import React from 'react'

import { cn } from '../../utils/cn'
import { sentimentToFillColor } from '../../utils/risks/color'
import { UnderReviewBadge } from '../badge/UnderReviewBadge'
import { UpcomingBadge } from '../badge/UpcomingBadge'
import { RoundedWarningIcon } from '../icons'
import { WarningBar } from '../project/WarningBar'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { NoInfoCell } from './NoInfoCell'
import { SentimentText } from './SentimentText'

interface Props {
  item?: ScalingProjectRiskViewEntry
}

export function RiskCell({ item }: Props) {
  if (!item) {
    return <NoInfoCell />
  }

  if (item.value === '' && item.description === 'No information available.') {
    return <UpcomingBadge />
  }

  if (item.sentiment === 'UnderReview') {
    return <UnderReviewBadge />
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex items-center gap-1">
          <SentimentText sentiment={item.sentiment}>{item.value}</SentimentText>
          {item.warning && (
            <RoundedWarningIcon
              className={cn(
                'size-5',
                sentimentToFillColor(item.warning.sentiment),
              )}
            />
          )}
        </div>

        {item.secondLine &&
          (item.secondSentiment ? (
            <SentimentText
              sentiment={item.secondSentiment}
              className="block text-xs leading-none"
            >
              {item.secondLine}
            </SentimentText>
          ) : (
            <span
              className={
                'block text-xs leading-none text-gray-550 dark:text-gray-500'
              }
            >
              {item.secondLine}
            </span>
          ))}
      </TooltipTrigger>
      <TooltipContent>
        {item.warning && (
          <WarningBar
            className="mb-2"
            text={item.warning.value}
            icon={RoundedWarningIcon}
            color={item.warning.sentiment === 'bad' ? 'red' : 'yellow'}
          />
        )}
        {item.description !== '' ? item.description : null}
      </TooltipContent>
    </Tooltip>
  )
}
