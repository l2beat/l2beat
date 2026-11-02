import express, { type Request, type Response } from 'express'
import { ETHEREUM_PROJECT_PATH } from '~/pages/ethereum/paths'
import { isChainProjectSlug } from '~/server/features/chains/getChainProjects'
import { ps } from '~/server/projects'
import { withQueryOf } from '~/server/utils/withQueryOf'

export function createLegacyPathsRouter() {
  const router = express.Router()

  router.get('/project/:name', (req, res) => {
    res.redirect(301, withQueryOf(req, `/layer2s/projects/${req.params.name}`))
  })

  // A live page, not a legacy path: skip the rest of this router.
  router.get(
    [ETHEREUM_PROJECT_PATH, `${ETHEREUM_PROJECT_PATH}.md`],
    (_req, _res, next) => next('router'),
  )

  router.get('/projects/:name', async (req, res, next) => {
    if (await isChainProjectSlug(req.params.name)) {
      next('router')
      return
    }
    res.redirect(301, withQueryOf(req, `/layer2s/projects/${req.params.name}`))
  })

  router.get('/scaling/tvl', (req, res) => {
    res.redirect(301, withQueryOf(req, '/layer2s/tvs'))
  })

  router.get('/scaling/detailedTvl', (req, res) => {
    res.redirect(301, withQueryOf(req, '/layer2s/tvs'))
  })

  router.get('/scaling/finality', (req, res) => {
    res.redirect(301, withQueryOf(req, '/layer2s/summary'))
  })

  router.get('/scaling/projects/:name/tvl-breakdown', (req, res) => {
    res.redirect(
      301,
      withQueryOf(req, `/layer2s/projects/${req.params.name}/tvs-breakdown`),
    )
  })

  router.get('/data-availability/projects/:name/dac', (req, res) => {
    res.redirect(301, withQueryOf(req, `/layer2s/projects/${req.params.name}`))
  })

  // Before the catch-all below: Ethereum's page outlived the other DA pages.
  router.get('/data-availability/projects/ethereum/ethereum', (req, res) => {
    res.redirect(301, withQueryOf(req, ETHEREUM_PROJECT_PATH))
  })
  router.get('/data-availability/projects/ethereum/ethereum.md', (req, res) => {
    res.redirect(301, withQueryOf(req, `${ETHEREUM_PROJECT_PATH}.md`))
  })

  // Blobs replaced the data availability pages.
  router.get(
    ['/data-availability', '/data-availability/*splat', '/da-risk-framework'],
    (req, res) => {
      res.redirect(301, withQueryOf(req, '/blobs'))
    },
  )

  router.get('/governance/publications/:id', (req, res) => {
    res.redirect(301, withQueryOf(req, `/publications/${req.params.id}`))
  })

  router.get('/scaling/data-availability', (req, res) => {
    res.redirect(301, withQueryOf(req, '/layer2s/risk/data-availability'))
  })

  router.get('/scaling/sequencing', (req, res) => {
    res.redirect(301, withQueryOf(req, '/layer2s/risk/sequencing'))
  })

  router.get('/scaling', (req, res) => {
    res.redirect(301, withQueryOf(req, '/layer2s/summary'))
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

  // The bridges section became Interop: a bridge page goes to the protocol
  // that took its place.
  const redirectBridgePage = async (
    req: Request<{ slug: string }>,
    res: Response,
  ) => {
    const protocolPath = await findInteropProtocolPath(req.params.slug)
    res.redirect(301, withQueryOf(req, protocolPath ?? '/interop'))
  }
  router.get('/bridges/projects/:slug', redirectBridgePage)
  router.get('/bridges/projects/:slug/*splat', redirectBridgePage)
  router.get(['/bridges', '/bridges/*splat'], (req, res) => {
    res.redirect(301, withQueryOf(req, '/interop'))
  })

  return router
}

async function findInteropProtocolPath(bridgeSlug: string) {
  const slug = BRIDGE_TO_INTEROP_SLUG.get(bridgeSlug) ?? bridgeSlug
  const protocol = await ps.getProject({ slug, select: ['interopConfig'] })
  return protocol && `/interop/protocols/${protocol.slug}`
}

/**
 * Bridge pages whose protocol lives on under another slug. Only links the
 * config makes plain: the protocol tracks the same contracts or token
 * framework the bridge page did. Every other bridge slug either matches a
 * protocol slug (across, cbridge, debridge, stargate, ...) or has no
 * successor and falls back to the Interop summary.
 */
const BRIDGE_TO_INTEROP_SLUG = new Map([
  // Stargate's interop config tracks the v2 pools and TokenMessaging.
  ['stargatev2', 'stargate'],
  // LayerZero's interop config is the OFT framework.
  ['layerzerov2oft', 'layerzero'],
  // Portal was Wormhole's token bridge, now Wormhole WTT.
  ['portal', 'wormhole-wtt'],
])
