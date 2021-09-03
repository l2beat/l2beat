import fsx from 'fs-extra'
import path from 'path'
import { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

export function outputPages(pages: Map<string, ReactElement>) {
  for (const [url, element] of pages) {
    fsx.mkdirpSync(path.join('build', url))
    const html = `<!DOCTYPE html>${renderToStaticMarkup(element)}`
    fsx.writeFileSync(path.join('build', url, 'index.html'), html)
  }
}
