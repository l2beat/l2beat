import { projects } from '@l2beat/config'
import fsx from 'fs-extra'
import path from 'path'
import { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Home } from './pages/Home/Home'
import { Project } from './pages/Project/Project'
import { slug } from './utils/slug'

const pages = new Map<string, ReactElement>()
pages.set('/', <Home projects={projects} />)
for (const project of projects) {
  pages.set(`project/${slug(project.name)}`, <Project project={project} />)
}

for (const [url, element] of pages) {
  fsx.mkdirpSync(path.join('build', url))
  const html = `<!DOCTYPE html>${renderToStaticMarkup(element)}`
  fsx.writeFileSync(path.join('build', url, 'index.html'), html)
}
