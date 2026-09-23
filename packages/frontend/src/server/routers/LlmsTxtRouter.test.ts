import { expect } from 'earl'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { createLlmsTxtRouter } from './LlmsTxtRouter'
import { createPublicApiRouter } from './PublicApiRouter'

// Method: request /llms.txt over HTTP and check it against the llms.txt
// convention (H1 title, blockquote summary, H2 sections of `- [name](url): notes`
// links). The API list is compared with the routes the public API router
// actually registers, so a new or removed endpoint fails here until llms.txt
// is updated.
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
    const urls = getLinks(await getLlmsTxt(), 'Sections').map((l) => l.url)

    expect(urls).toInclude(
      'https://l2beat.com/layer2s/summary',
      'https://l2beat.com/layer2s/risk',
      'https://l2beat.com/layer2s/tvs',
      'https://l2beat.com/layer2s/activity',
      'https://l2beat.com/data-availability/summary',
      'https://l2beat.com/zk-catalog',
      'https://l2beat.com/glossary',
      'https://l2beat.com/faq',
      'https://l2beat.com/publications',
    )
  })

  it('lists exactly the public API endpoints the server registers', async () => {
    const urls = getLinks(await getLlmsTxt(), 'Public API').map((l) => l.url)

    const registered = getRegisteredPaths(createPublicApiRouter()).map(
      (path) => `https://l2beat.com${path.replaceAll(/:(\w+)/g, '{$1}')}`,
    )
    expect(urls.toSorted()).toEqual(registered.toSorted())
  })

  it('describes every link in one line', async () => {
    const body = await getLlmsTxt()

    for (const section of ['Sections', 'Public API']) {
      for (const link of getLinks(body, section)) {
        expect(link.description).toMatchRegex(/^\S.+/)
      }
    }
  })
})

async function getLlmsTxt() {
  const response = await fetchFromRouter(createLlmsTxtRouter(), '/llms.txt')
  return response.text()
}

function getLinks(body: string, section: string) {
  const [, afterHeading] = body.split(`\n## ${section}\n`)
  expect(afterHeading).not.toEqual(undefined)
  const [sectionBody] = (afterHeading ?? '').split('\n## ')

  return (sectionBody ?? '')
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => {
      const match = line.match(/^- \[(.+?)\]\((.+?)\): (.*)$/)
      expect(match).not.toEqual(null)
      return { url: match?.[2] ?? '', description: match?.[3] ?? '' }
    })
}

function getRegisteredPaths(router: ReturnType<typeof createPublicApiRouter>) {
  return router.stack.flatMap((layer) =>
    layer.route ? [String(layer.route.path)] : [],
  )
}
