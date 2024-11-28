import { Router } from 'express'
import { renderPage } from '../components/Page'
import { HomePage } from '../pages/Home'
import { DuckPage } from '../pages/Duck'

export function PageRouter(): Router {
  const router = Router()

  router.get('/', (_req, res) => {
    res.send(renderPage(HomePage, {}))
  })
  router.get('/duck', (_req, res) => {
    res.send(renderPage(DuckPage, {}))
  })

  return router
}
