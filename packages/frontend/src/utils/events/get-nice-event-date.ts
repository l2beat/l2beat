import { formatTimestamp } from '../dates'
import type { OneTimeEvent } from './get-one-time-events'

export function getNiceEventDate(event: OneTimeEvent) {
  const startDay = event.data.startDate.getDate()
  const startTimestamp = Math.ceil(event.data.startDate.getTime() / 1000)

  if (!event.data.endDate) {
    return formatTimestamp(startTimestamp, { mode: 'datetime' })
  }

  const endDay = event.data.endDate.getDate()
  const endTimestamp = Math.ceil(event.data.endDate.getTime() / 1000)

  if (startDay === endDay) {
    return `${formatTimestamp(startTimestamp, {
      mode: 'date',
    })}\n${formatTimestamp(startTimestamp, { mode: 'time' }).slice(
      0,
      -6,
    )} - ${formatTimestamp(endTimestamp, { mode: 'time' })}`
  }

  return `${formatTimestamp(startTimestamp)} - ${formatTimestamp(endTimestamp)}`
}
