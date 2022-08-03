import { ApiMain } from '@l2beat/common'
import { Project as ProjectType } from '@l2beat/config'

import { getDonatePage } from './Donate'
import { getFaqPage } from './Faq'
import { getHomePage } from './Home'
import { getMetaImagePages } from './MetaImages'
import { outputPages } from './output'
import { Page } from './Page'
import { getProjectPages } from './Project'

export async function renderPages(projects: ProjectType[], apiMain: ApiMain) {
  const pages: Page[] = []

  pages.push(getHomePage(projects, apiMain))
  pages.push(getFaqPage())
  pages.push(await getDonatePage())
  pages.push(...getProjectPages(projects, apiMain))
  pages.push(...getMetaImagePages(projects, apiMain))

  outputPages(pages)
}
