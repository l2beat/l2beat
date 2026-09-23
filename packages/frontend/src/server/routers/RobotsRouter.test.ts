import { expect } from 'earl'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { createRobotsRouter } from './RobotsRouter'

// Method: request /robots.txt over HTTP and group the rules the way a crawler
// does (RFC 9309): consecutive User-agent lines share the rules that follow.
describe(createRobotsRouter.name, () => {
  const AI_USER_AGENTS = [
    'GPTBot',
    'ClaudeBot',
    'Claude-SearchBot',
    'PerplexityBot',
    'Google-Extended',
    'OAI-SearchBot',
  ]

  it('serves plain text', async () => {
    const response = await fetchFromRouter(
      createRobotsRouter('production'),
      '/robots.txt',
    )

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type')).toEqual(
      'text/plain; charset=utf-8',
    )
  })

  describe('in production', () => {
    it('gives every AI user agent the same rules as everyone else', async () => {
      const groups = parseRobotsTxt(await getRobotsTxt('production'))

      const everyone = groups.get('*')
      expect(everyone).not.toEqual(undefined)
      for (const agent of AI_USER_AGENTS) {
        expect(groups.get(agent)).toEqual(everyone)
      }
    })

    it('allows the site and the public scaling API, hides the rest of the API and /dev', async () => {
      const rules = parseRobotsTxt(await getRobotsTxt('production')).get('*')

      expect(rules).toEqual([
        'Allow: /',
        'Allow: /api/scaling/',
        'Disallow: /api/',
        'Disallow: /dev/',
      ])
    })

    it('points to the sitemap', async () => {
      const body = await getRobotsTxt('production')

      expect(body).toInclude('Sitemap: https://l2beat.com/sitemap.xml')
    })
  })

  for (const deploymentEnv of ['staging', 'preview', undefined] as const) {
    it(`disallows everything when deployment env is ${deploymentEnv}`, async () => {
      const body = await getRobotsTxt(deploymentEnv)

      expect(body).toEqual('User-agent: *\nDisallow: /\n')
    })
  }
})

async function getRobotsTxt(
  deploymentEnv: Parameters<typeof createRobotsRouter>[0],
) {
  const response = await fetchFromRouter(
    createRobotsRouter(deploymentEnv),
    '/robots.txt',
  )
  return response.text()
}

function parseRobotsTxt(body: string): Map<string, string[]> {
  const groups = new Map<string, string[]>()
  let rules: string[] = []
  let collectingAgents = false

  for (const line of body.split('\n')) {
    if (line.startsWith('User-agent: ')) {
      if (!collectingAgents) {
        rules = []
        collectingAgents = true
      }
      groups.set(line.slice('User-agent: '.length), rules)
    } else if (line.startsWith('Allow: ') || line.startsWith('Disallow: ')) {
      collectingAgents = false
      rules.push(line)
    }
  }

  return groups
}
