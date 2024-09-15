import { formatSeconds } from '@l2beat/shared-pure'
import { DaRiskViewOptions } from './DaRiskView'

export type DaExitWindowRisk =
  | typeof NoBridge
  | typeof Immutable
  | typeof Enshrined
  | ReturnType<typeof Eoa>
  | ReturnType<typeof LowOrNoDelay>
  | ReturnType<typeof SecurityCouncil>

const Immutable = {
  type: 'Immutable',
  value: 'Immutable',
  sentiment: 'good',
  description: 'The bridge smart contract is immutable and cannot be updated.',
} as const

const NoBridge = {
  type: 'NoBridge',
  value: 'No Exit Window',
  sentiment: 'bad',
  description: `There is no DA bridge from the DA layer to Ethereum. As such, there is no proof that validators on the DA layer have reached consensus on the availability of the data, and there is no exit window for users to exit the system.`,
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
      description: `User have more than ${formatSeconds(
        delaySeconds,
      )} days to exit the system before the bridge implementation update is completed.`,
    } as const
  }

  if (delaySeconds >= SEVEN_DAYS_SECONDS) {
    return {
      ...common,
      value: `SC ${formatSeconds(delaySeconds)}`,
      sentiment: 'warning',
      description: `User have more than ${formatSeconds(
        delaySeconds,
      )} days to exit the system before the bridge implementation update is completed.`,
    } as const
  }

  return {
    ...common,
    value: `SC ${formatSeconds(delaySeconds)}`,
    sentiment: 'bad',
    description: `User have more than ${formatSeconds(
      delaySeconds,
    )} days to exit the system before the bridge implementation update is completed.`,
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
      description: `User have more than ${formatSeconds(
        delaySeconds,
      )} days to exit the system before the bridge implementation update is completed.`,
    } as const
  }

  return {
    ...common,
    value: formatSeconds(delaySeconds),
    sentiment: 'bad',
    description: `User have more than ${formatSeconds(
      delaySeconds,
    )} days to exit the system before the bridge implementation update is completed.`,
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
    description:
      'There is no delay in the upgradeability of the bridge. Users have no time to exit the system before the bridge implementation update is completed.',
  } as const
}

const Enshrined = {
  type: 'Enshrined',
  value: 'Immutable',
  sentiment: 'good',
  description:
    'Blob commitments posted to Ethereum become irreversible after the block that includes them is finalized.',
} as const

export const DaExitWindowRisk = {
  Eoa,
  NoBridge,
  Immutable,
  LowOrNoDelay,
  SecurityCouncil,
  Enshrined,
} satisfies DaRiskViewOptions
