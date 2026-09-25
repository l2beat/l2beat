import type { ReactElement } from 'react'
import { renderToString } from 'react-dom/server'

/**
 * Renders the element the way ServerEntry does for a request to `url`, so
 * tests can inspect the HTML a crawler receives.
 */
export function renderServerHtml(url: string, element: ReactElement): string {
  const previousUrl = globalThis.__FIX_SSR_URL__
  globalThis.__FIX_SSR_URL__ = url
  try {
    return renderToString(element)
  } finally {
    globalThis.__FIX_SSR_URL__ = previousUrl
  }
}

/** Returns the outer HTML of the Radix tab panel for `value`. */
export function getTabPanelHtml(html: string, value: string): string {
  const start = html.search(new RegExp(`<div[^>]*id="[^"]*-content-${value}"`))
  if (start === -1) {
    throw new Error(`No tab panel "${value}" rendered`)
  }
  return html.slice(start, findClosingDivEnd(html, start))
}

function findClosingDivEnd(html: string, openingDivStart: number): number {
  let depth = 0
  for (const tag of html
    .slice(openingDivStart)
    .matchAll(/<div[\s>]|<\/div>/g)) {
    depth += tag[0] === '</div>' ? -1 : 1
    if (depth === 0) {
      return openingDivStart + tag.index + tag[0].length
    }
  }
  throw new Error('Unclosed <div> in rendered HTML')
}
