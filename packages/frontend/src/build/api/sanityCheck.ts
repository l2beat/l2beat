import {
  bridges as allBridges,
  layer2s as allLayer2s,
  layer3s as allLayer3s,
} from '@l2beat/config'
import {
  ActivityApiCharts,
  ActivityApiChartsWithEstimation,
  ActivityApiResponse,
  ProjectId,
  TvlApiCharts,
  TvlApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'

const bridges = allBridges
  .filter((x) => !x.isUpcoming)
  .filter((x) => !x.isArchived)
const layer2s = allLayer2s
  .filter((x) => !x.isUpcoming)
  .filter((x) => !x.isArchived)
const layer3s = allLayer3s.filter((x) => !x.isUpcoming)

export type TvlProjectData = [string, TvlApiCharts]

export function tvlSanityCheck(tvlApiResponse: TvlApiResponse) {
  const projectsInApi = Object.keys(tvlApiResponse.projects).map(ProjectId)

  const bridgesInApi = bridges.filter((x) => projectsInApi.includes(x.id))
  const layer2sInApi = layer2s.filter((x) => projectsInApi.includes(x.id))

  if (layer2sInApi.length / layer2s.length < 0.8) {
    throw new Error(
      'The API has returned an insufficient number of layer2s tvl',
    )
  }

  if (bridgesInApi.length / bridges.length < 0.8) {
    throw new Error(
      'The API has returned an insufficient number of bridges tvl',
    )
  }

  const ids = [...bridgesInApi, ...layer2sInApi]
    .filter((x) => !x.isUpcoming)
    .map((x) => x.id.toString())

  const allProjects = [
    ['bridges', tvlApiResponse.bridges],
    ['layer2s', tvlApiResponse.layers2s],
    ['combined', tvlApiResponse.combined],
    ...Object.entries(tvlApiResponse.projects)
      .filter(([id]) => ids.includes(id))
      .map(([id, project]) => [id, project?.charts] as const),
  ] as TvlProjectData[]

  checkIfEmptyTvlCharts(allProjects)
  checkIfDelayedTvl(allProjects, UnixTime.now())
}

export function checkIfEmptyTvlCharts(allProjects: TvlProjectData[]) {
  const emptyCharts = allProjects
    .map(([name, x]) => [name, [x.daily, x.sixHourly, x.hourly]] as const)
    .filter(([_, x]) => x.some((x) => x.data.length === 0))

  if (emptyCharts.length > 0) {
    throw new Error(
      `The API has returned some empty tvl charts! ${emptyCharts
        .map(([name]) => name)
        .join(', ')}`,
    )
  }
}

const TVL_ACCEPTABLE_DELAY = UnixTime.HOUR * 4

export function checkIfDelayedTvl(
  allProjects: TvlProjectData[],
  now: UnixTime,
) {
  const delayedProjects = allProjects
    .map(([name, charts]) => {
      // biome-ignore lint/style/noNonNullAssertion: we know it's there
      const lastValue = charts.hourly.data.at(-1)!
      const lastTimestamp = lastValue[0].toNumber()
      const delay = now.toNumber() - lastTimestamp
      return { name, delay }
    })
    .filter(({ delay }) => delay > TVL_ACCEPTABLE_DELAY)

  if (delayedProjects.length > 0) {
    throw new Error(
      `Some projects tvl data is delayed! ${delayedProjects
        .map(({ name, delay }) => `${name} (${delay} seconds)`)
        .join(', ')}. Acceptable delay is ${TVL_ACCEPTABLE_DELAY} seconds.`,
    )
  }
}

export type ActivityProjectData = [string, ActivityApiCharts]

export function activitySanityCheck(activityApiResponse: ActivityApiResponse) {
  const projectsInApiResponse = Object.keys(activityApiResponse.projects).map(
    ProjectId,
  )
  const layer2sInApiActivity = layer2s.filter((x) =>
    projectsInApiResponse.includes(x.id),
  )
  const layer3sInApiActivity = layer3s.filter((x) =>
    projectsInApiResponse.includes(x.id),
  )
  const projectsInApiActivity = [
    ...layer2sInApiActivity,
    ...layer3sInApiActivity,
  ]

  const activityIds = projectsInApiActivity.map((x) => x.id.toString())
  const filteredProjectsCharts = Object.entries(
    activityApiResponse.projects,
  ).filter(([id]) => activityIds.includes(id))

  const allProjects = [
    ['combined', activityApiResponse.combined],
    ...filteredProjectsCharts,
  ] as [string, ActivityApiCharts][]
  const allProjectsData = allProjects.map(
    ([name, chart]) => [name, chart] as ActivityProjectData,
  )

  const importantProjects = ['dydx', 'arbitrum', 'optimism', 'starknet']

  checkIfEmptyActivityCharts(allProjectsData)
  checkIfZeroTpsProjects(allProjectsData, importantProjects)
  checkIfDelayedActivity(activityApiResponse.combined, UnixTime.now())
}

export function checkIfEmptyActivityCharts(allProjects: ActivityProjectData[]) {
  const emptyActivityCharts = allProjects.filter(
    ([_, data]) => data.daily.data.length === 0,
  )
  if (emptyActivityCharts.length > 0) {
    throw new Error(
      `The API has returned some empty activity charts! ${emptyActivityCharts
        .map(([name]) => name)
        .join(', ')}`,
    )
  }
}

export function checkIfZeroTpsProjects(
  allProjects: ActivityProjectData[],
  importantProjects: string[],
) {
  const importantProjectMissing = importantProjects.filter(
    (important) => !allProjects.some((project) => important === project[0]),
  )

  if (importantProjectMissing.length > 0) {
    throw new Error(
      `Some important projects missing in activity response! ${importantProjectMissing.join(
        ', ',
      )}`,
    )
  }

  const zeroTpsProjects = allProjects
    .filter(([name]) => importantProjects.includes(name))
    .map(([name, data]) => {
      // can we assume here that data is always sorted?
      // biome-ignore lint/style/noNonNullAssertion: we know it's there
      return [name, data.daily.data.at(-1)!] as const
    })
    .filter(([_, lastValue]) => lastValue[1] === 0)

  if (zeroTpsProjects.length > 0) {
    throw new Error(
      `Some projects have 0 TPS! ${zeroTpsProjects
        .map(([name]) => name)
        .join(', ')}`,
    )
  }
}

// the activity data is delayed by max 2 days
// we cannot summarize the day until the day finishes
// so we're left with yesterday until after midnight
// when we have 1 hour of clock delay window
// we add 1 hour more to be safe
const ACTIVITY_ACCEPTABLE_DELAY = UnixTime.DAY * 2 + 2 * UnixTime.HOUR

export function checkIfDelayedActivity(
  response: ActivityApiChartsWithEstimation,
  now: UnixTime,
) {
  // biome-ignore lint/style/noNonNullAssertion: even if it's not there we want to fail
  const lastValue = response.daily.data.at(-1)!
  const lastTimestamp = lastValue[0]
  const delay = now.toNumber() - lastTimestamp.toNumber()

  if (delay > ACTIVITY_ACCEPTABLE_DELAY) {
    throw new Error(
      `Combined activity data is delayed! ${delay} seconds. Acceptable delay is ${ACTIVITY_ACCEPTABLE_DELAY} seconds.`,
    )
  }
}
