import express from 'express'
import { env } from '~/env'

function getRobotsTxtBody(): string {
  const lines: string[] = ['User-agent: *']

  if (env.DEPLOYMENT_ENV === 'production') {
    lines.push('Allow: /')
    lines.push('Disallow: /api/')
    lines.push('Disallow: /dev/')
    lines.push('Sitemap: https://l2beat.com/sitemap.xml')
  } else {
    lines.push('Disallow: /')
  }

  return `${lines.join('\n')}\n`
}

export function createRobotsRouter() {
  const router = express.Router()

  router.get('/robots.txt', (_req, res) => {
    const body = getRobotsTxtBody()

    res.header('Content-Type', 'text/plain; charset=utf-8').send(body)
  })

  return router
}
