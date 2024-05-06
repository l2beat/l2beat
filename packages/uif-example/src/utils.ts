export const ONE_HOUR_MS = 60 * 60 * 1000

export function msToHours(timestampOrDate: number | Date): number {
  const timestamp =
    typeof timestampOrDate === 'number'
      ? timestampOrDate
      : timestampOrDate.getTime()
  return Math.floor(timestamp / ONE_HOUR_MS)
}
