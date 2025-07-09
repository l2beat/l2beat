import { pluralize } from '@l2beat/shared-pure'

export function DurationCell(props: { durationInSeconds: number }) {
  const seconds = props.durationInSeconds
  const minutes = Math.floor(props.durationInSeconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const durationText: string =
    days > 1
      ? `${days} ${pluralize(days, 'day')}`
      : hours > 0
        ? `${hours} ${pluralize(hours, 'hour')}`
        : minutes > 0
          ? `${minutes} ${pluralize(minutes, 'minute')}`
          : `${seconds} ${pluralize(seconds, 'second')}`

  const colorClassName = getDurationColorClassName(seconds)

  return <span className={colorClassName}>{durationText}</span>
}

function getDurationColorClassName(durationInSeconds: number) {
  if (durationInSeconds < 60) {
    return 'text-positive'
  }
  if (durationInSeconds < 60 * 60) {
    return ''
  }
  if (durationInSeconds < 60 * 60 * 24) {
    return 'text-yellow-700 dark:text-yellow-100'
  }
  return 'text-orange-600 dark:text-orange-500'
}
