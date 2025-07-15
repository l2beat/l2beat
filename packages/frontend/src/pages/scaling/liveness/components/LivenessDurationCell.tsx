import { pluralize, UnixTime } from '@l2beat/shared-pure'

export function LivenessDurationCell(props: { durationInSeconds: number }) {
  const seconds = props.durationInSeconds
  const minutes = Math.floor(props.durationInSeconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const remainingMinutes = minutes - hours * 60
  const remainingHours = hours - days * 24

  const durationText: string =
    days > 1
      ? `${getDurationText(days, 'day')} ${getDurationText(remainingHours, 'hour')}`
      : hours > 0
        ? `${getDurationText(hours, 'hour')} ${getDurationText(remainingMinutes, 'minute')}`
        : minutes > 0
          ? `${getDurationText(minutes, 'minute')}`
          : `${seconds} ${pluralize(seconds, 'second')}`

  const colorClassName = getDurationColorClassName(seconds)

  return <span className={colorClassName}>{durationText}</span>
}

function getDurationText(
  amount: number,
  unit: 'day' | 'hour' | 'minute' | 'second',
) {
  return amount > 0 ? `${amount} ${pluralize(amount, unit)}` : ''
}

export function getDurationColorClassName(durationInSeconds: number) {
  if (durationInSeconds < UnixTime.MINUTE) {
    return 'text-positive'
  }
  if (durationInSeconds < UnixTime.HOUR) {
    return ''
  }
  if (durationInSeconds < UnixTime.DAY) {
    return 'text-yellow-700 dark:text-yellow-100'
  }
  return 'text-orange-600 dark:text-orange-500'
}
