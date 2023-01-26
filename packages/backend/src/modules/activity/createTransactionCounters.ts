import { assert, HttpClient, Logger } from '@l2beat/common'
import { Layer2TransactionApi } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'

import { Config } from '../../config'
import { createAztecConnectCounter } from '../../core/activity/counters/AztecConnectCounter'
import { createAztecCounter } from '../../core/activity/counters/AztecCounter'
import { createLoopringCounter } from '../../core/activity/counters/LoopringCounter'
import { createRpcCounter } from '../../core/activity/counters/RpcCounter'
import { createStarkexCounter } from '../../core/activity/counters/StarkexCounter'
import { createStarknetCounter } from '../../core/activity/counters/StarknetCounter'
import { createZksyncCounter } from '../../core/activity/counters/ZksyncCounter'
import { TransactionCounter } from '../../core/activity/TransactionCounter'
import { Clock } from '../../core/Clock'
import { Metrics } from '../../Metrics'
import { Project } from '../../model'
import { BlockTransactionCountRepository } from '../../peripherals/database/activity/BlockTransactionCountRepository'
import { StarkexTransactionCountRepository } from '../../peripherals/database/activity/StarkexCountRepository'
import { ZksyncTransactionRepository } from '../../peripherals/database/activity/ZksyncTransactionRepository'
import { SequenceProcessorRepository } from '../../peripherals/database/SequenceProcessorRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { StarkexClient } from '../../peripherals/starkex'

export function createTransactionCounters(
  config: Config,
  logger: Logger,
  http: HttpClient,
  database: Database,
  clock: Clock,
  metrics: Metrics,
): TransactionCounter[] {
  assert(config.activity)
  const {
    activity: {
      starkexApiKey,
      starkexCallsPerMinute,
      projects: activityConfigProjects,
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
  const blockRepository = new BlockTransactionCountRepository(
    database,
    logger,
    metrics,
  )
  const starkexRepository = new StarkexTransactionCountRepository(
    database,
    logger,
    metrics,
  )
  const sequenceProcessorRepository = new SequenceProcessorRepository(
    database,
    logger,
    metrics,
  )
  const zksyncRepository = new ZksyncTransactionRepository(
    database,
    logger,
    metrics,
  )

  // ethereum is kept separately in backend config, because it is not a layer 2 project
  const ethereumConfig = activityConfigProjects.ethereum
  assert(
    ethereumConfig?.type === 'rpc',
    'Ethereum transactionApi config missing',
  )
  const ethereum = {
    projectId: ProjectId.ETHEREUM,
    transactionApi: {
      ...ethereumConfig,
      startBlock: 8929324,
    },
  }

  const processors = projects
    .filter(hasTransactionApi)
    .map(mergeWithActivityConfigProjects(activityConfigProjects))
    .concat([ethereum])
    .filter(isProjectAllowed(allowedProjectIds, logger, metrics))
    .map(({ projectId, transactionApi }) => {
      switch (transactionApi.type) {
        case 'starkex':
          return createStarkexCounter(
            projectId,
            starkexRepository,
            starkexClient,
            sequenceProcessorRepository,
            logger,
            metrics,
            clock,
            {
              ...transactionApi,
              singleStarkexCPM,
            },
          )
        case 'aztec':
          return createAztecCounter(
            projectId,
            blockRepository,
            http,
            sequenceProcessorRepository,
            logger,
            metrics,
            transactionApi,
          )
        case 'aztecconnect':
          return createAztecConnectCounter(
            projectId,
            blockRepository,
            http,
            sequenceProcessorRepository,
            logger,
            metrics,
            transactionApi,
          )
        case 'starknet':
          return createStarknetCounter(
            projectId,
            blockRepository,
            http,
            sequenceProcessorRepository,
            logger,
            metrics,
            clock,
            transactionApi,
          )
        case 'zksync':
          return createZksyncCounter(
            projectId,
            http,
            zksyncRepository,
            sequenceProcessorRepository,
            logger,
            metrics,
            transactionApi,
          )
        case 'loopring':
          return createLoopringCounter(
            projectId,
            http,
            blockRepository,
            sequenceProcessorRepository,
            logger,
            metrics,
            transactionApi,
          )
        case 'rpc':
          return createRpcCounter(
            projectId,
            blockRepository,
            sequenceProcessorRepository,
            logger,
            metrics,
            clock,
            transactionApi,
          )
      }
    })

  return processors
}

const hasTransactionApi = (
  p: Project,
): p is Project & { transactionApi: Layer2TransactionApi } => !!p.transactionApi

function mergeWithActivityConfigProjects(
  activityV2ConfigProjects: Record<string, Layer2TransactionApi | undefined>,
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
      ...activityV2ConfigProjects[projectId.toString()],
    },
  })
}

function isProjectAllowed(
  allowedProjectIds: string[] | undefined,
  logger: Logger,
  metrics: Metrics,
) {
  return (p: { projectId: ProjectId }) => {
    const noIdsSpecified = allowedProjectIds === undefined
    const projectIncluded = allowedProjectIds?.includes(p.projectId.toString())
    const includedInApi = !!(noIdsSpecified || projectIncluded)
    if (!includedInApi) {
      logger.info(`Skipping ${p.projectId.toString()} processor`)
    }
    metrics.activityIncludedInApi
      .labels({ project: p.projectId.toString() })
      .set(Number(includedInApi))
    return includedInApi
  }
}
