import { Config } from '../build/config'
import { getBridgeProjectPages } from './bridges/projects'
import { getBridgesRiskPage } from './bridges/risk'
import { getBridgesSummaryPage } from './bridges/summary'
import { getDonatePage } from './donate'
import { getFaqPage } from './faq'
import { getL2DaysPage } from './l2days'
import { getL3sProjectPages } from './layer3s'
import { getMetaImagePages } from './meta-images'
import { getMultisigReportDownloadPage } from './multisig-report'
import { outputPages } from './output'
import { Page, PagesData } from './Page'
import { getActivityPage } from './scaling/activity'
import { getLivenessPage } from './scaling/liveness'
import { getProjectPages } from './scaling/projects'
import { getProjectTvlBreakdownPages } from './scaling/projects-tvl-breakdown'
import { getRiskPage } from './scaling/risk'
import { getTvlPage } from './scaling/summary'
import { getDetailedTvlPage } from './scaling/tvl'

export async function renderPages(config: Config, pagesData: PagesData) {
  const pages: Page[] = []

  const {
    tvlApiResponse,
    activityApiResponse,
    verificationStatus,
    tvlBreakdownApiResponse,
    livenessApiResponse,
  } = pagesData

  pages.push(getRiskPage(config, pagesData))
  pages.push(getTvlPage(config, pagesData))
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

  pages.push(getDetailedTvlPage(config, pagesData))

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

  outputPages(pages)
}
