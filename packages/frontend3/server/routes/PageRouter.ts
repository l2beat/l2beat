import { Router } from 'express'
import { renderPage } from '../components/Page'
import { ActivityPage } from '../pages/ActivityPage'
import { DuckPage } from '../pages/DuckPage'
import { HomePage } from '../pages/HomePage'

export function PageRouter(): Router {
  const router = Router()

  router.get('/', (_req, res) => {
    res.send(renderPage(HomePage, {}))
  })
  router.get('/activity', (_req, res) => {
    res.send(
      renderPage(ActivityPage, {
        projects: [
          {
            id: 'foo',
            name: 'Foo Chain',
            currentTps: 123,
            maxTps: 500,
          },
          {
            id: 'bar',
            name: 'BarL2',
            currentTps: 50,
            maxTps: 200,
          },
        ],
      }),
    )
  })
  router.get('/duck', (_req, res) => {
    res.send(renderPage(DuckPage, {}))
  })

  return router
}
