import { SUPPORTED_CHAINS } from '@/chains'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { ApiError, LatestBlockApiRequest } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { loadDb } from './db/db'
import { ChainService } from './services/ChainService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<number | ApiError>,
) {
  console.log(`Received request: ${req.method} ${req.url}`)
  console.log(req.body)

  try {
    const input = JSON.parse(req.body) as LatestBlockApiRequest
    const chain = SUPPORTED_CHAINS.find((chain) => chain.id === input.chainId)

    if (!chain) {
      throw new Error(`Chain with id ${input.chainId} is not supported`)
    }

    const db = await loadDb()
    const chainService = new ChainService(chain, db)
    const blockNumber = await chainService.getBlockNumber()

    res.status(200).json(blockNumber)
  } catch (error) {
    console.error(error)
    const errorMessage =
      error instanceof Error ? error : new Error('An unknown error occurred')
    res.status(500).json({ message: errorMessage.message })
  }
}
