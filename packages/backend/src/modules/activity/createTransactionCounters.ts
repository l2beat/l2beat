import { Layer2TransactionApi } from '@l2beat/config'
import { HttpClient, Logger } from '@l2beat/shared'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { Gauge } from 'prom-client'

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
  const blockRepository = new BlockTransactionCountRepository(database, logger)
  const starkexRepository = new StarkexTransactionCountRepository(
    database,
    logger,
  )
  const sequenceProcessorRepository = new SequenceProcessorRepository(
    database,
    logger,
  )
  const zksyncRepository = new ZksyncTransactionRepository(database, logger)

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
    .filter(isProjectAllowed(allowedProjectIds, logger))
    .map(({ projectId, transactionApi }) => {
      switch (transactionApi.type) {
        case 'starkex':
          return createStarkexCounter(
            projectId,
            starkexRepository,
            starkexClient,
            sequenceProcessorRepository,
            logger,
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
            transactionApi,
          )
        case 'aztecconnect':
          return createAztecConnectCounter(
            projectId,
            blockRepository,
            http,
            sequenceProcessorRepository,
            logger,
            transactionApi,
          )
        case 'starknet':
          return createStarknetCounter(
            projectId,
            blockRepository,
            http,
            sequenceProcessorRepository,
            logger,
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
            transactionApi,
          )
        case 'loopring':
          return createLoopringCounter(
            projectId,
            http,
            blockRepository,
            sequenceProcessorRepository,
            logger,
            transactionApi,
          )
        case 'rpc':
          return createRpcCounter(
            projectId,
            blockRepository,
            sequenceProcessorRepository,
            logger,
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

const activityIncludedInApi = new Gauge({
  name: 'activity_included_in_api',
  help: 'Boolean value 1 when this project is included in activity api response',
  labelNames: ['project'],
})

function isProjectAllowed(
  allowedProjectIds: string[] | undefined,
  logger: Logger,
) {
  return (p: { projectId: ProjectId }) => {
    const noIdsSpecified = allowedProjectIds === undefined
    const projectIncluded = allowedProjectIds?.includes(p.projectId.toString())
    const includedInApi = !!(noIdsSpecified || projectIncluded)
    if (!includedInApi) {
      logger.info(`Skipping ${p.projectId.toString()} processor`)
    }
    activityIncludedInApi
      .labels({ project: p.projectId.toString() })
      .set(Number(includedInApi))
    return includedInApi
  }
}
