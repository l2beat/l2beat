import { formatSeconds } from '@l2beat/shared-pure'

export function formatDelay(delay: number) {
  return `${formatSeconds(delay)} delay`
}

export function formatExecutionDelay(delay: number | undefined) {
  if (delay === undefined) return undefined
  if (delay === 0) return 'No execution delay'
  return `${formatSeconds(delay)} execution delay`
}

export function formatChallengePeriod(period: number | undefined) {
  if (period === undefined) return undefined
  if (period === 0) return 'No challenge period'
  return `${formatSeconds(period)} challenge period`
}

export function formatChallengeAndExecutionDelay(delay: number | undefined) {
  if (delay === undefined) return undefined
  if (delay === 0) return 'No challenge + execution delay'
  return `${formatSeconds(delay)} challenge + execution delay`
}
