import { formatSeconds } from '@l2beat/shared-pure'
import type { DaRiskViewOptions } from './DaRiskView'

export type DaUpgradeabilityRisk =
  | typeof NoBridge
  | typeof Immutable
  | typeof ImmutableNoSecurity
  | ReturnType<typeof Eoa>
  | ReturnType<typeof LowOrNoDelay>
  | ReturnType<typeof SecurityCouncil>

const Immutable = {
  type: 'Immutable',
  value: 'Immutable',
  sentiment: 'good',
  description: 'The bridge smart contract is immutable and cannot be updated.',
} as const

const ImmutableNoSecurity = {
  type: 'Immutable',
  value: 'Immutable',
  sentiment: 'bad',
  description:
    'The bridge smart contract is immutable and cannot be updated. The bridge committee security is low and cannot be improved.',
} as const

const NoBridge = {
  type: 'NoBridge',
  value: 'N/A',
  sentiment: 'bad',
  description: `Without the bridge, users cannot react in time to malicious actions by the sequencer.`,
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
      value: `${formatSeconds(delaySeconds)}`,
      sentiment: 'warning',
      description: `For regular updates, there is a ${formatSeconds(
        delaySeconds,
      )} delay before the bridge implementation update is completed. The Security Council can upgrade the DA bridge without delay.`,
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

export const DaUpgradeabilityRisk = {
  Eoa,
  NoBridge,
  Immutable,
  ImmutableNoSecurity,
  LowOrNoDelay,
  SecurityCouncil,
} satisfies DaRiskViewOptions
