import { Config } from '../build/config'
import { getBridgeProjectPages } from './bridges/projects'
import { getBridgesRiskPage } from './bridges/risk'
import { getBridgesSummaryPage } from './bridges/summary'
import { getDonatePage } from './donate'
import { getFaqPage } from './faq'
import { getGovernancePage } from './governance/index'
import { getGovernancePublicationPages } from './governance/publication'
import { getGovernancePublicationsPage } from './governance/publications'
import { getL2DaysPage } from './l2days'
import { getL3sProjectPages } from './layer3s'
import { getMetaImagePages } from './meta-images'
import { getMultisigReportDownloadPage } from './multisig-report'
import { outputPages } from './output'
import { Page, PagesData } from './Page'
import { getActivityPage } from './scaling/activity'
import { getScalingDataAvailabilityPage } from './scaling/data-availability'
import { getDiffHistoryPages } from './scaling/diff-history'
import { getFinalityPage } from './scaling/finality'
import { getLivenessPage } from './scaling/liveness'
import { getProjectPages } from './scaling/projects'
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
    diffHistory,
  } = pagesData

  pages.push(getRiskPage(config, pagesData))
  pages.push(getSummaryPage(config, pagesData))
  pages.push(getFaqPage(config))
  pages.push(getL2DaysPage())
  pages.push(await getDonatePage(config))
  pages.push(...getProjectPages(config, pagesData))
  pages.push(...getL3sProjectPages(config, pagesData))
  pages.push(...getMetaImagePages(config, tvlApiResponse, activityApiResponse))

  pages.push(getBridgesSummaryPage(config, pagesData))
  pages.push(getBridgesRiskPage(config, pagesData))
  pages.push(...getBridgeProjectPages(config, pagesData))

  pages.push(getMultisigReportDownloadPage(config))

  if (activityApiResponse) {
    pages.push(
      getActivityPage(config, {
        activityApiResponse,
        verificationStatus,
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
      }),
    )
  }

  if (config.features.finality && finalityApiResponse) {
    pages.push(
      getFinalityPage(config, {
        finalityApiResponse,
        tvlApiResponse,
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

  pages.push(getScalingDataAvailabilityPage(config, { tvlApiResponse }))

  outputPages(pages)
}
