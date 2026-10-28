import type { Logger } from '@l2beat/backend-tools'
import type { Parser } from '@l2beat/validate'
import express from 'express'
import type { ChainService } from './domain/ChainService'
import {
  BlockRequest,
  LatestRequest,
  type Stats,
  StatsRequest,
  type UopsChain,
  type UopsChainInfo,
} from './types'

export function createUopsRouter(
  chains: UopsChain[],
  chainServices: Map<string, ChainService>,
  logger: Logger,
): express.Router {
  const router = express.Router()
  const chainInfos: UopsChainInfo[] = chains.map((chain) => ({
    id: chain.id,
    name: chain.name,
    explorerUrl: chain.explorerUrl,
  }))

  function chainEndpoint<Request extends { chainId: string }>(
    Request: Parser<Request>,
    respond: (chainService: ChainService, request: Request) => Promise<unknown>,
  ): express.RequestHandler {
    return async (req, res) => {
      const parsed = Request.safeParse(req.body)
      if (!parsed.success) {
        res.status(400).json({ message: 'Invalid request body' })
        return
      }
      const chainService = chainServices.get(parsed.data.chainId)
      if (!chainService) {
        res.status(400).json({ message: 'Unsupported chain' })
        return
      }
      try {
        res.json(await respond(chainService, parsed.data))
      } catch (error) {
        logger.error('Uops request failed', {
          path: req.path,
          body: parsed.data,
          error,
        })
        res.status(502).json({ message: 'Could not read the chain' })
      }
    }
  }

  router.get('/api/uops/chains', (_, res) => {
    res.json(chainInfos)
  })

  router.post(
    '/api/uops/latest',
    express.json(),
    chainEndpoint(LatestRequest, (chainService) =>
      chainService.getBlockNumber(),
    ),
  )

  router.post(
    '/api/uops/block',
    express.json(),
    chainEndpoint(BlockRequest, (chainService, request) =>
      chainService.getBlock(request.blockNumber),
    ),
  )

  router.post(
    '/api/uops/stats',
    express.json(),
    chainEndpoint(StatsRequest, async (chainService, request) => {
      const endBlock =
        request.lastFetched !== undefined
          ? request.lastFetched - 1
          : await chainService.getBlockNumber()
      const startBlock = Math.max(0, endBlock - request.count + 1)
      const numberOfBlocks = endBlock - startBlock + 1
      const results = await chainService.analyzeBlocks(
        startBlock,
        numberOfBlocks,
      )
      const stats: Stats = { startBlock, endBlock, numberOfBlocks, ...results }
      return stats
    }),
  )

  return router
}
