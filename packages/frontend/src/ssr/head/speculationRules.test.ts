import { expect } from 'earl'
import { NOT_PAGES } from './speculationRules'

// Method: resolve each link against a page URL and match it with URLPattern,
// the API Chrome evaluates `href_matches` with.
describe('speculationRules', () => {
  it('leaves out links that are not pages', () => {
    for (const href of [
      '/api',
      '/api/trpc/tvs.table?batch=1',
      '/api/scaling/summary',
      '/layer2s/projects/arbitrum.md',
      '/llms.txt',
      '/sitemap.xml',
      '/static/assets/index-abc.js',
      '/meta-images/og.png',
    ]) {
      expect({ href, page: isPage(href) }).toEqual({ href, page: false })
    }
  })

  it('keeps links to pages, whatever their query or fragment', () => {
    for (const href of [
      '/',
      '/layer2s/projects/zk.money',
      '/interop/lock-and-mint?from=ethereum&to=arbitrum',
      '/glossary#bridge',
      '/apis-are-not-api',
    ]) {
      expect({ href, page: isPage(href) }).toEqual({ href, page: true })
    }
  })
})

function isPage(href: string) {
  const base = 'https://l2beat.com/layer2s/summary'
  const url = new URL(href, base).href
  return !NOT_PAGES.some((pattern) => new URLPattern(pattern, base).test(url))
}
