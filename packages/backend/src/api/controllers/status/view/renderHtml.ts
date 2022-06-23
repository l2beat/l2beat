import { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

export function renderHtml(page: ReactElement) {
  return `<!DOCTYPE html>${renderToStaticMarkup(page)}`
}
