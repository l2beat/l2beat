/** True for a real calendar date in YYYY-MM-DD form. */
export function isDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }
  const parsed = Date.parse(`${value}T00:00:00Z`)
  // The round-trip rejects rolled-over dates like 2026-02-31, which
  // Date.parse silently accepts as March 3rd.
  return (
    !Number.isNaN(parsed) && new Date(parsed).toISOString().startsWith(value)
  )
}

/** True for any string Date.parse understands, e.g. an RFC 3339 timestamp. */
export function isTimestamp(value: string): boolean {
  return !Number.isNaN(Date.parse(value))
}
