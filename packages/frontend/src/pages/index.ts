import { Config } from '../build/config'
import { getBridgeProjectPages } from './bridges-projects'
import { getBridgesRiskPage } from './bridges-risk'
import { getBridgesTvlPage } from './bridges-tvl'
import { getDonatePage } from './donate'
import { getFaqPage } from './faq'
import { getMetaImagePages } from './meta-images'
import { getMultisigReportDownloadPage } from './multisig-report'
import { outputPages } from './output'
import { Page, PagesData } from './Page'
import { getActivityPage } from './scaling-activity'
import { getDetailedTvlPage } from './scaling-detailedTvl'
import { getProjectPages } from './scaling-projects'
import { getProjectTvlBreakdownPages } from './scaling-projects-tvl-breakdown'
import { getRiskPage } from './scaling-risk'
import { getTvlPage } from './scaling-tvl'

export async function renderPages(config: Config, pagesData: PagesData) {
  const pages: Page[] = []

  const {
    tvlApiResponse,
    activityApiResponse,
    verificationStatus,
    tvlBreakdownApiResponse,
  } = pagesData

  pages.push(getRiskPage(config, pagesData))
  pages.push(getTvlPage(config, pagesData))
  pages.push(getFaqPage(config))
  pages.push(await getDonatePage(config))
  pages.push(...getProjectPages(config, pagesData))
  pages.push(...getMetaImagePages(config, tvlApiResponse, activityApiResponse))

  pages.push(getBridgesTvlPage(config, pagesData))
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

  if (config.features.detailedTvl) {
    pages.push(getDetailedTvlPage(config, pagesData))
  }

  if (config.features.tvlBreakdown && tvlBreakdownApiResponse) {
    pages.push(
      ...getProjectTvlBreakdownPages(config, {
        tvlApiResponse,
        tvlBreakdownApiResponse,
      }),
    )
  }

  outputPages(pages)
}
