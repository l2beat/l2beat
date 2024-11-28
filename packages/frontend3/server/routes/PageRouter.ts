import { Router } from 'express'
import { renderPage } from '../components/Page'
import { ActivityPage } from '../pages/ActivityPage'
import { DuckPage } from '../pages/DuckPage'
import { HomePage } from '../pages/HomePage'
import { IActivityService } from '../services/ActivityService'

export function PageRouter(activityService: IActivityService): Router {
  const router = Router()

  router.get('/', (_req, res) => {
    res.send(renderPage(HomePage, {}))
  })
  router.get('/activity', async (_req, res) => {
    const projects = await activityService.getActivityProjects()
    res.send(renderPage(ActivityPage, { projects }))
  })
  router.get('/duck', (_req, res) => {
    res.send(renderPage(DuckPage, {}))
  })

  return router
}
