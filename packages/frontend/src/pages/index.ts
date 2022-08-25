import { Project as ProjectType } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { getDonatePage } from './donate'
import { getFaqPage } from './faq'
import { getHomePage } from './home'
import { getMetaImagePages } from './meta-images'
import { outputPages } from './output'
import { Page } from './Page'
import { getProjectPages } from './projects'

export async function renderPages(projects: ProjectType[], apiMain: ApiMain) {
  const pages: Page[] = []

  pages.push(getHomePage(projects, apiMain))
  pages.push(getFaqPage())
  pages.push(await getDonatePage())
  pages.push(...getProjectPages(projects, apiMain))
  pages.push(...getMetaImagePages(projects, apiMain))

  outputPages(pages)
}
