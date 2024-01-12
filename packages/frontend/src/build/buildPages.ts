import Bugsnag from '@bugsnag/js'
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
import { activitySanityCheck, tvlSanityCheck } from './api/sanityCheck'
import { JsonHttpClient } from './caching/JsonHttpClient'
import { getConfig } from './config'

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
  const isErrorReportingEnabled = initializeErrorReporting(env)

  try {
    console.log(`Using config for ${env}`)
    const config = getConfig(env)

    const httpClient = new HttpClient(TEMP_HTTP_CALL_TIMEOUT_TIME_MS)

    const http = new JsonHttpClient(httpClient, config.backend.skipCache)

    console.time('[TVL]')
    const tvlApiResponse = await fetchTvlApi(config.backend, http)
    console.timeEnd('[TVL]')
    tvlSanityCheck(tvlApiResponse)

    let activityApiResponse: ActivityApiResponse | undefined = undefined
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

    let livenessApiResponse: LivenessApiResponse | undefined = undefined
    if (config.features.liveness) {
      console.time('[LIVENESS]')
      livenessApiResponse = await fetchLivenessApi(config.backend, http)
      console.timeEnd('[LIVENESS]')
    }
    console.log('\n')

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
  } catch (e) {
    console.error(e)

    if (isErrorReportingEnabled) {
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
    throw e
  }
}
function initializeErrorReporting(env: string) {
  const apiKey = process.env.BUGSNAG_API_KEY

  if (apiKey) {
    Bugsnag.start({
      apiKey,
      releaseStage: env,
      logger: null,
      sendCode: true,
    })
    console.log('Bugsnag integration enabled')
    return true
  }
  console.log('Bugsnag integration disabled')
  return false
}
