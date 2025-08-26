import { formatSeconds } from '@l2beat/shared-pure'
import type { TableReadyValue } from '../types'

const Immutable: TableReadyValue = {
  value: 'Immutable',
  sentiment: 'good',
  description: 'The bridge smart contract is immutable and cannot be updated.',
}

const ImmutableNoSecurity: TableReadyValue = {
  value: 'Immutable',
  sentiment: 'bad',
  description:
    'The bridge smart contract is immutable and cannot be updated. The bridge committee security is low and cannot be improved.',
}

const ONE_DAY_SECONDS = 24 * 60 * 60
const THIRTY_DAYS_SECONDS = 30 * ONE_DAY_SECONDS
const SEVEN_DAYS_SECONDS = 7 * ONE_DAY_SECONDS

function SecurityCouncil(delaySeconds: number): TableReadyValue {
  const common = {}

  if (delaySeconds >= THIRTY_DAYS_SECONDS) {
    return {
      ...common,
      value: formatSeconds(delaySeconds),
      sentiment: 'good',
      description: `Users have more than ${formatSeconds(
        delaySeconds,
      )} days to exit the system before the bridge implementation update is completed.`,
    }
  }

  if (delaySeconds >= SEVEN_DAYS_SECONDS) {
    return {
      ...common,
      value: `${formatSeconds(delaySeconds)}`,
      sentiment: 'warning',
      description: `For regular updates, there is a ${formatSeconds(
        delaySeconds,
      )} delay before the bridge implementation update is completed. The Security Council can upgrade the DA bridge without delay.`,
    }
  }

  return {
    ...common,
    value: `SC ${formatSeconds(delaySeconds)}`,
    sentiment: 'bad',
    description: `Users have more than ${formatSeconds(
      delaySeconds,
    )} days to exit the system before the bridge implementation update is completed.`,
  }
}

function Eoa(delaySeconds: number): TableReadyValue {
  const common = {}

  if (delaySeconds >= SEVEN_DAYS_SECONDS) {
    return {
      ...common,
      value: formatSeconds(delaySeconds),
      sentiment: 'warning',
      description: `Users have more than ${formatSeconds(
        delaySeconds,
      )} days to exit the system before the bridge implementation update is completed.`,
    }
  }

  return {
    ...common,
    value: formatSeconds(delaySeconds),
    sentiment: 'bad',
    description: `Users have more than ${formatSeconds(
      delaySeconds,
    )} days to exit the system before the bridge implementation update is completed.`,
  }
}

function LowOrNoDelay(delaySeconds?: number): TableReadyValue {
  const value =
    delaySeconds && delaySeconds < SEVEN_DAYS_SECONDS
      ? formatSeconds(delaySeconds)
      : 'No delay'

  return {
    value,
    sentiment: 'bad',
    description:
      'There is no delay in the upgradeability of the bridge. Users have no time to exit the system before the bridge implementation update is completed.',
  }
}

export const DaUpgradeabilityRisk = {
  Eoa,
  Immutable,
  ImmutableNoSecurity,
  LowOrNoDelay,
  SecurityCouncil,
}
