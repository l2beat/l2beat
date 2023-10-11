import { ActivityResponse } from '../types'

export function groupAndSumActivityData(
  dataArray: ActivityResponse[],
): ActivityResponse {
  return {
    daily: {
      data: groupActivityDataByTimestamp(dataArray, 'daily'),
      types: dataArray[0].daily.types,
    },
  }
}

function groupActivityDataByTimestamp(
  responses: ActivityResponse[],
  key: keyof ActivityResponse,
) {
  const projectTpsIndex = 1
  const groupedByTimestamp = new Map<
    number,
    ActivityResponse['daily']['data'][0]
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

      groupedDataArray[projectTpsIndex] += values[projectTpsIndex]
      groupedByTimestamp.set(timestamp, groupedDataArray)
    }
  }
  return Array.from(groupedByTimestamp.values()).sort((a, b) => a[0] - b[0])
}
