import { Project } from '@l2beat/config'
import { ReactElement } from 'react'
import { slug } from '../utils/slug'
import { HomePage } from './Home/HomePage'
import { ProjectPage } from './Project/ProjectPage'
import { TechnologiesPage } from './Technologies/TechnologiesPage'

export function getPages(projects: Project[]) {
  const pages = new Map<string, ReactElement>()

  pages.set('/', <HomePage projects={projects} />)
  pages.set('/technologies', <TechnologiesPage />)
  for (const project of projects) {
    pages.set(
      `project/${slug(project.name)}`,
      <ProjectPage project={project} />
    )
  }

  return pages
}
