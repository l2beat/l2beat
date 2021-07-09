import { Project } from '@l2beat/config'
import { ReactElement } from 'react'
import { L2Data } from '../L2Data'
import { FaqPage } from './Faq/FaqPage'
import { getHomePageProps } from './Home/getHomePageProps'
import { HomePage } from './Home/HomePage'
import { outputPages } from './output'
import { ProjectPage } from './Project/ProjectPage'
import { TechnologiesPage } from './Technologies/TechnologiesPage'

export function renderPages(projects: Project[], l2Data: L2Data) {
  const pages = new Map<string, ReactElement>()

  pages.set('/', <HomePage {...getHomePageProps(projects, l2Data)} />)
  pages.set('/technologies', <TechnologiesPage />)
  pages.set('/faq', <FaqPage />)
  for (const project of projects) {
    pages.set(`projects/${project.slug}`, <ProjectPage project={project} />)
  }

  outputPages(pages)
}
