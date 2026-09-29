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
 * One `*` group for every crawler, AI ones included. A group naming a crawler
 * makes it ignore `*`, so add one only when a bot needs different rules.
 */
function getRobotsTxtBody(deploymentEnv: DeploymentEnv): string {
  if (deploymentEnv !== 'production') {
    return DISALLOW_EVERYTHING
  }

  const group = ['User-agent: *', ...PRODUCTION_RULES].join('\n')
  const sitemap = `Sitemap: ${PRODUCTION_ORIGIN}/sitemap.xml`

  return `${group}\n\n${sitemap}\n`
}
