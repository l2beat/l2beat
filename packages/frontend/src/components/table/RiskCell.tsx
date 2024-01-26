import { ScalingProjectRiskViewEntry } from '@l2beat/config'
import React from 'react'

import { cn } from '../../utils/cn'
import {
  sentimentToFillColor,
  sentimentToTextColor,
} from '../../utils/risks/color'
import { UnderReviewBadge } from '../badge/UnderReviewBadge'
import { UpcomingBadge } from '../badge/UpcomingBadge'
import { RoundedWarningIcon } from '../icons'
import { WarningBar } from '../project/WarningBar'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { NoInfoCell } from './NoInfoCell'

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
        <span
          className={cn(
            'flex items-center gap-1 font-medium',
            sentimentToTextColor(item.sentiment),
          )}
        >
          {item.value}
          {item.warning && (
            <RoundedWarningIcon
              className={cn(
                'size-5',
                sentimentToFillColor(item.warning.sentiment),
              )}
            />
          )}
        </span>
        {item.secondLine && (
          <span
            className={cn(
              'block text-xs leading-none',
              item.secondSentiment
                ? sentimentToTextColor(item.secondSentiment)
                : 'text-gray-550 dark:text-gray-500',
            )}
          >
            {item.secondLine}
          </span>
        )}
      </TooltipTrigger>
      <TooltipContent>
        {item.warning && (
          <WarningBar
            className="mb-2"
            text={item.warning.text}
            icon={RoundedWarningIcon}
            color={item.warning.sentiment === 'bad' ? 'red' : 'yellow'}
          />
        )}
        {item.description !== '' ? item.description : null}
      </TooltipContent>
    </Tooltip>
  )
}
