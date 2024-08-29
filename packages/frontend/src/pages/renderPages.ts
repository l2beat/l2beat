import { Config } from '../build/config'
import { Page, PagesData } from './Page'
import { outputPages } from './output'
import { getBridgeProjectPages } from './project/bridge'
import { getProjectPages } from './project/layer2'
import { getL3sProjectPages } from './project/layer3'
import { getSummaryPage } from './scaling/summary'

export function renderPages(config: Config, pagesData: PagesData) {
  const pages: Page[] = []

  pages.push(getSummaryPage(config, pagesData))
  pages.push(...getProjectPages(config, pagesData))
  pages.push(...getL3sProjectPages(config, pagesData))

  pages.push(...getBridgeProjectPages(config, pagesData))

  outputPages(config, pages)
}
