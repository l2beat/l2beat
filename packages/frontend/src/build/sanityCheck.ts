import { bridges, layer2s } from "@l2beat/config"
import { ActivityApiChart, ActivityApiResponse, ProjectId, TvlApiResponse, UnixTime } from "@l2beat/shared"

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
    tvlApiResponse.bridges,
    tvlApiResponse.layers2s,
    tvlApiResponse.combined,
    ...Object.entries(tvlApiResponse.projects)
      .filter(([id]) => ids.includes(id))
      .map(([, project]) => project?.charts),
  ]

  const emptyChartsExist = allProjects
    .flatMap((x) => [x?.daily, x?.sixHourly, x?.hourly])
    .some((x) => x?.data.length === 0)

  if (emptyChartsExist) {
    throw new Error('The API has returned some empty tvl charts')
  }

  const now = UnixTime.now()
  const acceptableDelay = UnixTime.HOUR * 4
  const delayedProjects = allProjects.filter((x) => {
    if (!x) {
      return false
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const lastValue = x.hourly.data.at(-1)!
    const lastTimestamp = lastValue[0].toNumber()
    const delay = now.toNumber() - lastTimestamp
    return delay > acceptableDelay
  })

  if (delayedProjects.length > 0) {
    throw new Error(
      `Some projects tvl data is delayed! Acceptable delay is ${acceptableDelay} seconds.`,
    )
  }
}

export function activitySanityCheck(activityApiResponse: ActivityApiResponse) {
  const projectsInApiActivity = Object.keys(activityApiResponse.projects).map(
    ProjectId,
  )
  const layer2sInApiActivity = layer2s.filter((x) =>
    projectsInApiActivity.includes(x.id),
  )

  if (layer2sInApiActivity.length / layer2s.length < 0.4) {
    throw new Error(
      'The API has returned an insufficient number of layer2s activity',
    )
  }

  const activityIds = layer2sInApiActivity.map((x) => x.id.toString())
  const emptyActivityChartsExist = [
    activityApiResponse.combined,
    activityApiResponse.ethereum,
    ...Object.entries(activityApiResponse.projects)
      .filter(([id]) => activityIds.includes(id))
      .map(([, project]) => project),
  ].some((x) => x?.data.length === 0)
  if (emptyActivityChartsExist) {
    throw new Error('The API has returned some empty activity charts')
  }

  const importantProjects = [
    'ethereum',
    'dydx',
    'arbitrum',
    // 'immutablex',
    'optimism',
    // 'sorare',
    'starknet',
  ]
  const allProjects = [
    ['ethereum', activityApiResponse.ethereum],
    ...Object.entries(activityApiResponse.projects),
  ] as [string, ActivityApiChart][]
  const zeroTpsProjects = allProjects
    .filter(([name]) => importantProjects.includes(name))
    .map(([name, data]) => {
      // can we assume here that data is always sorted?
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return [name, data.data.at(-1)!] as const
    })
    .filter(([_, lastValue]) => lastValue[1] === 0)

  if (zeroTpsProjects.length > 0) {
    throw new Error(
      `Some projects have 0 TPS! ${zeroTpsProjects
        .map((v) => v[0])
        .join(', ')}`,
    )
  }

  const now = UnixTime.now()
  const acceptableDelay = UnixTime.DAY * 2 + UnixTime.HOUR
  const delayedProjects = allProjects
    .map(([name, data]) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const lastValue = data.data.at(-1)!
      const lastTimestamp = lastValue[0]
      const delay = now.toNumber() - lastTimestamp.toNumber()
      return { name, delay }
    })
    .filter(({ delay }) => delay > acceptableDelay)

  if (delayedProjects.length > 0) {
    throw new Error(
      `Some projects activity data is delayed! ${delayedProjects
        .map(({ name, delay }) => `${name} (${delay} seconds)`)
        .join(', ')}. Acceptable delay is ${acceptableDelay} seconds.`,
    )
  }
}