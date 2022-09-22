import { Bridge, Layer2 } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { getBridgeProjectPages } from './bridges-projects'
import { getBridgesRiskPage } from './bridges-risk'
import { getBridgesTvlPage } from './bridges-tvl'
import { config } from './config'
import { getDonatePage } from './donate'
import { getFaqPage } from './faq'
import { getMetaImagePages } from './meta-images'
import { outputPages } from './output'
import { Page } from './Page'
import { getProjectPages } from './scaling-projects'
import { getRiskPage } from './scaling-risk'
import { getTvlPage } from './scaling-tvl'

export async function renderPages(
  projects: Layer2[],
  bridges: Bridge[],
  apiMain: ApiMain,
) {
  const pages: Page[] = []

  pages.push(getRiskPage(projects, apiMain))
  pages.push(getTvlPage(projects, apiMain))
  pages.push(getFaqPage())
  pages.push(await getDonatePage())
  pages.push(...getProjectPages(projects, apiMain))
  pages.push(...getMetaImagePages(projects, apiMain))
  if (config.showBridgePages) {
    pages.push(getBridgesTvlPage(bridges, apiMain))
    pages.push(getBridgesRiskPage(bridges, apiMain))
    pages.push(...getBridgeProjectPages(bridges, apiMain))
  }

  outputPages(pages)
}
