import { Project } from '@l2beat/config'
import { ReactElement } from 'react'
import { L2Data } from '../L2Data'
import { FaqPage } from './Faq/FaqPage'
import { getHomePageProps, HomePage } from './Home'
import { getMetaImageProps, MetaImage } from './MetaImages'
import { outputPages } from './output'
import { getProjectPageProps, ProjectPage } from './Project'
import { TechnologiesPage } from './Technologies/TechnologiesPage'

export function renderPages(projects: Project[], l2Data: L2Data) {
  const pages = new Map<string, ReactElement>()

  pages.set('/', <HomePage {...getHomePageProps(projects, l2Data)} />)
  pages.set(
    `meta-images/overview`,
    <MetaImage {...getMetaImageProps(l2Data)} />
  )
  pages.set('/technologies', <TechnologiesPage />)
  pages.set('/faq', <FaqPage />)
  for (const project of projects) {
    pages.set(
      `projects/${project.slug}`,
      <ProjectPage {...getProjectPageProps(project, l2Data)} />
    )
    pages.set(
      `meta-images/${project.slug}`,
      <MetaImage {...getMetaImageProps(l2Data, project)} />
    )
  }

  outputPages(pages)
}
