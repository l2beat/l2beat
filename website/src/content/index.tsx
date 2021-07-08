import { projects } from '@l2beat/config'
import fsx from 'fs-extra'
import path from 'path'
import { renderToStaticMarkup } from 'react-dom/server'
import { getPages } from './pages'

const pages = getPages(projects)

for (const [url, element] of pages) {
  fsx.mkdirpSync(path.join('build', url))
  const html = `<!DOCTYPE html>${renderToStaticMarkup(element)}`
  fsx.writeFileSync(path.join('build', url, 'index.html'), html)
}
