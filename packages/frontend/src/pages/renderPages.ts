import { Config } from '../build/config'
import { Page, PagesData } from './Page'
import { getBridgesRiskPage } from './bridges/risk'
import { getBridgesSummaryPage } from './bridges/summary'
import { getDARiskPage } from './da-risk'
import { getMultisigReportDownloadPage } from './multisig-report'
import { outputPages } from './output'
import { getBridgeProjectPages } from './project/bridge'
import { getProjectPages } from './project/layer2'
import { getL3sProjectPages } from './project/layer3'
import { getActivityPage } from './scaling/activity'
import { getMaintenanceActivityPage } from './scaling/activity/maintenance'
import { getProjectTvlBreakdownPages } from './scaling/projects-tvl-breakdown'
import { getSummaryPage } from './scaling/summary'
import { getTvlPage } from './scaling/tvl'

export function renderPages(config: Config, pagesData: PagesData) {
  const pages: Page[] = []

  const {
    tvlApiResponse,
    activityApiResponse,
    verificationStatus,
    tvlBreakdownApiResponse,
    implementationChange,
  } = pagesData

  pages.push(getDARiskPage())
  pages.push(getSummaryPage(config, pagesData))
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
  } else {
    pages.push(getMaintenanceActivityPage(config))
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

  outputPages(config, pages)
}
