import { mkdir } from 'node:fs/promises'
import path from 'path'
import { renderToStaticMarkup } from 'react-dom/server'

import { Page } from './Page'

export async function outputPages(pages: Page[]) {
  for (const { slug, page } of pages) {
    await mkdir(path.join('build', slug), { recursive: true })
    const html = `<!DOCTYPE html>${renderToStaticMarkup(page)}`
    await Bun.write(path.join('build', slug, 'index.html'), html)
  }
}
