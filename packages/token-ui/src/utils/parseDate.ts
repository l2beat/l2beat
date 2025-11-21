/**
 * Parses a date string in the format "(Aug-18-2023 06:36:29 PM +UTC)"
 * and converts it to datetime-local format (YYYY-MM-DDTHH:mm:ss)
 */
export function parseDateTimePaste(input: string): string | null {
  const date = parseDateString(input)
  return date?.toISOString().slice(0, -5) ?? null
}

/**
 * Parses a date string in the format "(Aug-18-2023 06:36:29 PM +UTC)"
 * and converts it to date format (YYYY-MM-DD)
 */
export function parseDatePaste(input: string): string | null {
  const date = parseDateString(input)
  return date?.toISOString().slice(0, 10) ?? null
}

export function parseDateString(input: string): Date | null {
  const parsers = [
    parseEtherscanTimestamp,
    parseUnixTimestampInSeconds,
    parseUnixTimestampInMilliseconds,
  ]

  for (const parser of parsers) {
    const date = parser(input.trim())
    if (date) {
      return date
    }
  }
  return null
}

export function parseEtherscanTimestamp(input: string) {
  const cleaned = input
    .replace('(', '')
    .replace(')', '')
    .replace('+UTC', '+0')
    .replace('UTC', '0')
    .trim()

  const date = new Date(cleaned)
  if (isNaN(date.getTime())) {
    return
  }
  return date
}

export function parseUnixTimestampInSeconds(input: string): Date | undefined {
  // Unix timestamps in seconds are exactly 10 digits
  if (input.length !== 10) {
    return
  }

  const timestamp = Number(input)
  if (isNaN(timestamp)) {
    return
  }

  const date = new Date(timestamp * 1000)
  if (isNaN(date.getTime())) {
    return
  }
  return date
}

export function parseUnixTimestampInMilliseconds(
  input: string,
): Date | undefined {
  // Unix timestamps in milliseconds are 12+ digits
  if (input.length < 12) {
    return
  }

  const timestamp = Number(input)
  if (isNaN(timestamp)) {
    return
  }

  const date = new Date(timestamp)
  if (isNaN(date.getTime())) {
    return
  }
  return date
}
