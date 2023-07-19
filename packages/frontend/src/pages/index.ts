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
import { getProjectPages } from './scaling-projects'
import { getRiskPage } from './scaling-risk'
import { getTvlPage } from './scaling-tvl'

export async function renderPages(config: Config, pagesData: PagesData) {
  const pages: Page[] = []

  const { tvlApiResponse, activityApiResponse, verificationStatus } = pagesData

  pages.push(getRiskPage(config, pagesData))
  pages.push(getTvlPage(config, pagesData))
  pages.push(getFaqPage(config))
  pages.push(await getDonatePage(config))
  pages.push(...getProjectPages(config, pagesData))
  pages.push(...getMetaImagePages(config, tvlApiResponse, activityApiResponse))

  pages.push(getBridgesTvlPage(config, pagesData))
  pages.push(getBridgesRiskPage(config, pagesData))
  pages.push(...getBridgeProjectPages(config, pagesData))

  if (config.features.multisigReport) {
    pages.push(getMultisigReportDownloadPage(config))
  }

  if (activityApiResponse) {
    pages.push(
      getActivityPage(config, {
        activityApiResponse,
        verificationStatus,
      }),
    )
  }

  outputPages(pages)
}
