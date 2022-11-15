import { HttpClient, Logger } from '@l2beat/common'
import { assert } from '@l2beat/common/src/tools/assert'
import { Layer2TransactionApi } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'

import { Config } from '../config'
import { createAztecProcessor } from '../core/activity/processors/AztecProcessor'
import { createLoopringProcessor } from '../core/activity/processors/LoopringProcessor'
import { createRpcProcessor } from '../core/activity/processors/RpcProcessor'
import { createStarkexProcessor } from '../core/activity/processors/StarkexProcessor'
import { createStarknetProcessor } from '../core/activity/processors/StarknetProcessor'
import { createZksyncProcessor } from '../core/activity/processors/ZksyncProcessor'
import { Clock } from '../core/Clock'
import { SequenceProcessor } from '../core/SequenceProcessor'
import { Project } from '../model'
import { BlockTransactionCountRepository } from '../peripherals/database/activity-v2/BlockTransactionCountRepository'
import { StarkexTransactionCountRepository } from '../peripherals/database/activity-v2/StarkexCountRepository'
import { SequenceProcessorRepository } from '../peripherals/database/SequenceProcessorRepository'
import { Database } from '../peripherals/database/shared/Database'
import { StarkexClient } from '../peripherals/starkex'

export function createSequenceProcessors(
  config: Config,
  logger: Logger,
  http: HttpClient,
  database: Database,
  clock: Clock,
): SequenceProcessor[] {
  assert(config.activityV2)
  const {
    activityV2: {
      starkexApiKey,
      starkexCallsPerMinute,
      starkexApiDelayHours,
      projects: activityProjects,
      allowedProjectIds,
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
  const blockRepository = new BlockTransactionCountRepository(database, logger)
  const starkexRepository = new StarkexTransactionCountRepository(
    database,
    logger,
  )
  const sequenceProcessorRepository = new SequenceProcessorRepository(
    database,
    logger,
  )

  // extra projects
  const ethereum = activityProjects.ethereum
  assert(ethereum?.type === 'rpc', 'Ethereum transactionApi config missing')
  const layer1Projects: [
    { projectId: ProjectId; transactionApi: Layer2TransactionApi },
  ] = [
    {
      projectId: ProjectId.ETHEREUM,
      transactionApi: {
        ...ethereum,
        startBlock: 8929324,
      },
    },
  ]

  return projects
    .filter(hasTransactionApi)
    .map(mergeWithConfig(activityProjects))
    .concat(layer1Projects)
    .filter(isProjectAllowed(allowedProjectIds, logger))
    .map(({ projectId, transactionApi }) => {
      switch (transactionApi.type) {
        case 'starkex':
          return createStarkexProcessor(
            projectId,
            starkexRepository,
            starkexClient,
            sequenceProcessorRepository,
            logger,
            clock,
            {
              ...transactionApi,
              starkexApiDelayHours,
              singleStarkexCPM,
            },
          )
        case 'aztec':
          return createAztecProcessor(
            projectId,
            blockRepository,
            http,
            sequenceProcessorRepository,
            logger,
            transactionApi,
          )
        case 'starknet':
          return createStarknetProcessor(
            projectId,
            blockRepository,
            http,
            sequenceProcessorRepository,
            logger,
            clock,
            transactionApi,
          )
        case 'zksync':
          return createZksyncProcessor(
            projectId,
            http,
            database,
            sequenceProcessorRepository,
            logger,
            transactionApi,
          )
        case 'loopring':
          return createLoopringProcessor(
            projectId,
            http,
            blockRepository,
            sequenceProcessorRepository,
            logger,
            transactionApi,
          )
        case 'rpc':
          return createRpcProcessor(
            projectId,
            blockRepository,
            sequenceProcessorRepository,
            logger,
            clock,
            transactionApi,
          )
      }
    })
}

const hasTransactionApi = (
  p: Project,
): p is Project & { transactionApi: Layer2TransactionApi } => !!p.transactionApi

function mergeWithConfig(
  activityProjects: Record<string, Layer2TransactionApi | undefined>,
) {
  return ({
    projectId,
    transactionApi,
  }: {
    projectId: ProjectId
    transactionApi: Layer2TransactionApi
  }) => ({
    projectId,
    transactionApi: {
      ...transactionApi,
      ...activityProjects[projectId.toString()],
    },
  })
}

function isProjectAllowed(
  allowedProjectIds: string[] | undefined,
  logger: Logger,
) {
  return (p: { projectId: ProjectId }) => {
    const noIdsSpecified = allowedProjectIds === undefined
    const projectIncluded = allowedProjectIds?.includes(p.projectId.toString())
    if (noIdsSpecified || projectIncluded) {
      return true
    } else {
      logger.info(`Skipping ${p.projectId.toString()} processor`)
      return false
    }
  }
}
