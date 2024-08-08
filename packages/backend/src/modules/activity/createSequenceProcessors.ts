import { Logger } from '@l2beat/backend-tools'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { Gauge } from 'prom-client'

import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
import { DegateClient } from '../../peripherals/degate/DegateClient'
import { LoopringClient } from '../../peripherals/loopring/LoopringClient'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
import { StarkexClient } from '../../peripherals/starkex/StarkexClient'
import { StarknetClient } from '../../peripherals/starknet/StarknetClient'
import { ZksyncLiteClient } from '../../peripherals/zksynclite/ZksyncLiteClient'
import { Clock } from '../../tools/Clock'
import { SequenceProcessor } from './SequenceProcessor'
import { DegateCounter } from './counters/DegateCounter'
import { LoopringCounter } from './counters/LoopringCounter'
import { RpcCounter } from './counters/RpcCounter'
import { StarkexCounter } from './counters/StarkexCounter'
import { StarknetCounter } from './counters/StarknetCounter'
import { ZksyncCounter } from './counters/ZksyncCounter'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createSequenceProcessors(
  config: Config,
  logger: Logger,
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
            peripherals.database,
            starkexClient,
            clock,
            taggedLogger,
            getBatchSizeFromCallsPerMinute(singleStarkexCPM),
            config.sinceTimestamp,
            config.resyncLastDays,
          )
        }

        case 'starknet': {
          const starknetClient = peripherals.getClient(StarknetClient, {
            url: config.url,
            callsPerMinute: config.callsPerMinute,
          })
          return new StarknetCounter(
            id,
            peripherals.database,
            starknetClient,
            clock,
            taggedLogger,
            getBatchSizeFromCallsPerMinute(config.callsPerMinute),
          )
        }

        case 'zksync': {
          const zksyncClient = peripherals.getClient(ZksyncLiteClient, {
            url: config.url,
            callsPerMinute: config.callsPerMinute,
          })
          return new ZksyncCounter(
            id,
            peripherals.database,
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
            peripherals.database,
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
            peripherals.database,
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
            peripherals.database,
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
