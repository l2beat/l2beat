import { formatSeconds } from '@l2beat/shared-pure'

export function formatDelay(delay: number) {
  return delay ? `${formatSeconds(delay)} delay` : undefined
}

export function formatExecutionDelay(delay: number | undefined) {
  return delay ? `${formatSeconds(delay)} execution delay` : undefined
}

export function formatChallengePeriod(period: number | undefined) {
  return period ? `${formatSeconds(period)} challenge period` : undefined
}

export function formatChallengeAndExecutionDelay(delay: number | undefined) {
  return delay
    ? `${formatSeconds(delay)} challenge + execution delay`
    : undefined
}
