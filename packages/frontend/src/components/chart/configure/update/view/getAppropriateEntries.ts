import { AggregateTvlResponse, TokenTvlResponse } from '../../state/State'

export function getAppropriateEntries(
  days: number,
  response: AggregateTvlResponse | TokenTvlResponse,
) {
  if (days <= 7) {
    return response.hourly.data.slice(-24 * days)
  } else if (days <= 90) {
    return response.sixHourly.data.slice(-4 * days)
  } else {
    const firstNonZero = response.daily.data.findIndex((p) => p[1] > 0)
    if (firstNonZero === -1) {
      // TODO: filter out tokens for which this is the case on the backend
      return response.daily.data.slice(-days)
    }
    return response.daily.data.slice(firstNonZero).slice(-days)
  }
}
