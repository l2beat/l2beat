import { SUPPORTED_CHAINS } from '@/chains'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {
  ApiError,
  Block,
  Stats,
  StatsApiRequest,
  UserOperationsApiRequest,
} from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { loadDb } from './db/db'
import { ChainService } from './services/ChainService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Stats | ApiError>,
) {
  console.log(`Received request: ${req.method} ${req.url}`)
  console.log(req.body)

  try {
    const input = JSON.parse(req.body) as StatsApiRequest
    const chain = SUPPORTED_CHAINS.find((chain) => chain.id === input.chainId)

    const db = await loadDb()

    if (!chain) {
      throw new Error(`Chain with id ${input.chainId} is not supported`)
    }

    const chainService = new ChainService(chain, db)
    const lastToFetch = input.lastFetched
      ? input.lastFetched - 1
      : await chainService.getBlockNumber()
    const startBlock = lastToFetch - input.count + 1

    const results = await chainService.analyzeBlocks(startBlock, input.count)

    const stats: Stats = {
      startBlock,
      endBlock: lastToFetch,
      numberOfBlocks: input.count,
      ...results,
    }

    res.status(200).json(stats)
  } catch (error) {
    console.error(error)
    const errorMessage =
      error instanceof Error ? error : new Error('An unknown error occurred')
    res.status(500).json({ message: errorMessage.message })
  }
}
