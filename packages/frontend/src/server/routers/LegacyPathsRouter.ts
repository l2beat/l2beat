import express from 'express'
import { ETHEREUM_PROJECT_PATH } from '~/pages/ethereum/paths'
import { PRIVACY_ADVICE_HREF } from '~/pages/privacy/methodology/paths'
import {
  getProjectOgImagePath,
  getProjectPath,
  PROJECT_REDIRECT_CACHE_CONTROL,
} from '~/utils/project/getProjectUrl'

export function createLegacyPathsRouter() {
  const router = express.Router()

  router.get('/project/:name', (req, res) => {
    res.setHeader('Cache-Control', PROJECT_REDIRECT_CACHE_CONTROL)
    res.redirect(301, getProjectPath(req.params.name))
  })

  router.get('/scaling/tvl', (_, res) => {
    res.redirect(301, '/layer2s/tvs')
  })

  router.get('/scaling/detailedTvl', (_, res) => {
    res.redirect(301, '/layer2s/tvs')
  })

  router.get('/scaling/finality', (_, res) => {
    res.redirect(301, '/layer2s/summary')
  })

  router.get('/scaling/projects/:name/tvl-breakdown', (req, res) => {
    res.redirect(301, `${getProjectPath(req.params.name)}/tvs-breakdown`)
  })

  // Straight to the page, not through /layer2s/projects/{name}. Also takes
  // "{name}.md".
  router.get('/scaling/projects/:name', (req, res) => {
    const query = req.originalUrl.slice(req.path.length)
    res.setHeader('Cache-Control', PROJECT_REDIRECT_CACHE_CONTROL)
    res.redirect(301, `${getProjectPath(req.params.name)}${query}`)
  })

  router.get('/data-availability/projects/:name/dac', (req, res) => {
    res.redirect(301, getProjectPath(req.params.name))
  })

  // Before the catch-all below: Ethereum's page outlived the other DA pages.
  router.get('/data-availability/projects/ethereum/ethereum', (_req, res) => {
    res.redirect(301, ETHEREUM_PROJECT_PATH)
  })
  router.get(
    '/data-availability/projects/ethereum/ethereum.md',
    (_req, res) => {
      res.redirect(301, `${ETHEREUM_PROJECT_PATH}.md`)
    },
  )

  // Blobs replaced the data availability pages.
  router.get(
    ['/data-availability', '/data-availability/*splat', '/da-risk-framework'],
    (_req, res) => {
      res.redirect(301, '/blobs')
    },
  )

  // The L2 list replaced the ecosystem pages, which grouped its projects.
  router.get(['/ecosystems', '/ecosystems/*splat'], (_req, res) => {
    res.redirect(301, '/layer2s/summary')
  })

  // Merged into the methodology's How to stay private section.
  router.get('/publications/privacy-best-practices', (_, res) => {
    res.redirect(301, PRIVACY_ADVICE_HREF)
  })

  // A project has one social image now. Pages shared before that still name
  // the image of a section.
  for (const section of [
    'layer2s',
    'interop',
    'zk-catalog',
    'privacy',
    'defi',
  ]) {
    router.get(
      `/meta-images/${section}/projects/:slug/opengraph-image.png`,
      (req, res) => {
        res.redirect(301, getProjectOgImagePath(req.params.slug))
      },
    )
  }

  router.get('/governance/publications/:id', (req, res) => {
    res.redirect(301, `/publications/${req.params.id}`)
  })

  router.get('/scaling/data-availability', (_, res) => {
    res.redirect(301, '/layer2s/risk/data-availability')
  })

  router.get('/scaling/sequencing', (_, res) => {
    res.redirect(301, '/layer2s/risk/sequencing')
  })

  router.get('/scaling', (_, res) => {
    res.redirect(301, '/layer2s/summary')
  })

  router.get('/scaling/*splat', (req, res) => {
    const target = req.originalUrl.replace(/^\/scaling\//, '/layer2s/')
    // The literal prefix guarantees a same-origin path (cannot start with "//"
    // or a scheme), so the user-provided remainder cannot redirect off-site.
    if (!target.startsWith('/layer2s/')) {
      res.redirect(301, '/layer2s/summary')
      return
    }
    res.redirect(301, target)
  })

  router.get('/interop/tokens/*splat', (req, res) => {
    // Case-insensitive like Express routing, so every matched URL is rewritten.
    const target = req.originalUrl.replace(/^\/interop\/tokens\//i, '/tokens/')
    // Same-origin check as in the /scaling redirect above.
    if (!target.startsWith('/tokens/')) {
      res.redirect(301, '/tokens')
      return
    }
    res.redirect(301, target)
  })

  router.get('/bridges/*splat', (_req, res) => {
    res.redirect(301, '/interop')
  })
  router.get('/bridges', (_req, res) => {
    res.redirect(301, '/interop')
  })

  return router
}
