import { Project as ProjectType } from '@l2beat/config'

import { L2Data } from '../L2Data'
import { getDonatePage } from './Donate'
import { getFaqPage } from './Faq'
import { getHomePage } from './Home'
import { getJobsPage } from './Jobs'
import { getMetaImagePages } from './MetaImages'
import { outputPages } from './output'
import { Page } from './Page'
import { getProjectPages } from './Project'

export async function renderPages(projects: ProjectType[], l2Data: L2Data) {
  const pages: Page[] = []

  pages.push(getHomePage(projects, l2Data))
  pages.push(getFaqPage())
  pages.push(await getDonatePage())
  pages.push(getJobsPage())
  pages.push(...getProjectPages(projects, l2Data))
  pages.push(...getMetaImagePages(projects, l2Data))

  outputPages(pages)
}
