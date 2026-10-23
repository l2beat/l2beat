import { UnixTime } from '@l2beat/shared-pure'

/**
 * When an audit report of the audit dataset was published, as midnight UTC.
 * Dataset dates are ISO days. An undated report falls back to the year and
 * month its id ends with, e.g. `consensys-umbra-2021-03`; anything else is
 * treated as undated.
 */
export function parseReportDate(
  reportDate: string | null | undefined,
  id?: string,
): UnixTime | undefined {
  const date = reportDate ?? id?.match(/(\d{4}-\d{2}(?:-\d{2})?)$/)?.[1]
  if (!date) return undefined
  const ms = Date.parse(date)
  return Number.isNaN(ms) ? undefined : UnixTime(Math.floor(ms / 1000))
}
