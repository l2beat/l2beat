import {
  ActivityApiResponse,
  LivenessApiResponse,
  ProjectAssetsBreakdownApiResponse,
} from '@l2beat/shared-pure'

import { HttpClient } from '../../../shared/build'
import { renderPages } from '../pages'
import { createApi } from './api/createApi'
import { fetchActivityApi } from './api/fetchActivityApi'
import { fetchLivenessApi } from './api/fetchLivenessApi'
import { fetchTvlApi } from './api/fetchTvlApi'
import { fetchTvlBreakdownApi } from './api/fetchTvlBreakdownApi'
import { getManuallyVerifiedContracts } from './api/getManuallyVerifiedLinks'
import { getVerificationStatus } from './api/getVerificationStatus'
import { printActivityInfo, printApiInfo } from './api/printApiInfo'
import { activitySanityCheck, tvlSanityCheck } from './api/sanityCheck'
import { JsonHttpClient } from './caching/JsonHttpClient'
import { getConfig } from './config'

/**
 * Temporary timeout for HTTP calls due to increased size of new TVL API and flaky connection times
 * 10s is high-top limit for response time so 30s is more than safe bet here
 */
const TEMP_HTTP_CALL_TIMEOUT_TIME_MS = 30_000

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const env = process.env.DEPLOYMENT_ENV ?? 'ci'
  console.log(`Using config for ${env}`)
  const config = getConfig(env)

  const httpClient = new HttpClient(TEMP_HTTP_CALL_TIMEOUT_TIME_MS)

  const http = new JsonHttpClient(httpClient, config.backend.skipCache)

  const tvlApiResponse = await fetchTvlApi(config.backend, http)
  printApiInfo(tvlApiResponse)
  tvlSanityCheck(tvlApiResponse)

  let activityApiResponse: ActivityApiResponse | undefined = undefined
  if (config.features.activity) {
    activityApiResponse = await fetchActivityApi(config.backend, http)
    printActivityInfo(activityApiResponse)
    activitySanityCheck(activityApiResponse)
  }

  let tvlBreakdownApiResponse: ProjectAssetsBreakdownApiResponse | undefined =
    undefined
  if (config.features.tvlBreakdown) {
    tvlBreakdownApiResponse = await fetchTvlBreakdownApi(
      config.backend,
      config.backend.apiUrl,
      http,
    )
    // TODO: (maciekzygmunt) print info & Sanity check?
  }

  let livenessApiResponse: LivenessApiResponse | undefined = undefined
  if (config.features.liveness) {
    livenessApiResponse = await fetchLivenessApi(config.backend, http)
  }

  createApi(config, tvlApiResponse, activityApiResponse)

  const verificationStatus = getVerificationStatus()
  const manuallyVerifiedContracts = getManuallyVerifiedContracts()

  const pagesData = {
    tvlApiResponse,
    activityApiResponse,
    verificationStatus,
    manuallyVerifiedContracts,
    tvlBreakdownApiResponse,
    livenessApiResponse,
  }

  await renderPages(config, pagesData)
}
