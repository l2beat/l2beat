import { ApiActivity, ApiMain } from '@l2beat/types'

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
  apiMain: ApiMain,
  apiActivity: ApiActivity,
) {
  const pages: Page[] = []

  pages.push(getRiskPage(config, apiMain))
  pages.push(getTvlPage(config, apiMain))
  pages.push(getActivityPage(config, apiActivity))
  pages.push(getFaqPage(config))
  pages.push(await getDonatePage(config))
  pages.push(...getProjectPages(config, apiMain))
  pages.push(...getMetaImagePages(config, apiMain))
  if (config.features.bridges) {
    pages.push(getBridgesTvlPage(config, apiMain))
    pages.push(getBridgesRiskPage(config, apiMain))
    pages.push(...getBridgeProjectPages(config, apiMain))
  }

  outputPages(pages)
}
