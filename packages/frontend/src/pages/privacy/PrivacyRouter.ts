import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import express from 'express'

export function createPrivacyRouter() {
  const router = express.Router()

  router.get('/privacy', (_req, res) => {
    const html = readFileSync(
      resolve(process.cwd(), 'src/pages/privacy/dashboard.html'),
      'utf-8',
    )
    res.status(200).type('html').send(html)
  })

  return router
}
