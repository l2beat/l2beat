import { bridges, layer2s } from '@l2beat/config'
import { ActivityApiResponse, TvlApiResponse } from '@l2beat/shared'

import { HttpClient } from '../../../shared/build'
import { renderPages } from '../pages'
import { JsonHttpClient } from './caching/JsonHttpClient'
import { getConfig } from './config'
import { createApi } from './createApi'
import { fetchActivityApi } from './fetchActivityApi'
import { fetchTvlApi } from './fetchTvlApi'
import { getVerificationStatus } from './getVerificationStatus'
import { activitySanityCheck, tvlSanityCheck } from './sanityCheck'

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
