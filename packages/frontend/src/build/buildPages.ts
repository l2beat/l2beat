import Bugsnag from '@bugsnag/js'
import { getChainNames } from '@l2beat/config'
import {
  ActivityApiResponse,
  FinalityApiResponse,
  ImplementationChangeReportApiResponse,
  L2CostsApiResponse,
  LivenessApiResponse,
  ProjectAssetsBreakdownApiResponse,
} from '@l2beat/shared-pure'

import { HttpClient } from '../../../shared/build'
import { renderPages } from '../pages/renderPages'
import { createApi } from './api/createApi'
import { fetchActivityApi } from './api/fetchActivityApi'
import { fetchFeaturesApi } from './api/fetchFeaturesApi'
import { fetchFinalityApi } from './api/fetchFinalityApi'
import { fetchImplementationChangeReport } from './api/fetchImplementationChangeReport'
import { fetchL2CostsApi } from './api/fetchL2CostsApi'
import { fetchLivenessApi } from './api/fetchLivenessApi'
import { fetchTvlApi } from './api/fetchTvlApi'
import { fetchTvlBreakdownApi } from './api/fetchTvlBreakdownApi'
import {
  getManuallyVerifiedContracts,
  getVerificationStatus,
} from './api/getVerificationStatus'
import { activitySanityCheck, tvlSanityCheck } from './api/sanityCheck'
import { JsonHttpClient } from './caching/JsonHttpClient'
import { getConfig } from './config'
import { getCommonFeatures } from './config/getCommonFeatures'

/**
 * Temporary timeout for HTTP calls due to increased size of new TVL API and flaky connection times
 * 10s is high-top limit for response time so 30s is more than safe bet here
 */
const TEMP_HTTP_CALL_TIMEOUT_TIME_MS = 30_000

main().catch(() => {
  process.exit(1)
})

async function main() {
  const env = process.env.DEPLOYMENT_ENV ?? 'ci'
  const apiKey = process.env.BUGSNAG_API_KEY

  const isErrorReportingEnabled = initializeErrorReporting(apiKey, env)

  try {
    console.log(`Using config for ${env}`)
    const config = getConfig(env)

    const httpClient = new HttpClient(TEMP_HTTP_CALL_TIMEOUT_TIME_MS)

    const http = new JsonHttpClient(httpClient, config.backend.skipCache)

    console.time('[FETCHING DATA]')
    const backendFeatures = await fetchFeaturesApi(config.backend, http)
    config.features = getCommonFeatures(config.features, backendFeatures)

    const [tvlApiResponse, activityApiResponse, tvlBreakdownApiResponse, livenessApiResponse, finalityApiResponse, implementationChange, l2CostsApiResponse] = await Promise.all([
      fetchTvlApi(config.backend, http, config.features),
      config.features.activity ? fetchActivityApi(config.backend, http) : undefined,
      config.features.tvlBreakdown ? fetchTvlBreakdownApi(config.backend, config.backend.apiUrl, http) : undefined,
      config.features.liveness ? fetchLivenessApi(config.backend, http) : undefined,
      config.features.finality ? fetchFinalityApi(config.backend, http) : undefined,
      config.features.implementationChange ? fetchImplementationChangeReport(config.backend, http) : undefined,
      config.features.costsPage ? fetchL2CostsApi(config.backend, http) : undefined
    ])
    const supportedChains = getChainNames(config)
    const verificationStatus = getVerificationStatus(supportedChains)
    const manuallyVerifiedContracts =
      getManuallyVerifiedContracts(supportedChains)
    console.timeEnd('[FETCHING DATA]')

    console.time('[SANITY CHECKS]')
    if(tvlApiResponse) tvlSanityCheck(tvlApiResponse)
    if(activityApiResponse) activitySanityCheck(activityApiResponse)
    console.timeEnd('[SANITY CHECKS]')

    console.time('[BUILDING PAGES]')
    createApi(config, tvlApiResponse, activityApiResponse, l2CostsApiResponse)
    const pagesData = {
      tvlApiResponse,
      activityApiResponse,
      verificationStatus,
      manuallyVerifiedContracts,
      tvlBreakdownApiResponse,
      livenessApiResponse,
      finalityApiResponse,
      l2CostsApiResponse,
      implementationChange,
    }
    await renderPages(config, pagesData)
    console.timeEnd('[BUILDING PAGES]')
  } catch (e) {
    console.error(e)

    if (isErrorReportingEnabled) {
      await reportError(e)
    }
    throw e
  }
}

export function initializeErrorReporting(
  apiKey: string | undefined,
  environment: string,
): boolean {
  if (!apiKey) {
    console.log('Bugsnag integration disabled')
    return false
  }

  Bugsnag.start({
    apiKey,
    releaseStage: environment,
    logger: null,
    sendCode: true,
  })
  console.log('Bugsnag integration enabled')
  return true
}

async function reportError(e: unknown) {
  if (typeof e === 'string') {
    Bugsnag.notify(e, (event) => {
      event.context = 'Website build'
    })
  } else if (e instanceof Error) {
    Bugsnag.notify(e, (event) => {
      event.context = 'Website build'
    })
  } else {
    Bugsnag.notify('Unknown error', (event) => {
      event.context = 'Website build'
      event.addMetadata('error', { message: e })
    })
  }

  // wait 10 seconds for the error to be reported
  console.log('Waiting 10 seconds for the error to be reported')
  await new Promise((resolve) => setTimeout(resolve, 10_000))
}
