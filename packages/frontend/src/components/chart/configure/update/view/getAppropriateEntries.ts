export function getAppropriateEntries<T>(
  days: number,
  response: {
    hourly: { data: T[] }
    sixHourly: { data: T[] }
    daily: { data: T[] }
  },
) {
  if (days <= 7) {
    return response.hourly.data.slice(-24 * days)
  } else if (days <= 90) {
    return response.sixHourly.data.slice(-4 * days)
  } else {
    return response.daily.data.slice(-days)
  }
}
