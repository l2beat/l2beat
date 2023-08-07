import { ActivityApiResponse } from '@l2beat/shared-pure'

import { HttpClient } from '../../../shared/build'
import { renderPages } from '../pages'
import { createApi } from './api/createApi'
import { fetchActivityApi } from './api/fetchActivityApi'
import { fetchDetailedTvlApi } from './api/fetchDetailedTvlApi'
import { fetchTvlApi } from './api/fetchTvlApi'
import { getVerificationStatus } from './api/getVerificationStatus'
import { printActivityInfo, printApiInfo } from './api/printApiInfo'
import { activitySanityCheck, tvlSanityCheck } from './api/sanityCheck'
import { JsonHttpClient } from './caching/JsonHttpClient'
import { getConfig } from './config'

/**
 * Temporary timeout for HTTP calls due to increased size of new detailed TVL API and flaky connection times
 * 10s is high-top limit for response time so 30s is more than safe bet here
 */
const TEMP_HTTP_CALL_TIMEOUT_TIME_MS = 30_000

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const env = process.env.DEPLOYMENT_ENV ?? 'production'
  console.log(`Using config for ${env}`)
  const config = getConfig(env)

  const httpClient = new HttpClient(TEMP_HTTP_CALL_TIMEOUT_TIME_MS)

  const http = new JsonHttpClient(httpClient, config.backend.skipCache)

  const tvlApiResponse = config.features.detailedTvl
    ? await fetchDetailedTvlApi(config.backend.apiUrl, http)
    : await fetchTvlApi(config.backend.apiUrl, http)
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
