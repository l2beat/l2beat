import { ActivityApiResponse } from '@l2beat/shared'

import { HttpClient } from '../../../shared/build'
import { renderPages } from '../pages'
import { JsonHttpClient } from './caching/JsonHttpClient'
import { getConfig } from './config'
import { createApi } from './createApi'
import { fetchActivityApi } from './fetchActivityApi'
import { fetchTvlApi } from './fetchTvlApi'
import { getVerificationStatus } from './getVerificationStatus'
import { printActivityInfo, printApiInfo } from './printApiInfo'
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
