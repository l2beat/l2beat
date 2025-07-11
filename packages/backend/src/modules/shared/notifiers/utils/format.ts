import { pluralize, type TrackedTxsConfigSubtype } from '@l2beat/shared-pure'

export function formatSubtype(subtype: TrackedTxsConfigSubtype): string {
  switch (subtype) {
    case 'batchSubmissions':
      return 'batch submissions'
    case 'stateUpdates':
      return 'state updates'
    case 'proofSubmissions':
      return 'proof submissions'
    default:
      return subtype
  }
}

export function formatDuration(duration: number): string {
  const seconds = Math.floor(duration)
  const minutes = Math.floor(duration / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const remainingMinutes = minutes - hours * 60
  const remainingHours = hours - days * 24

  return days > 1
    ? `${getDurationText(days, 'day')} ${getDurationText(remainingHours, 'hour')}`
    : hours > 0
      ? `${getDurationText(hours, 'hour')} ${getDurationText(remainingMinutes, 'minute')}`
      : minutes > 0
        ? `${getDurationText(minutes, 'minute')}`
        : `${seconds} ${pluralize(seconds, 'second')}`
}

function getDurationText(
  amount: number,
  unit: 'day' | 'hour' | 'minute' | 'second',
) {
  return amount > 0 ? `${amount} ${pluralize(amount, unit)}` : ''
}
