import express, { type Router } from 'express'
import { SUPPORTED_CHAINS } from '@/chains'
import { API, type ApiError, type Endpoint } from '@/types'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { type DB, loadDb, saveDb } from './db/db'
import { ChainService } from './services/ChainService'

export function createApiRouter(): Router {
  const router = express.Router()
  router.use(express.json())

  router.post(
    API.latest.path,
    chainEndpoint(API.latest, (chainService) => chainService.getBlockNumber()),
  )

  router.post(
    API.uops.path,
    chainEndpoint(API.uops, async (chainService, request, db) => {
      const block = await chainService.getBlock(request.blockNumber)
      await saveDb(db)
      return block
    }),
  )

  router.post(
    API.stats.path,
    chainEndpoint(API.stats, async (chainService, request) => {
      const endBlock = request.lastFetched
        ? request.lastFetched - 1
        : await chainService.getBlockNumber()
      const startBlock = endBlock - request.count + 1

      return {
        startBlock,
        endBlock,
        numberOfBlocks: request.count,
        ...(await chainService.analyzeBlocks(startBlock, request.count)),
      }
    }),
  )

  return router
}

function chainEndpoint<Request extends { chainId: string }, Response>(
  endpoint: Endpoint<Request, Response>,
  respond: (
    chainService: ChainService,
    request: Request,
    db: DB,
  ) => Promise<Response>,
): express.RequestHandler<unknown, Response | ApiError> {
  return async (req, res) => {
    console.log(`Received request: ${req.method} ${req.originalUrl}`)
    console.log(req.body)

    const parsed = endpoint.Request.safeParse(req.body)
    if (!parsed.success) {
      const message = `Invalid request body at ${parsed.path}: ${parsed.message}`
      res.status(400).json({ message })
      return
    }
    const request = parsed.data

    try {
      const chain = SUPPORTED_CHAINS.find((c) => c.id === request.chainId)
      if (!chain) {
        throw new Error(`Chain with id ${request.chainId} is not supported`)
      }

      const db = await loadDb()
      const response = await respond(new ChainService(chain, db), request, db)
      res.status(200).json(response)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: getErrorMessage(error) })
    }
  }
}
