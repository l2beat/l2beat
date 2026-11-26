import { formatActivityCount, formatCurrency } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { countPerSecond } from '~/server/features/layer2s/activity/utils/countPerSecond'
import type { ChangeEvent } from './selectChangeEvents'

/** How one metric's change pins pick changes and write their numbers. */
export interface ChangeFormat {
  /** How big a change must be next to the shown series' scale around it. */
  minSize: number
  /** The category's value against what it is compared with. */
  levels: (event: ChangeEvent) => ReactNode
  /** The change in words, e.g. "46% above the usual highs before the rise". */
  vsBaseline: (event: ChangeEvent) => string
  /** A project's signed part of the change. */
  delta: (value: number) => string
  /** The project page section a project's row links to. */
  section: string
}

const USUAL_HIGHS = 'the usual highs before the rise'

export const ACTIVITY_CHANGE_FORMAT: ChangeFormat = {
  // Daily activity is noisy, so a rise must stand well clear of it.
  minSize: 0.15,
  levels: (event) => (
    <>
      <Primary>
        {formatActivityCount(countPerSecond(event.observed))}{' '}
        {event.metric === 'uops' ? 'UOPS' : 'TPS'}
      </Primary>{' '}
      vs {formatActivityCount(countPerSecond(event.baseline))}, {USUAL_HIGHS}
    </>
  ),
  vsBaseline: (event) => {
    if (event.baseline <= 0) return 'up from no activity'
    const ratio = event.observed / event.baseline
    if (ratio >= 3) return `${Math.round(ratio)}× ${USUAL_HIGHS}`
    return `${formatPercent(ratio)} above ${USUAL_HIGHS}`
  },
  delta: (value) =>
    `${sign(value)}${formatActivityCount(Math.abs(countPerSecond(value)))}`,
  section: 'activity',
}

export const TVS_CHANGE_FORMAT: ChangeFormat = {
  minSize: 0.05,
  levels: (event) => (
    <>
      <Primary>{formatCurrency(event.observed, 'usd')}</Primary> vs{' '}
      {formatCurrency(event.baseline, 'usd')} 3 days before
    </>
  ),
  vsBaseline: (event) => {
    // A category's first projects arrive from nothing.
    if (event.baseline <= 0) return 'up from zero in 3 days'
    const ratio = event.observed / event.baseline
    return `${formatPercent(ratio)} ${ratio >= 1 ? 'up' : 'down'} in 3 days`
  },
  delta: (value) => `${sign(value)}${formatCurrency(Math.abs(value), 'usd')}`,
  section: 'tvs',
}

function Primary({ children }: { children: ReactNode }) {
  return <span className="font-medium text-primary">{children}</span>
}

function sign(value: number) {
  return value > 0 ? '+' : value < 0 ? '−' : ''
}

function formatPercent(ratio: number) {
  return `${Math.round(Math.abs(ratio - 1) * 100)}%`
}
