import { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express from 'express'
import { validateRoute } from '~/utils/validateRoute'
import { getDiscolupeProjects } from './getDiscolupeProjects'
import { getHotPages } from './getHotPages'
import { getLivenessTxs } from './getLivenessTxs'
import { getLogoGeneratorProjects } from './getLogoGeneratorProjects'

export function createInternalApiRouter() {
  const router = express.Router()

  router.use('/api', (_, res, next) => {
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
    })
    res.setHeaders(headers)
    next()
  })

  router.get('/api/hot-pages', async (_, res) => {
    const hotPages = await getHotPages()
    res.json(hotPages)
  })

  router.get('/api/discolupe', async (_, res) => {
    const discolupeProjects = await getDiscolupeProjects()
    res.json({
      success: true,
      data: discolupeProjects,
    })
  })

  router.get('/api/logo-generator', async (_, res) => {
    const logoGeneratorProjects = await getLogoGeneratorProjects()
    res.json(logoGeneratorProjects)
  })

  router.get(
    '/api/liveness-txs/:projectId',
    validateRoute({
      params: v.object({ projectId: v.string() }),
      query: v.object({ subtype: TrackedTxsConfigSubtype.optional() }),
    }),
    async (req, res) => {
      const livenessTxs = await getLivenessTxs(
        req.params.projectId,
        req.query.subtype ?? 'batchSubmissions',
      )
      res.json(livenessTxs)
    },
  )

  return router
}
