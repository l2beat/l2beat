import { ActivityResponse } from '../../types'

export function getScalingFactor(data: ActivityResponse): string {
  const projectsWeeklyCount = data.daily.data
    .slice(-7)
    .map((x) => x[1])
    .reduce((a, b) => a + b, 0)

  const ethereumWeeklyCount = data.daily.data
    .slice(-7)
    .map((x) => x[2])
    .reduce((a, b) => a + b, 0)

  if (!projectsWeeklyCount || !ethereumWeeklyCount) {
    return ''
  }

  const result =
    (projectsWeeklyCount + ethereumWeeklyCount) / ethereumWeeklyCount

  return result.toFixed(2) + 'x'
}
