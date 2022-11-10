import { HttpClient, Logger } from '@l2beat/common'
import { AztecTransactionApi } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'

import { AztecClient } from '../../../peripherals/aztec'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { BlockCountRepository } from '../../../peripherals/database/transactions/BlockCountRepository'
import { BatchDownloader } from '../../BatchDownloader'
import { SequenceProcessor } from '../../SequenceProcessor'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createAztecProcessor({
  projectId,
  transactionApi,
  logger,
  sequenceProcessorRepository,
  http,
  blockRepository,
}: {
  projectId: ProjectId
  transactionApi: AztecTransactionApi
  blockRepository: BlockCountRepository
  logger: Logger
  http: HttpClient
  sequenceProcessorRepository: SequenceProcessorRepository
}): SequenceProcessor {
  const callsPerMinute = transactionApi.callsPerMinute ?? 60
  const batchSize = getBatchSizeFromCallsPerMinute(callsPerMinute)
  const client = new AztecClient(
    http,
    transactionApi.url,
    transactionApi.callsPerMinute,
  )
  const batchDownloader = new BatchDownloader(
    batchSize,
    client.getBlock.bind(client),
    logger,
  )
  return new SequenceProcessor({
    id: projectId.toString(),
    batchSize,
    logger,
    repository: sequenceProcessorRepository,
    startFrom: 0,
    getLast: async () => {
      const block = await client.getLatestBlock()
      return block.number
    },
    processRange: async (from, to, trx) => {
      const blocks = await batchDownloader.download(from, to)
      const toSave = blocks.map((b) => ({
        projectId,
        blockNumber: b.number,
        count: b.transactionCount,
        timestamp: b.timestamp,
      }))
      await blockRepository.addOrUpdateMany(toSave, trx)
    },
  })
}
