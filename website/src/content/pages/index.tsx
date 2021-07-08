import { Project } from '@l2beat/config'
import { ReactElement } from 'react'
import { HomePage } from './Home/HomePage'
import { outputPages } from './output'
import { ProjectPage } from './Project/ProjectPage'
import { TechnologiesPage } from './Technologies/TechnologiesPage'

export function renderPages(projects: Project[]) {
  const pages = new Map<string, ReactElement>()

  pages.set('/', <HomePage projects={projects} />)
  pages.set('/technologies', <TechnologiesPage />)
  for (const project of projects) {
    pages.set(`projects/${project.slug}`, <ProjectPage project={project} />)
  }

  outputPages(pages)
}
