import { ApiMain } from '@l2beat/types'

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

export async function renderPages(config: Config, apiMain: ApiMain) {
  const pages: Page[] = []

  const projects = config.layer2s.filter(
    (x) => !!apiMain.projects[x.id.toString()],
  )
  const bridges = config.bridges.filter(
    (x) => !!apiMain.projects[x.id.toString()],
  )

  pages.push(getRiskPage(projects, apiMain))
  pages.push(getTvlPage(projects, apiMain))
  pages.push(getActivityPage())
  pages.push(getFaqPage())
  pages.push(await getDonatePage())
  pages.push(...getProjectPages(projects, apiMain))
  pages.push(...getMetaImagePages(projects, apiMain))
  if (config.features.bridges) {
    pages.push(getBridgesTvlPage(bridges, apiMain))
    pages.push(getBridgesRiskPage(bridges, apiMain))
    pages.push(...getBridgeProjectPages(bridges, apiMain))
  }

  outputPages(pages)
}
