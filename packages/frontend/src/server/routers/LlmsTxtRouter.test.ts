import { expect } from 'earl'
import type express from 'express'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { createLlmsTxtRouter } from './LlmsTxtRouter'
import { createMarkdownAlternatesRouter } from './MarkdownAlternatesRouter'
import { createPublicApiRouter } from './PublicApiRouter'

// Method: request /llms.txt over HTTP and check it against the llms.txt spec
// (H1 title, blockquote summary, H2 sections of `- [name](url): notes` links,
// small enough to fit in context). The API list is compared with the routes
// the public API router registers and the .md links with the routes the
// markdown alternates router registers, so a new or removed route fails here
// until llms.txt is updated.
describe(createLlmsTxtRouter.name, () => {
  it('serves markdown', async () => {
    const response = await fetchFromRouter(createLlmsTxtRouter(), '/llms.txt')

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type')).toEqual(
      'text/markdown; charset=utf-8',
    )
  })

  it('opens with the L2BEAT title and a one-paragraph summary', async () => {
    const body = await getLlmsTxt()

    expect(body).toMatchRegex(/^# L2BEAT\n\n> \S.+\n\n/)
  })

  it('links the main sections of the site', async () => {
    const urls = getAllLinks(await getLlmsTxt()).map((l) => l.url)

    expect(urls).toInclude(
      'https://l2beat.com/layer2s/summary',
      'https://l2beat.com/layer2s/risk',
      'https://l2beat.com/layer2s/tvs',
      'https://l2beat.com/layer2s/activity',
      'https://l2beat.com/layer2s/liveness',
      'https://l2beat.com/layer2s/costs',
      'https://l2beat.com/stages',
      'https://l2beat.com/data-availability/summary',
      'https://l2beat.com/interop/summary',
      'https://l2beat.com/privacy/summary',
      'https://l2beat.com/zk-catalog',
      'https://l2beat.com/governance',
      'https://l2beat.com/glossary',
      'https://l2beat.com/faq',
      'https://l2beat.com/publications',
      'https://github.com/l2beat/l2beat',
    )
  })

  it('links every markdown alternate the site serves, and no other', async () => {
    const urls = getAllLinks(await getLlmsTxt())
      .map((l) => l.url)
      .filter((url) => url.endsWith('.md'))

    const registered = getRegisteredPaths(createMarkdownAlternatesRouter()).map(
      (path) => `https://l2beat.com${path}`,
    )
    expect(urls.toSorted()).toEqual(registered.toSorted())
  })

  it('stays small enough to fit in context, with project lists behind links', async () => {
    const body = await getLlmsTxt()

    const links = getAllLinks(body)
    expect(body.length).toBeLessThan(10_000)
    expect(links.length).toBeLessThan(60)
    expect(links.map((l) => l.url)).not.toInclude(
      'https://l2beat.com/layer2s/projects/arbitrum',
    )
  })

  it('keeps secondary links in the Optional section', async () => {
    const urls = getLinks(await getLlmsTxt(), 'Optional').map((l) => l.url)

    expect(urls).toInclude(
      'https://github.com/l2beat/l2beat',
      'https://l2beat.com/terms-of-service',
    )
  })

  it('lists exactly the /api endpoints the public API router registers', async () => {
    // Non-/api entries (e.g. markdown page alternates) are not JSON API
    // routes, so only /api links are held to the router.
    const urls = getLinks(await getLlmsTxt(), 'Public API')
      .map((l) => l.url)
      .filter((url) => url.startsWith('https://l2beat.com/api/'))

    const registered = getRegisteredPaths(createPublicApiRouter()).map(
      (path) => `https://l2beat.com${path.replaceAll(/:(\w+)/g, '{$1}')}`,
    )
    expect(urls.toSorted()).toEqual(registered.toSorted())
  })

  it('describes every link in one line', async () => {
    for (const link of getAllLinks(await getLlmsTxt())) {
      expect(link.description).toMatchRegex(/^\S.+/)
    }
  })

  async function getLlmsTxt() {
    const response = await fetchFromRouter(createLlmsTxtRouter(), '/llms.txt')
    return response.text()
  }
})

/** Links from every H2 section; the notes above the first H2 may hold plain list items. */
function getAllLinks(body: string) {
  const [, ...sections] = body.split('\n## ')
  return sections
    .join('\n')
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map(parseLink)
}

function getLinks(body: string, section: string) {
  const [, afterHeading] = body.split(`\n## ${section}\n`)
  expect(afterHeading).not.toEqual(undefined)
  const [sectionBody] = (afterHeading ?? '').split('\n## ')

  return (sectionBody ?? '')
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map(parseLink)
}

function parseLink(line: string) {
  const match = line.match(/^- \[(.+?)\]\((.+?)\): (.*)$/)
  expect(match).not.toEqual(null)
  return { url: match?.[2] ?? '', description: match?.[3] ?? '' }
}

function getRegisteredPaths(router: express.Router) {
  return router.stack.flatMap((layer) =>
    layer.route ? [String(layer.route.path)] : [],
  )
}
