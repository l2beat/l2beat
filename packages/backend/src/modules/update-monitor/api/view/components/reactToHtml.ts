import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

export function reactToHtml(element: ReactElement) {
  return `<!DOCTYPE html>${renderToStaticMarkup(element)}`
}
