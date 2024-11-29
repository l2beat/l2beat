import { formatSeconds } from '@l2beat/shared-pure'

export function formatDelay(delay: number) {
  return delay ? `${formatSeconds(delay)} delay` : undefined
}

export function formatExecutionDelay(delay: number) {
  return delay ? `${formatSeconds(delay)} execution delay` : undefined
}

export function formatChallengePeriod(period: number) {
  return period ? `${formatSeconds(period)} challenge period` : undefined
}
