import express, { type Router } from 'express'
import { SUPPORTED_CHAINS } from '@/chains'
import type {
  ApiError,
  CountedBlock,
  LatestBlockApiRequest,
  Stats,
  StatsApiRequest,
  UserOperationsApiRequest,
} from '@/types'
import { type DB, loadDb, saveDb } from './db/db'
import { ChainService } from './services/ChainService'

export function createApiRouter(): Router {
  const router = express.Router()
  router.use(express.json())

  router.post(
    '/latest',
    chainEndpoint<LatestBlockApiRequest, number>((chainService) =>
      chainService.getBlockNumber(),
    ),
  )

  router.post(
    '/uops',
    chainEndpoint<UserOperationsApiRequest, CountedBlock>(
      async (chainService, input, db) => {
        const block = await chainService.getBlock(input.blockNumber)
        await saveDb(db)
        return block
      },
    ),
  )

  router.post(
    '/stats',
    chainEndpoint<StatsApiRequest, Stats>(async (chainService, input) => {
      const lastToFetch = input.lastFetched
        ? input.lastFetched - 1
        : await chainService.getBlockNumber()
      const startBlock = lastToFetch - input.count + 1

      const results = await chainService.analyzeBlocks(startBlock, input.count)

      return {
        startBlock,
        endBlock: lastToFetch,
        numberOfBlocks: input.count,
        ...results,
      }
    }),
  )

  return router
}

function chainEndpoint<Input extends { chainId: string }, Output>(
  respond: (
    chainService: ChainService,
    input: Input,
    db: DB,
  ) => Promise<Output>,
): express.RequestHandler<unknown, Output | ApiError> {
  return async (req, res) => {
    console.log(`Received request: ${req.method} ${req.originalUrl}`)
    console.log(req.body)

    try {
      const input = req.body as Input
      const chain = SUPPORTED_CHAINS.find((chain) => chain.id === input.chainId)
      if (!chain) {
        throw new Error(`Chain with id ${input.chainId} is not supported`)
      }

      const db = await loadDb()
      const output = await respond(new ChainService(chain, db), input, db)
      res.status(200).json(output)
    } catch (error) {
      console.error(error)
      const message =
        error instanceof Error ? error.message : 'An unknown error occurred'
      res.status(500).json({ message })
    }
  }
}
