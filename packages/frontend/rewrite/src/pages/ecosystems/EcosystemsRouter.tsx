import type { Router } from 'express'
import { validateRoute } from 'rewrite/src/utils/validateRoute'
import { z } from 'zod'
import { env } from '~/env'
import type { Manifest } from '../../../../src/utils/Manifest'
import type { RenderFunction } from '../../ssr/server'
import { getEcosystemProjectData } from './project/getEcosystemProjectData'

export function EcosystemsRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get(
    '/ecosystems/:slug',
    validateRoute({
      params: z.object({
        slug: z.string(),
      }),
    }),
    async (req, res) => {
      const data = await getEcosystemProjectData(
        manifest,
        req.params.slug,
        req.originalUrl,
      )
      if (!data || !env.NEXT_PUBLIC_ECOSYSTEMS) {
        res.status(404).send('Not found')
        return
      }
      const html = render(data, req.originalUrl)
      res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
    },
  )
}
