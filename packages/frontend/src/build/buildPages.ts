import { bridges, layer2s } from '@l2beat/config'
import {
  ActivityApiChart,
  ActivityApiResponse,
  ProjectId,
  TvlApiResponse,
} from '@l2beat/shared'

import { HttpClient } from '../../../shared/build'
import { renderPages } from '../pages'
import { JsonHttpClient } from './caching/JsonHttpClient'
import { getConfig } from './config'
import { createApi } from './createApi'
import { fetchActivityApi } from './fetchActivityApi'
import { fetchTvlApi } from './fetchTvlApi'
import { getVerificationStatus } from './getVerificationStatus'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const env = process.env.DEPLOYMENT_ENV ?? 'production'
  console.log(`Using config for ${env}`)
  const config = getConfig(env)

  const http = new JsonHttpClient(new HttpClient(), config.backend.skipCache)

  const tvlApiResponse = await fetchTvlApi(config.backend.apiUrl, http)
  printApiInfo(tvlApiResponse)
  tvlSanityCheck(tvlApiResponse)

  let activityApiResponse: ActivityApiResponse | undefined = undefined
  if (config.features.activity) {
    activityApiResponse = await fetchActivityApi(config.backend.apiUrl, http)
    printActivityInfo(activityApiResponse)
    activitySanityCheck(activityApiResponse)
  }

  createApi(config, tvlApiResponse, activityApiResponse)

  const verificationStatus = getVerificationStatus()

  const pagesData = {
    tvlApiResponse,
    activityApiResponse,
    verificationStatus,
  }

  await renderPages(config, pagesData)
}

function printApiInfo(tvlApiResponse: TvlApiResponse) {
  console.debug('\n', 'TVL')
  printTvl('combined', tvlApiResponse.combined)
  printTvl('layer2s', tvlApiResponse.layers2s)
  printTvl('bridges', tvlApiResponse.bridges)
  for (const project of [...layer2s, ...bridges]) {
    const charts = tvlApiResponse.projects[project.id.toString()]?.charts
    if (charts) {
      printTvl(project.id.toString(), charts)
    } else {
      console.debug(project.id.toString(), '...', 'MISSING')
    }
  }

  function printTvl(label: string, charts: TvlApiResponse['combined']) {
    const tvl = (charts.hourly.data.at(-1)?.[1] ?? 0).toFixed(2)
    const hourly = charts.hourly.data.length.toString()
    const sixHourly = charts.sixHourly.data.length.toString()
    const daily = charts.daily.data.length.toString()
    console.debug(
      label,
      '.'.repeat(30 - label.length - tvl.length),
      tvl,
      `[H ${hourly.padStart(3, ' ')},`,
      `6H ${sixHourly.padStart(3, ' ')},`,
      `D ${daily.padStart(4, ' ')}]`,
    )
  }
}

function printActivityInfo(activityApiResponse: ActivityApiResponse) {
  console.debug('\n', 'ACTIVITY')
  printActivity('combined', activityApiResponse.combined)
  printActivity('ethereum', activityApiResponse.ethereum)
  for (const project of [...layer2s]) {
    const chart = activityApiResponse.projects[project.id.toString()]
    printActivity(project.id.toString(), chart)
  }
  console.debug() // new line

  function printActivity(
    label: string,
    chart?: ActivityApiResponse['combined'],
  ) {
    if (!chart) {
      console.debug(label, '...', 'MISSING')
      return
    }

    const tps = (chart.data.at(-1)?.[1] ?? 0).toFixed(2)
    const daily = chart.data.length.toString()
    console.debug(
      label,
      '.'.repeat(30 - label.length - tps.length),
      tps,
      `[D ${daily.padStart(3, ' ')}]`,
    )
  }
}

function tvlSanityCheck(tvlApiResponse: TvlApiResponse) {
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

  const emptyChartsExist = [
    tvlApiResponse.bridges,
    tvlApiResponse.layers2s,
    tvlApiResponse.combined,
    ...Object.entries(tvlApiResponse.projects)
      .filter(([id]) => ids.includes(id))
      .map(([, project]) => project?.charts),
  ]
    .flatMap((x) => [x?.daily, x?.sixHourly, x?.hourly])
    .some((x) => x?.data.length === 0)

  if (emptyChartsExist) {
    throw new Error('The API has returned some empty tvl charts')
  }
}

function activitySanityCheck(activityApiResponse: ActivityApiResponse) {
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
}
