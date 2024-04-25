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

    console.time('[FEATURES]')
    const backendFeatures = await fetchFeaturesApi(config.backend, http)
    config.features = getCommonFeatures(config.features, backendFeatures)
    console.timeEnd('[FEATURES]')

    console.time('[TVL]')
    const tvlApiResponse = await fetchTvlApi(config.backend, http)
    console.timeEnd('[TVL]')
    tvlSanityCheck(tvlApiResponse)

    let activityApiResponse: ActivityApiResponse | undefined
    if (config.features.activity) {
      console.time('[ACTIVITY]')
      activityApiResponse = await fetchActivityApi(config.backend, http)
      console.timeEnd('[ACTIVITY]')
      activitySanityCheck(activityApiResponse)
    }

    let tvlBreakdownApiResponse: ProjectAssetsBreakdownApiResponse | undefined =
      undefined
    if (config.features.tvlBreakdown) {
      console.time('[TVL BREAKDOWN]')
      tvlBreakdownApiResponse = await fetchTvlBreakdownApi(
        config.backend,
        config.backend.apiUrl,
        http,
      )
      console.timeEnd('[TVL BREAKDOWN]')
      // TODO: (maciekzygmunt) Sanity check?
    }

    let livenessApiResponse: LivenessApiResponse | undefined
    if (config.features.liveness) {
      console.time('[LIVENESS]')
      livenessApiResponse = await fetchLivenessApi(config.backend, http)
      console.timeEnd('[LIVENESS]')
    }
    let finalityApiResponse: FinalityApiResponse | undefined
    if (config.features.finality) {
      console.time('[FINALITY]')
      finalityApiResponse = await fetchFinalityApi(config.backend, http)
      console.timeEnd('[FINALITY]')
    }

    let implementationChange: ImplementationChangeReportApiResponse | undefined
    if (config.features.implementationChange) {
      console.time('[IMPLEMENTATION CHANGE]')
      try {
        implementationChange = await fetchImplementationChangeReport(
          config.backend,
          http,
        )
      } catch (e) {
        console.log(
          '[IMPLEMENTATION CHANGE] Failed to fetch implementation change report, this feature will be disabled in this build',
          e,
        )
      }
      console.timeEnd('[IMPLEMENTATION CHANGE]')
    }

    let l2CostsApiResponse: L2CostsApiResponse | undefined
    if (config.features.costsPage) {
      console.time('[L2 COSTS]')
      l2CostsApiResponse = await fetchL2CostsApi(config.backend, http)
      console.timeEnd('[L2 COSTS]')
    }

    createApi(config, tvlApiResponse, activityApiResponse, l2CostsApiResponse)

    const supportedChains = getChainNames(config)
    const verificationStatus = getVerificationStatus(supportedChains)
    const manuallyVerifiedContracts =
      getManuallyVerifiedContracts(supportedChains)

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      event.addMetadata('error', { message: e })
    })
  }

  // wait 10 seconds for the error to be reported
  console.log('Waiting 10 seconds for the error to be reported')
  await new Promise((resolve) => setTimeout(resolve, 10_000))
}
