import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { Gauge } from 'prom-client'

import { Config } from '../../config'
import { createAztecCounter } from '../../core/activity/counters/AztecCounter'
import { createLoopringCounter } from '../../core/activity/counters/LoopringCounter'
import { createRpcCounter } from '../../core/activity/counters/RpcCounter'
import { createStarkexCounter } from '../../core/activity/counters/StarkexCounter'
import { createStarknetCounter } from '../../core/activity/counters/StarknetCounter'
import { createZksyncCounter } from '../../core/activity/counters/ZksyncCounter'
import { TransactionCounter } from '../../core/activity/TransactionCounter'
import { Clock } from '../../core/Clock'
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
      projects,
      allowedProjectIds,
    },
  } = config

  // shared clients
  const numberOfStarkexProjects =
    projects.filter((p) => p.config.type === 'starkex').length || 1
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

  const processors = projects
    .filter(isProjectAllowed(allowedProjectIds, logger))
    .map(({ id, config }) => {
      switch (config.type) {
        case 'starkex':
          return createStarkexCounter(
            id,
            starkexRepository,
            starkexClient,
            sequenceProcessorRepository,
            logger,
            clock,
            {
              ...config,
              singleStarkexCPM,
            },
          )
        case 'aztec':
          return createAztecCounter(
            id,
            blockRepository,
            http,
            sequenceProcessorRepository,
            logger,
            config,
          )
        case 'starknet':
          return createStarknetCounter(
            id,
            blockRepository,
            http,
            sequenceProcessorRepository,
            logger,
            clock,
            config,
          )
        case 'zksync':
          return createZksyncCounter(
            id,
            http,
            zksyncRepository,
            sequenceProcessorRepository,
            logger,
            config,
          )
        case 'loopring':
          return createLoopringCounter(
            id,
            http,
            blockRepository,
            sequenceProcessorRepository,
            logger,
            config,
          )
        case 'rpc':
          return createRpcCounter(
            id,
            blockRepository,
            sequenceProcessorRepository,
            logger,
            clock,
            config,
          )
      }
    })

  return processors
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
  return (project: { id: ProjectId }) => {
    const noIdsSpecified = allowedProjectIds === undefined
    const projectIncluded = allowedProjectIds?.includes(project.id.toString())
    const includedInApi = !!(noIdsSpecified || projectIncluded)
    if (!includedInApi) {
      logger.info(`Skipping ${project.id.toString()} processor`)
    }
    activityIncludedInApi
      .labels({ project: project.id.toString() })
      .set(Number(includedInApi))
    return includedInApi
  }
}
