import { Project as ProjectType } from '@l2beat/config'
import React, { ReactElement } from 'react'

import { config } from '../config'
import { L2Data } from '../L2Data'
import { Faq } from './Faq'
import { Home } from './Home'
import { Meta } from './MetaImages'
import { outputPages } from './output'
import { Project } from './Project'
import { Technologies } from './Technologies'

export function renderPages(projects: ProjectType[], l2Data: L2Data) {
  const pages = new Map<string, ReactElement>()

  pages.set('/', <Home projects={projects} l2Data={l2Data} />)
  pages.set(`meta-images/overview`, <Meta l2Data={l2Data} />)
  if (config.__DEV__showTechnologiesPage) {
    pages.set('/technologies', <Technologies />)
  }
  pages.set('/faq', <Faq />)
  for (const project of projects) {
    pages.set(
      `projects/${project.slug}`,
      <Project project={project} l2Data={l2Data} />
    )
    pages.set(
      `meta-images/${project.slug}`,
      <Meta project={project} l2Data={l2Data} />
    )
  }

  outputPages(pages)
}
