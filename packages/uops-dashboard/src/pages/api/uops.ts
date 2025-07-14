import type { NextApiRequest, NextApiResponse } from 'next'
import { SUPPORTED_CHAINS } from '@/chains'
import type { ApiError, CountedBlock, UserOperationsApiRequest } from '@/types'
import { loadDb, saveDb } from '../../server/db/db'
import { ChainService } from '../../server/services/ChainService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CountedBlock | ApiError>,
) {
  console.log(`Received request: ${req.method} ${req.url}`)
  console.log(req.body)

  try {
    const input = JSON.parse(req.body) as UserOperationsApiRequest
    const chain = SUPPORTED_CHAINS.find((chain) => chain.id === input.chainId)

    const db = await loadDb()

    if (!chain) {
      throw new Error(`Chain with id ${input.chainId} is not supported`)
    }

    const chainService = new ChainService(chain, db)
    const block = await chainService.getBlock(input.blockNumber)
    await saveDb(db)

    res.status(200).json(block)
  } catch (error) {
    console.error(error)
    const errorMessage =
      error instanceof Error ? error : new Error('An unknown error occurred')
    res.status(500).json({ message: errorMessage.message })
  }
}
