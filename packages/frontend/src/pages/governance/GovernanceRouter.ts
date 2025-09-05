import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '../../utils/Manifest'
import { getRedirectData } from '../redirect/getRedirectData'
import { getGovernanceData } from './GetGovernanceData'

export function createGovernanceRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  const router = express.Router()

  router.get('/governance', async (req, res) => {
    const data = await getGovernanceData(manifest, req.originalUrl)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/governance/ethereum-connect', (req, res) => {
    const data = getRedirectData(
      manifest,
      'https://form.typeform.com/to/YVrD7Ava',
      req.originalUrl,
      {
        image: '/meta-images/governance/ethereum-connect/opengraph-image.png',
        title: 'Ethereum Connect Survey',
        description:
          'Help us understand the needs of professionals in LATAM who want to learn more about crypto and Ethereum by filling this quick survey',
      },
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}
