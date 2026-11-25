import { formatActivityCount, formatCurrency } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { countPerSecond } from '~/server/features/layer2s/activity/utils/countPerSecond'
import { BASELINE_DAYS } from '~/server/features/utils/changeEventConstants'
import type { ChangeEvent } from '~/server/features/utils/changeEvents'

/** How one metric's change pins write their numbers. */
export interface ChangeFormat {
  /** The category's value that day against what it is compared with. */
  levels: (event: ChangeEvent) => ReactNode
  /** The change in words, e.g. "98× its usual level over the past 28 days". */
  vsBaseline: (event: ChangeEvent) => string
  /** A project's signed part of the change. */
  delta: (value: number) => string
  /** The project page section a project's row links to. */
  section: string
}

export const ACTIVITY_CHANGE_FORMAT: ChangeFormat = {
  levels: (event) => (
    <>
      <Primary>
        {formatActivityCount(countPerSecond(event.observed))}{' '}
        {event.metric === 'uops' ? 'UOPS' : 'TPS'}
      </Primary>{' '}
      vs {formatActivityCount(countPerSecond(event.baseline))} usual (past{' '}
      {BASELINE_DAYS} days)
    </>
  ),
  vsBaseline: (event) => {
    const period = `the previous ${BASELINE_DAYS} days`
    if (event.baseline <= 0) return `up from no activity in ${period}`
    const ratio = event.observed / event.baseline
    if (ratio >= 3)
      return `${Math.round(ratio)}× its usual level over ${period}`
    return `${formatPercent(ratio)} ${ratio >= 1 ? 'above' : 'below'} its usual level over ${period}`
  },
  delta: (value) =>
    `${sign(value)}${formatActivityCount(Math.abs(countPerSecond(value)))}`,
  section: 'activity',
}

export const TVS_CHANGE_FORMAT: ChangeFormat = {
  levels: (event) => (
    <>
      <Primary>{formatCurrency(event.observed, 'usd')}</Primary> vs{' '}
      {formatCurrency(event.baseline, 'usd')} the day before
    </>
  ),
  vsBaseline: (event) => {
    const ratio = event.observed / event.baseline
    return `${formatPercent(ratio)} ${ratio >= 1 ? 'up' : 'down'} on the day before`
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
