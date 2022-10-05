import { ActivityApiResponse, TvlApiResponse } from '@l2beat/types'

import { Config } from '../build/config'
import { getBridgeProjectPages } from './bridges-projects'
import { getBridgesRiskPage } from './bridges-risk'
import { getBridgesTvlPage } from './bridges-tvl'
import { getDonatePage } from './donate'
import { getFaqPage } from './faq'
import { getMetaImagePages } from './meta-images'
import { outputPages } from './output'
import { Page } from './Page'
import { getActivityPage } from './scaling-activity'
import { getProjectPages } from './scaling-projects'
import { getRiskPage } from './scaling-risk'
import { getTvlPage } from './scaling-tvl'

export async function renderPages(
  config: Config,
  tvlApiResponse: TvlApiResponse,
  activityApiResponse: ActivityApiResponse,
) {
  const pages: Page[] = []

  pages.push(getRiskPage(config, tvlApiResponse))
  pages.push(getTvlPage(config, tvlApiResponse))
  pages.push(getActivityPage(config, tvlApiResponse, activityApiResponse))
  pages.push(getFaqPage(config))
  pages.push(await getDonatePage(config))
  pages.push(...getProjectPages(config, tvlApiResponse))
  pages.push(...getMetaImagePages(config, tvlApiResponse))
  if (config.features.bridges) {
    pages.push(getBridgesTvlPage(config, tvlApiResponse))
    pages.push(getBridgesRiskPage(config, tvlApiResponse))
    pages.push(...getBridgeProjectPages(config, tvlApiResponse))
  }

  outputPages(pages)
}
