import fsx from 'fs-extra'
import path from 'path'
import { renderToStaticMarkup } from 'react-dom/server'

import { Page } from './Page'

export function outputPages(pages: Page[]) {
  for (const { slug, page } of pages) {
    fsx.mkdirpSync(path.join('build', slug))
    const html = `<!DOCTYPE html>${renderToStaticMarkup(page)}`
    fsx.writeFileSync(path.join('build', slug, 'index.html'), html)
  }
}
