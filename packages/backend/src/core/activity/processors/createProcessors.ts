import { HttpClient, Logger } from '@l2beat/common'
import { Layer2TransactionApi } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'

import { Config } from '../../../config'
import { Project } from '../../../model'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { Database } from '../../../peripherals/database/shared/Database'
import { BlockRepository } from '../../../peripherals/database/transactions/BlockRepository'
import { StarkexRepository } from '../../../peripherals/database/transactions/StarkexRepository'
import { StarkexClient } from '../../../peripherals/starkex'
import { assert } from '../../../tools/assert'
import { Clock } from '../../Clock'
import { SequenceProcessor } from '../../SequenceProcessor'
import { createAztecProcessor } from './createAztecProcessor'
import { createLoopringProcessor } from './createLoopringProcessor'
import { createRpcProcessor } from './createRpcProcessor'
import { createStarkexProcessor } from './createStarkexProcessor'
import { createStarknetProcessor } from './createStarknetProcessor'
import { createZksyncProcessor } from './createZksyncProcessor'

export function createSequenceProcessors(
  config: Config,
  logger: Logger,
  http: HttpClient,
  database: Database,
  clock: Clock,
): SequenceProcessor[] {
  assert(config.transactionCountSync)
  const {
    transactionCountSync: {
      starkexApiKey,
      starkexCallsPerMinute,
      starkexApiDelayHours,
      projects: activityProjects,
    },
    projects,
  } = config

  // shared clients
  const numberOfStarkexProjects =
    projects.filter((p) => p.transactionApi?.type === 'starkex').length || 1
  const singleStarkexCPM = starkexCallsPerMinute / numberOfStarkexProjects
  const starkexClient = new StarkexClient(starkexApiKey, http, logger, {
    callsPerMinute: singleStarkexCPM,
  })

  // shared repositories
  const blockRepository = new BlockRepository(database, logger)
  const starkexRepository = new StarkexRepository(database, logger)
  const sequenceProcessorRepository = new SequenceProcessorRepository(
    database,
    logger,
  )

  // extra projects
  const layer1Projects: [
    { projectId: ProjectId; transactionApi: Layer2TransactionApi },
  ] = [
    {
      projectId: ProjectId.ETHEREUM,
      transactionApi: {
        type: 'rpc',
        url: activityProjects.ethereum?.url,
        callsPerMinute: activityProjects.ethereum?.callsPerMinute,
        startBlock: 8929324,
      },
    },
  ]

  return projects
    .filter(
      (p): p is Project & { transactionApi: Layer2TransactionApi } =>
        !!p.transactionApi,
    )
    .map(({ projectId, transactionApi }) => ({ projectId, transactionApi }))
    .concat(layer1Projects)
    .map(({ projectId, transactionApi }) => {
      switch (transactionApi.type) {
        case 'starkex':
          return createStarkexProcessor({
            transactionApi,
            starkexApiDelayHours,
            singleStarkexCPM,
            starkexRepository,
            starkexClient,
            projectId,
            logger,
            sequenceProcessorRepository,
            clock,
          })
        case 'aztec':
          return createAztecProcessor({
            projectId,
            transactionApi,
            blockRepository,
            sequenceProcessorRepository,
            logger,
            http,
          })
        case 'starknet':
          return createStarknetProcessor({
            projectId,
            transactionApi,
            blockRepository,
            sequenceProcessorRepository,
            logger,
            http,
            clock,
          })
        case 'zksync':
          return createZksyncProcessor({
            projectId,
            transactionApi,
            sequenceProcessorRepository,
            logger,
            http,
            database,
          })
        case 'loopring':
          return createLoopringProcessor({
            projectId,
            transactionApi,
            sequenceProcessorRepository,
            logger,
            http,
            blockRepository,
          })
        case 'rpc':
          return createRpcProcessor({
            projectId,
            transactionApi,
            sequenceProcessorRepository,
            logger,
            blockRepository,
            clock,
          })
      }
    })
}
