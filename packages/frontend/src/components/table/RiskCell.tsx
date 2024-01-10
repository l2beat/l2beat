import { ScalingProjectRiskViewEntry } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { sentimentToTextColor } from '../../utils/risks/color'
import { UnderReviewBadge } from '../badge/UnderReviewBadge'
import { UpcomingBadge } from '../badge/UpcomingBadge'
import { RoundedWarningIcon } from '../icons'
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
    <div
      className={cx(item.description !== '' && 'Tooltip')}
      title={item.description !== '' ? item.description : undefined}
    >
      <span
        className={cx(
          'flex items-center gap-1 font-medium',
          sentimentToTextColor(item.sentiment),
        )}
      >
        {item.value}
        {item.showWarning && (
          <RoundedWarningIcon className="inline h-4 w-4 fill-current" />
        )}
      </span>
      {item.secondLine && (
        <span
          className={cx(
            'block text-xs leading-none',
            item.secondSentiment
              ? sentimentToTextColor(item.secondSentiment)
              : 'text-gray-550 dark:text-gray-500',
          )}
        >
          {item.secondLine}
        </span>
      )}
    </div>
  )
}
