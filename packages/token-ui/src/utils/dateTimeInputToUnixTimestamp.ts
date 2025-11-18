import { UnixTime } from '@l2beat/shared-pure'

export function dateTimeInputToUnixTimestamp(dateTimeInput: string) {
  const date = new Date(dateTimeInput)

  return UnixTime.fromDate(
    new Date(date.getTime() - date.getTimezoneOffset() * 60000),
  )
}
