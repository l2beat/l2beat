import { expect } from 'earl'
import type { LlmsTxtSection } from '~/server/llmsTxtProjects'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { createLlmsTxtRouter } from './LlmsTxtRouter'
import { createPublicApiRouter } from './PublicApiRouter'

// Method: request /llms.txt over HTTP with injected project sections and check
// it against the llms.txt convention (H1 title, blockquote summary, H2 sections
// of `- [name](url): notes` links). The API list is compared with the routes
// the public API router actually registers, so a new or removed endpoint fails
// here until llms.txt is updated.
describe(createLlmsTxtRouter.name, () => {
  const PROJECT_SECTIONS: LlmsTxtSection[] = [
    {
      heading: 'Layer 2 projects (/layer2s/projects/{slug})',
      links: [
        {
          name: 'Arbitrum One',
          path: '/layer2s/projects/arbitrum',
          description: 'Optimistic Rollup, Stage 1. A general-purpose rollup.',
        },
      ],
    },
  ]

  it('serves markdown', async () => {
    const response = await fetchFromRouter(createRouter(), '/llms.txt')

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

  it('lists every tracked project under its tracker', async () => {
    const links = getLinks(
      await getLlmsTxt(),
      'Layer 2 projects (/layer2s/projects/{slug})',
    )

    expect(links).toEqual([
      {
        url: 'https://l2beat.com/layer2s/projects/arbitrum',
        description: 'Optimistic Rollup, Stage 1. A general-purpose rollup.',
      },
    ])
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

  function createRouter() {
    return createLlmsTxtRouter({
      getProjectSections: () => Promise.resolve(PROJECT_SECTIONS),
    })
  }

  async function getLlmsTxt() {
    const response = await fetchFromRouter(createRouter(), '/llms.txt')
    return response.text()
  }
})

function getAllLinks(body: string) {
  return body
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

function getRegisteredPaths(router: ReturnType<typeof createPublicApiRouter>) {
  return router.stack.flatMap((layer) =>
    layer.route ? [String(layer.route.path)] : [],
  )
}
