import express from 'express'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type { env } from '~/env'

type DeploymentEnv = typeof env.DEPLOYMENT_ENV

/** `/api/scaling/` is the public JSON API; the more specific Allow wins over `Disallow: /api/`. */
const PRODUCTION_RULES = [
  'Allow: /',
  'Allow: /api/scaling/',
  'Disallow: /api/',
  'Disallow: /dev/',
]

/**
 * Content Signals (contentsignals.org): L2BEAT is a public good, so search,
 * AI answers and AI training are all welcome to use the content.
 */
const CONTENT_SIGNAL = 'Content-Signal: ai-train=yes, search=yes, ai-input=yes'

/** Named so they are welcome explicitly, not only through `*`. */
const AI_CRAWLERS = ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot']

export function createRobotsRouter(deploymentEnv: DeploymentEnv) {
  const router = express.Router()
  const body = getRobotsTxtBody(deploymentEnv)

  router.get('/robots.txt', (_req, res) => {
    res.header('Content-Type', 'text/plain; charset=utf-8').send(body)
  })

  return router
}

const DISALLOW_EVERYTHING = 'User-agent: *\nDisallow: /\n'

/**
 * One group for every crawler. The AI crawlers are named in the `*` group
 * rather than given their own: a crawler obeys only the group naming it, so a
 * separate group would need the rules repeated.
 */
function getRobotsTxtBody(deploymentEnv: DeploymentEnv): string {
  if (deploymentEnv !== 'production') {
    return DISALLOW_EVERYTHING
  }

  const group = [
    ...[...AI_CRAWLERS, '*'].map((agent) => `User-agent: ${agent}`),
    CONTENT_SIGNAL,
    ...PRODUCTION_RULES,
  ].join('\n')
  const sitemap = `Sitemap: ${PRODUCTION_ORIGIN}/sitemap.xml`

  return `${group}\n\n${sitemap}\n`
}
