import { formatSeconds } from '@l2beat/shared-pure'
import type { PrivacyExitWindow, PrivacySummaryValue } from '../types'

type ExitWindowValue = Pick<
  PrivacyExitWindow,
  'value' | 'sentiment' | 'orderHint'
>

const DAY = 86_400

/** A delay is green from the first and red under the second. The methodology prints both. */
export const PRIVACY_EXIT_WINDOW_DAYS = { green: 30, yellow: 7 } as const

/**
 * The exit window column: the time users have to withdraw before a malicious
 * upgrade takes effect. A project adds its description and walkaway test.
 */
export const PRIVACY_EXIT_WINDOW = {
  infinite: {
    value: 'Infinite',
    sentiment: 'good',
    orderHint: Number.MAX_SAFE_INTEGER,
  },
  none: { value: 'None', sentiment: 'bad', orderHint: 0 },
  delay: (seconds: number): ExitWindowValue => ({
    value: formatSeconds(seconds),
    sentiment:
      seconds >= PRIVACY_EXIT_WINDOW_DAYS.green * DAY
        ? 'good'
        : seconds >= PRIVACY_EXIT_WINDOW_DAYS.yellow * DAY
          ? 'warning'
          : 'bad',
    orderHint: seconds,
  }),
} as const satisfies Record<
  string,
  ExitWindowValue | ((seconds: number) => ExitWindowValue)
>

/** The reproducibility column. A project adds its description. */
export const PRIVACY_REPRODUCIBILITY = {
  full: { value: 'Reproducible', sentiment: 'good' },
  partial: { value: 'Partially reproducible', sentiment: 'warning' },
} as const satisfies Record<
  string,
  Pick<PrivacySummaryValue, 'value' | 'sentiment'>
>
