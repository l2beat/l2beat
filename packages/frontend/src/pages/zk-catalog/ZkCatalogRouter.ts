import express from 'express'
import { z } from 'zod'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderFunction } from '~/ssr/types'
import { validateRoute } from '~/utils/validateRoute'
import type { Manifest } from '../../utils/Manifest'
import { getZkCatalogProjectData } from './project/getZkCatalogProjectData'
import { getZkCatalogV1Data } from './v1/getZkCatalogV1Data'

export function createZkCatalogRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: ICache,
) {
  const router = express.Router()

  router.get('/zk-catalog', async (req, res) => {
    const appLayoutProps = await getAppLayoutProps()

    const html = render(
      {
        head: {
          manifest,
          metadata: getMetadata(manifest, {
            title: 'ZK Catalog - L2BEAT',
            description: 'A catalog of the ZK projects with detailed research.',
            openGraph: {
              url: req.originalUrl,
              image: '/meta-images/zk-catalog/opengraph-image.png',
            },
          }),
        },
        ssr: {
          page: 'ZkCatalogPage',
          props: {
            ...appLayoutProps,
          },
        },
      },
      req.originalUrl,
    )
    res.status(200).send(html)
  })

  router.get('/zk-catalog/v1', async (req, res) => {
    const data = await cache.get(
      { key: ['zk-catalog'], ttl: 5 * 60, staleWhileRevalidate: 25 * 60 },
      () => getZkCatalogV1Data(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/zk-catalog/:slug',
    validateRoute({
      params: z.object({ slug: z.string() }),
    }),
    async (req, res) => {
      const data = await cache.get(
        {
          key: ['zk-catalog', 'projects', req.params.slug],
          ttl: 5 * 60,
          staleWhileRevalidate: 25 * 60,
        },
        () =>
          getZkCatalogProjectData(manifest, req.params.slug, req.originalUrl),
      )
      if (!data) {
        res.status(404).send('Not found')
        return
      }
      const html = render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  return router
}
