import { formatSeconds } from '@l2beat/shared-pure'
import { DaRiskViewOptions } from './DaRiskView'

export type DaExitWindowRisk =
  | typeof NoBridge
  | typeof Immutable
  | ReturnType<typeof Eoa>
  | ReturnType<typeof LowOrNoDelay>
  | ReturnType<typeof SecurityCouncil>

const Immutable = {
  type: 'Immutable',
  value: 'Immutable',
  sentiment: 'good',
  description: 'TODO',
} as const

const NoBridge = {
  type: 'NoBridge',
  value: 'No bridge',
  sentiment: 'bad',
  description: `There is no DA bridge from the DA layer to Ethereum. As such, there is no proof that validators on the DA layer have reached consensus on the availability of the data.`,
} as const

const ONE_DAY_SECONDS = 24 * 60 * 60
const THIRTY_DAYS_SECONDS = 30 * ONE_DAY_SECONDS
const SEVEN_DAYS_SECONDS = 7 * ONE_DAY_SECONDS

function SecurityCouncil(delaySeconds: number) {
  const common = {
    type: 'SecurityCouncil',
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

function Eoa(delaySeconds: number) {
  const common = {
    type: 'Eoa',
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

function LowOrNoDelay(delaySeconds?: number) {
  const value =
    delaySeconds && delaySeconds < SEVEN_DAYS_SECONDS
      ? formatSeconds(delaySeconds)
      : 'No delay'

  return {
    type: 'LowOrNoDelay',
    value,
    sentiment: 'bad',
    description: 'There is no delay in the upgradeability of the bridge.',
  } as const
}

export const DaExitWindowRisk = {
  Eoa,
  NoBridge,
  Immutable,
  LowOrNoDelay,
  SecurityCouncil,
} satisfies DaRiskViewOptions
