import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { providers } from 'ethers'
import { Gauge } from 'prom-client'

import { Config } from '../../config'
import { AztecCounter } from '../../core/activity/counters/AztecCounter'
import { LoopringCounter } from '../../core/activity/counters/LoopringCounter'
import { RpcCounter } from '../../core/activity/counters/RpcCounter'
import { StarkexCounter } from '../../core/activity/counters/StarkexCounter'
import { StarknetCounter } from '../../core/activity/counters/StarknetCounter'
import { ZksyncCounter } from '../../core/activity/counters/ZksyncCounter'
import { SequenceProcessor } from '../../core/activity/SequenceProcessor'
import { Clock } from '../../core/Clock'
import { AztecClient } from '../../peripherals/aztec'
import { BlockTransactionCountRepository } from '../../peripherals/database/activity/BlockTransactionCountRepository'
import { StarkexTransactionCountRepository } from '../../peripherals/database/activity/StarkexCountRepository'
import { ZksyncTransactionRepository } from '../../peripherals/database/activity/ZksyncTransactionRepository'
import { SequenceProcessorRepository } from '../../peripherals/database/SequenceProcessorRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { LoopringClient } from '../../peripherals/loopring'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
import { StarkexClient } from '../../peripherals/starkex'
import { StarknetClient } from '../../peripherals/starknet/StarknetClient'
import { ZksyncClient } from '../../peripherals/zksync'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createSequenceProcessors(
  config: Config,
  logger: Logger,
  http: HttpClient,
  database: Database,
  clock: Clock,
): SequenceProcessor[] {
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

  return projects
    .filter(isProjectAllowed(allowedProjectIds, logger))
    .map(({ id, config }) => {
      const taggedLogger = logger.tag(id.toString())

      switch (config.type) {
        case 'starkex': {
          return new StarkexCounter(
            id,
            config.product,
            sequenceProcessorRepository,
            starkexRepository,
            starkexClient,
            clock,
            taggedLogger,
            getBatchSizeFromCallsPerMinute(singleStarkexCPM),
            config.sinceTimestamp,
            config.resyncLastDays,
          )
        }

        case 'aztec': {
          const aztecClient = new AztecClient(
            http,
            config.url,
            config.callsPerMinute,
          )
          return new AztecCounter(
            id,
            sequenceProcessorRepository,
            blockRepository,
            aztecClient,
            taggedLogger,
            getBatchSizeFromCallsPerMinute(config.callsPerMinute),
          )
        }

        case 'starknet': {
          const starknetClient = new StarknetClient(config.url, http, {
            callsPerMinute: config.callsPerMinute,
          })
          return new StarknetCounter(
            id,
            sequenceProcessorRepository,
            blockRepository,
            starknetClient,
            clock,
            taggedLogger,
            getBatchSizeFromCallsPerMinute(config.callsPerMinute),
          )
        }

        case 'zksync': {
          const zksyncClient = new ZksyncClient(
            http,
            taggedLogger,
            config.url,
            config.callsPerMinute,
          )
          return new ZksyncCounter(
            id,
            sequenceProcessorRepository,
            zksyncRepository,
            zksyncClient,
            taggedLogger,
            getBatchSizeFromCallsPerMinute(config.callsPerMinute),
          )
        }

        case 'loopring': {
          const loopringClient = new LoopringClient(
            http,
            taggedLogger,
            config.url,
            {
              callsPerMinute: config.callsPerMinute,
            },
          )
          return new LoopringCounter(
            id,
            sequenceProcessorRepository,
            blockRepository,
            loopringClient,
            taggedLogger,
            getBatchSizeFromCallsPerMinute(config.callsPerMinute),
          )
        }

        case 'rpc': {
          const provider = new providers.StaticJsonRpcProvider({
            url: config.url,
            timeout: 15_000,
          })
          const rpcClient = new RpcClient(
            provider,
            taggedLogger,
            config.callsPerMinute,
          )

          return new RpcCounter(
            id,
            sequenceProcessorRepository,
            blockRepository,
            rpcClient,
            clock,
            taggedLogger,
            config.assessCount,
            getBatchSizeFromCallsPerMinute(config.callsPerMinute),
            config.startBlock ?? 0,
          )
        }
      }
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
