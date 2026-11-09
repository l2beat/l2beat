import { expect } from 'earl'
import type express from 'express'
import { env } from '~/env'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import {
  LIST_PAGES_WITH_MARKDOWN,
  PROJECT_PAGES_WITH_MARKDOWN,
} from '~/utils/getMarkdownAlternatePath'
import { createLlmsTxtRouter } from './LlmsTxtRouter'
import { createPublicApiRouter } from './PublicApiRouter'

// Method: request /llms.txt over HTTP and check it against the llms.txt spec
// (H1 title, blockquote summary, H2 sections of `- [name](url): notes` links,
// small enough to fit in context). The API list is compared with the routes
// the public API router registers and the .md links with the pages registered
// as having a markdown version, so a new or removed one fails here until
// llms.txt is updated.
describe(createLlmsTxtRouter.name, () => {
  it('serves markdown as plain text', async () => {
    const response = await fetchFromRouter(createLlmsTxtRouter(), '/llms.txt')

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type')).toEqual(
      'text/plain; charset=utf-8',
    )
  })

  it('serves the same map as the homepage when Accept prefers markdown', async () => {
    const response = await fetchFromRouter(createLlmsTxtRouter(), '/', {
      headers: { Accept: 'text/markdown' },
    })

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type')).toEqual(
      'text/markdown; charset=utf-8',
    )
    expect(response.headers.get('vary')).toEqual('Accept')
    expect(await response.text()).toEqual(await getLlmsTxt())
  })

  it('leaves the homepage to the HTML page for browsers', async () => {
    // Nothing else is mounted here, so falling through shows up as a 404.
    const response = await fetchFromRouter(createLlmsTxtRouter(), '/', {
      headers: { Accept: 'text/html' },
    })

    expect(response.status).toEqual(404)
    expect(response.headers.get('vary')).toEqual('Accept')
  })

  it('opens with the ETHBEAT title, naming L2BEAT too, and a one-paragraph summary', async () => {
    const body = await getLlmsTxt()

    expect(body).toMatchRegex(/^# ETHBEAT \(formerly L2BEAT\)\n\n> \S.+\n\n/)
  })

  it('links the main sections of the site', async () => {
    const urls = getAllLinks(await getLlmsTxt()).map((l) => l.url)

    expect(urls).toInclude(
      'https://ethbeat.org/layer2s/summary',
      'https://ethbeat.org/layer2s/risk',
      'https://ethbeat.org/layer2s/tvs',
      'https://ethbeat.org/layer2s/activity',
      'https://ethbeat.org/layer2s/liveness',
      'https://ethbeat.org/layer2s/costs',
      'https://ethbeat.org/stages',
      'https://ethbeat.org/interop/summary',
      'https://ethbeat.org/privacy/summary',
      'https://ethbeat.org/zk-catalog',
      ...(env.CLIENT_SIDE_OSSIFICATION_ENABLED
        ? ['https://ethbeat.org/ossification']
        : []),
      'https://ethbeat.org/governance',
      'https://ethbeat.org/glossary',
      'https://ethbeat.org/faq',
      'https://ethbeat.org/publications',
      'https://github.com/l2beat/l2beat',
    )
  })

  it('links every markdown alternate the site serves, and no other', async () => {
    const urls = getAllLinks(await getLlmsTxt())
      .map((l) => l.url)
      .filter((url) => url.endsWith('.md'))

    const registered = [
      ...LIST_PAGES_WITH_MARKDOWN,
      ...PROJECT_PAGES_WITH_MARKDOWN,
    ].map((page) => `https://ethbeat.org${toUrlTemplate(page)}.md`)
    expect(urls.toSorted()).toEqual(registered.toSorted())
  })

  it('documents the markdown version of project pages', async () => {
    const urls = getLinks(await getLlmsTxt(), 'Markdown pages').map(
      (l) => l.url,
    )

    expect(urls).toEqual([
      'https://ethbeat.org/projects/{slug}.md',
      'https://ethbeat.org/tokens/{slug}.md',
    ])
  })

  it('stays small enough to fit in context, with project lists behind links', async () => {
    const body = await getLlmsTxt()

    const links = getAllLinks(body)
    expect(body.length).toBeLessThan(12_000)
    expect(links.length).toBeLessThan(60)
    expect(links.map((l) => l.url)).not.toInclude(
      'https://ethbeat.org/projects/arbitrum',
    )
  })

  it('tells agents when to use the site, before the link sections', async () => {
    const body = await getLlmsTxt()
    const [notes] = body.split('\n## ')

    expect(notes ?? '').toInclude('When to use ETHBEAT:')
  })

  // The edge cache caveat applies to every page, not to one entry.
  it('tells agents to prefer the .md URLs, before the link sections', async () => {
    const body = await getLlmsTxt()
    const [notes] = body.split('\n## ')

    expect(notes ?? '').toInclude('Prefer the .md URLs')
    expect(body.split('edge cache').length - 1).toEqual(1)
  })

  it('keeps secondary links in the Optional section', async () => {
    const urls = getLinks(await getLlmsTxt(), 'Optional').map((l) => l.url)

    expect(urls).toInclude(
      'https://github.com/l2beat/l2beat',
      'https://ethbeat.org/terms-of-service',
    )
  })

  it('lists exactly the /api endpoints the public API router registers', async () => {
    // Non-/api entries (e.g. markdown page alternates) are not JSON API
    // routes, so only /api links are held to the router.
    const urls = getLinks(await getLlmsTxt(), 'Public API')
      .map((l) => l.url)
      .filter((url) => url.startsWith('https://ethbeat.org/api/'))

    const registered = getRegisteredPaths(createPublicApiRouter()).map(
      (path) => `https://ethbeat.org${toUrlTemplate(path)}`,
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

/** Express writes a path parameter as `:slug`, llms.txt as `{slug}`. */
/** llms.txt documents the shortest URL of a page, without its optional segments. */
function toUrlTemplate(routePath: string) {
  return routePath.replaceAll(/\{[^}]*\}/g, '').replaceAll(/:(\w+)/g, '{$1}')
}

function getRegisteredPaths(router: express.Router) {
  return router.stack.flatMap((layer) =>
    layer.route ? [String(layer.route.path)] : [],
  )
}
