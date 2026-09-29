import express from 'express'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type { env } from '~/env'

type DeploymentEnv = typeof env.DEPLOYMENT_ENV

/**
 * A crawler that finds a group naming it ignores the `*` group, so these get
 * their own copy of the rules. Naming them makes the allow policy deliberate
 * rather than an accident of the wildcard.
 */
const AI_USER_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'Google-Extended',
]

/** `/api/scaling/` is the public JSON API; the more specific Allow wins over `Disallow: /api/`. */
const PRODUCTION_RULES = [
  'Allow: /',
  'Allow: /api/scaling/',
  'Disallow: /api/',
  'Disallow: /dev/',
]

export function createRobotsRouter(deploymentEnv: DeploymentEnv) {
  const router = express.Router()
  const body = getRobotsTxtBody(deploymentEnv)

  router.get('/robots.txt', (_req, res) => {
    res.header('Content-Type', 'text/plain; charset=utf-8').send(body)
  })

  return router
}

const DISALLOW_EVERYTHING = 'User-agent: *\nDisallow: /\n'

function getRobotsTxtBody(deploymentEnv: DeploymentEnv): string {
  if (deploymentEnv !== 'production') {
    return DISALLOW_EVERYTHING
  }

  const groups = ['*', ...AI_USER_AGENTS].map((userAgent) =>
    [`User-agent: ${userAgent}`, ...PRODUCTION_RULES].join('\n'),
  )
  const sitemap = `Sitemap: ${PRODUCTION_ORIGIN}/sitemap.xml`

  return `${[...groups, sitemap].join('\n\n')}\n`
}
