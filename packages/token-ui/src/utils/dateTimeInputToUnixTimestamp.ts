import { UnixTime } from './UnixTime'

export function dateTimeInputToUnixTimestamp(dateTimeInput: string) {
  const date = new Date(dateTimeInput)

  return UnixTime.fromDate(
    new Date(date.getTime() - date.getTimezoneOffset() * 60000),
  )
}
