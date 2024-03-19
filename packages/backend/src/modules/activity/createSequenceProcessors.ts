import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { Gauge } from 'prom-client'

import { Config } from '../../config'
import { AztecClient } from '../../peripherals/aztec/AztecClient'
import { DegateClient } from '../../peripherals/degate/DegateClient'
import { LoopringClient } from '../../peripherals/loopring/LoopringClient'
import { Peripherals } from '../../peripherals/Peripherals'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
import { StarkexClient } from '../../peripherals/starkex/StarkexClient'
import { StarknetClient } from '../../peripherals/starknet/StarknetClient'
import { ZksyncClient } from '../../peripherals/zksync/ZksyncClient'
import { Clock } from '../../tools/Clock'
import { AztecCounter } from './counters/AztecCounter'
import { DegateCounter } from './counters/DegateCounter'
import { LoopringCounter } from './counters/LoopringCounter'
import { RpcCounter } from './counters/RpcCounter'
import { StarkexCounter } from './counters/StarkexCounter'
import { StarknetCounter } from './counters/StarknetCounter'
import { ZksyncCounter } from './counters/ZksyncCounter'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'
import { BlockTransactionCountRepository } from './repositories/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from './repositories/SequenceProcessorRepository'
import { StarkexTransactionCountRepository } from './repositories/StarkexCountRepository'
import { ZksyncTransactionRepository } from './repositories/ZksyncTransactionRepository'
import { SequenceProcessor } from './SequenceProcessor'

export function createSequenceProcessors(
  config: Config,
  logger: Logger,
  http: HttpClient,
  peripherals: Peripherals,
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

  return projects
    .filter(isProjectAllowed(allowedProjectIds, logger))
    .map(({ id, config }) => {
      const taggedLogger = logger.tag(id.toString())

      switch (config.type) {
        case 'starkex': {
          const starkexClient = peripherals.getClient(StarkexClient, {
            apiKey: starkexApiKey,
            callsPerMinute: singleStarkexCPM,
            timeout: undefined,
          })
          return new StarkexCounter(
            id,
            config.product,
            peripherals.getRepository(SequenceProcessorRepository),
            peripherals.getRepository(StarkexTransactionCountRepository),
            starkexClient,
            clock,
            taggedLogger,
            getBatchSizeFromCallsPerMinute(singleStarkexCPM),
            config.sinceTimestamp,
            config.resyncLastDays,
          )
        }

        case 'aztec': {
          const aztecClient = peripherals.getClient(AztecClient, {
            url: config.url,
            callsPerMinute: config.callsPerMinute,
          })
          return new AztecCounter(
            id,
            peripherals.getRepository(SequenceProcessorRepository),
            peripherals.getRepository(BlockTransactionCountRepository),
            aztecClient,
            taggedLogger,
            getBatchSizeFromCallsPerMinute(config.callsPerMinute),
          )
        }

        case 'starknet': {
          const starknetClient = peripherals.getClient(StarknetClient, {
            url: config.url,
            callsPerMinute: config.callsPerMinute,
          })
          return new StarknetCounter(
            id,
            peripherals.getRepository(SequenceProcessorRepository),
            peripherals.getRepository(BlockTransactionCountRepository),
            starknetClient,
            clock,
            taggedLogger,
            getBatchSizeFromCallsPerMinute(config.callsPerMinute),
          )
        }

        case 'zksync': {
          const zksyncClient = peripherals.getClient(ZksyncClient, {
            url: config.url,
            callsPerMinute: config.callsPerMinute,
          })
          return new ZksyncCounter(
            id,
            peripherals.getRepository(SequenceProcessorRepository),
            peripherals.getRepository(ZksyncTransactionRepository),
            zksyncClient,
            taggedLogger,
            getBatchSizeFromCallsPerMinute(config.callsPerMinute),
          )
        }

        case 'loopring': {
          const loopringClient = peripherals.getClient(LoopringClient, {
            url: config.url,
            callsPerMinute: config.callsPerMinute,
          })
          return new LoopringCounter(
            id,
            peripherals.getRepository(SequenceProcessorRepository),
            peripherals.getRepository(BlockTransactionCountRepository),
            loopringClient,
            taggedLogger,
            getBatchSizeFromCallsPerMinute(config.callsPerMinute),
          )
        }

        case 'degate': {
          const degateClient = peripherals.getClient(DegateClient, {
            url: config.url,
            callsPerMinute: config.callsPerMinute,
          })
          return new DegateCounter(
            id,
            peripherals.getRepository(SequenceProcessorRepository),
            peripherals.getRepository(BlockTransactionCountRepository),
            degateClient,
            taggedLogger,
            getBatchSizeFromCallsPerMinute(config.callsPerMinute),
          )
        }

        case 'rpc': {
          const rpcClient = peripherals.getClient(RpcClient, {
            url: config.url,
            callsPerMinute: config.callsPerMinute,
          })
          return new RpcCounter(
            id,
            peripherals.getRepository(SequenceProcessorRepository),
            peripherals.getRepository(BlockTransactionCountRepository),
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
