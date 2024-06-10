import { formatSeconds } from '@l2beat/shared-pure'
import { DaRiskViewOptions } from './DaRiskView'

export type DaExitWindowRisk =
  | typeof IMMUTABLE
  | ReturnType<typeof LOW_OR_NO_DELAY>
  | ReturnType<typeof SECURITY_COUNCIL>
  | ReturnType<typeof EOA>

const IMMUTABLE = {
  type: 'IMMUTABLE',
  value: 'Immutable',
  sentiment: 'good',
  description: 'TODO',
} as const

const ONE_DAY_SECONDS = 24 * 60 * 60
const THIRTY_DAYS_SECONDS = 30 * ONE_DAY_SECONDS
const SEVEN_DAYS_SECONDS = 7 * ONE_DAY_SECONDS

function SECURITY_COUNCIL(delaySeconds: number) {
  const common = {
    type: 'SECURITY_COUNCIL',
  } as const

  if (delaySeconds >= THIRTY_DAYS_SECONDS) {
    return {
      ...common,
      value: formatSeconds(delaySeconds),
      sentiment: 'good',
      description: 'TODO',
    } as const
  }

  if (delaySeconds >= SEVEN_DAYS_SECONDS) {
    return {
      ...common,
      value: `SC ${formatSeconds(delaySeconds)}`,
      sentiment: 'warning',
      description: 'TODO',
    } as const
  }

  return {
    ...common,
    value: `SC ${formatSeconds(delaySeconds)}`,
    sentiment: 'bad',
    description: 'TODO',
  } as const
}

function EOA(delaySeconds: number) {
  const common = {
    type: 'EOA',
  } as const

  if (delaySeconds >= SEVEN_DAYS_SECONDS) {
    return {
      ...common,
      value: formatSeconds(delaySeconds),
      sentiment: 'warning',
      description: 'TODO',
    } as const
  }

  return {
    ...common,
    value: formatSeconds(delaySeconds),
    sentiment: 'bad',
    description: 'TODO',
  } as const
}

function LOW_OR_NO_DELAY(delaySeconds?: number) {
  const value =
    delaySeconds && delaySeconds < SEVEN_DAYS_SECONDS
      ? formatSeconds(delaySeconds)
      : 'No delay'

  return {
    type: 'LOW_OR_NO_DELAY',
    value,
    sentiment: 'bad',
    description: 'TODO',
  } as const
}

export const DaExitWindowRisk = {
  IMMUTABLE,
  SECURITY_COUNCIL,
  EOA,
  LOW_OR_NO_DELAY,
} satisfies DaRiskViewOptions
