import range from 'lodash/range'

import { AggregateDetailedTvlResponse } from '../types'

export function groupAndSumTvlData(
  dataArray: AggregateDetailedTvlResponse[],
): AggregateDetailedTvlResponse {
  return {
    hourly: {
      data: groupTvlDataByTimestamp(dataArray, 'hourly'),
      types: dataArray[0].hourly.types,
    },
    sixHourly: {
      data: groupTvlDataByTimestamp(dataArray, 'sixHourly'),
      types: dataArray[0].sixHourly.types,
    },
    daily: {
      data: groupTvlDataByTimestamp(dataArray, 'daily'),
      types: dataArray[0].daily.types,
    },
  }
}

function groupTvlDataByTimestamp(
  responses: AggregateDetailedTvlResponse[],
  key: keyof AggregateDetailedTvlResponse,
) {
  const groupedByTimestamp = new Map<
    number,
    AggregateDetailedTvlResponse['daily']['data'][0]
  >()

  for (const response of responses) {
    const data = response[key].data

    for (const values of data) {
      const timestamp = values[0]
      const groupedDataArray = groupedByTimestamp.get(timestamp)

      if (!groupedDataArray) {
        groupedByTimestamp.set(timestamp, values)
        continue
      }

      for (const index of range(1, values.length)) {
        groupedDataArray[index] += values[index]
      }
      groupedByTimestamp.set(timestamp, groupedDataArray)
    }
  }

  return Array.from(groupedByTimestamp.values()).sort((a, b) => a[0] - b[0])
}
