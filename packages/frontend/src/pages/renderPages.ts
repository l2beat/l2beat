import { Config } from '../build/config'
import { getBridgeProjectPages } from './bridges/projects'
import { getBridgesRiskPage } from './bridges/risk'
import { getBridgesSummaryPage } from './bridges/summary'
import { getDonatePage } from './donate'
import { getFaqPage } from './faq'
import { getGovernancePage } from './governance/index'
import { getGovernancePublicationPages } from './governance/publication'
import { getGovernancePublicationsPage } from './governance/publications'
import { getL3sProjectPages } from './layer3s'
import { getMultisigReportDownloadPage } from './multisig-report'
import { outputPages } from './output'
import { Page, PagesData } from './Page'
import { getProjectPages } from './project/layer2'
import { getActivityPage } from './scaling/activity'
import { getCostsPage } from './scaling/costs'
import { getScalingDataAvailabilityPage } from './scaling/data-availability'
import { getDiffHistoryPages } from './scaling/diff-history'
import { getFinalityPage } from './scaling/finality'
import { getLivenessPage } from './scaling/liveness'
import { getProjectTvlBreakdownPages } from './scaling/projects-tvl-breakdown'
import { getRiskPage } from './scaling/risk'
import { getSummaryPage } from './scaling/summary'
import { getTvlPage } from './scaling/tvl'

export async function renderPages(config: Config, pagesData: PagesData) {
  const pages: Page[] = []

  const {
    tvlApiResponse,
    activityApiResponse,
    verificationStatus,
    tvlBreakdownApiResponse,
    livenessApiResponse,
    finalityApiResponse,
    l2CostsApiResponse,
    diffHistory,
    implementationChange,
  } = pagesData

  pages.push(getRiskPage(config, pagesData))
  pages.push(getSummaryPage(config, pagesData))
  pages.push(getFaqPage(config))
  pages.push(await getDonatePage(config))
  pages.push(...getProjectPages(config, pagesData))
  pages.push(...getL3sProjectPages(config, pagesData))

  pages.push(getBridgesSummaryPage(config, pagesData))
  pages.push(getBridgesRiskPage(config, pagesData))
  pages.push(...getBridgeProjectPages(config, pagesData))

  pages.push(getMultisigReportDownloadPage(config))

  if (activityApiResponse) {
    pages.push(
      getActivityPage(config, {
        activityApiResponse,
        verificationStatus,
        implementationChange,
      }),
    )
  }

  pages.push(getTvlPage(config, pagesData))

  if (config.features.tvlBreakdown && tvlBreakdownApiResponse) {
    pages.push(
      ...getProjectTvlBreakdownPages(config, {
        tvlApiResponse,
        tvlBreakdownApiResponse,
      }),
    )
  }

  if (config.features.liveness && livenessApiResponse) {
    pages.push(
      getLivenessPage(config, {
        livenessApiResponse,
        tvlApiResponse,
        implementationChange,
      }),
    )
  }

  if (config.features.finality && finalityApiResponse) {
    pages.push(
      getFinalityPage(config, {
        finalityApiResponse,
        tvlApiResponse,
        implementationChange,
      }),
    )
  }

  if (config.features.diffHistory && diffHistory) {
    pages.push(...getDiffHistoryPages(config, diffHistory))
  }

  if (config.features.governancePage) {
    pages.push(getGovernancePage(config))
    pages.push(getGovernancePublicationsPage(config))
    pages.push(...getGovernancePublicationPages(config))
  }

  pages.push(
    getScalingDataAvailabilityPage(config, {
      tvlApiResponse,
      implementationChange,
    }),
  )

  if (config.features.costsPage && l2CostsApiResponse) {
    pages.push(
      getCostsPage(config, {
        tvlApiResponse,
        l2CostsApiResponse,
        activityApiResponse,
        implementationChange,
      }),
    )
  }

  outputPages(pages)
}
