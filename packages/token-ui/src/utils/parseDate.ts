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

function parseDateString(input: string): Date | null {
  const cleaned = input
    .trim()
    .replace('(', '')
    .replace(')', '')
    .replace('+UTC', '+0')
    .replace('UTC', '0')
    .trim()

  const date = new Date(cleaned)
  if (isNaN(date.getTime())) {
    return null
  }
  return date
}
