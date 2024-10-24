import { Logger, RateLimiter } from '@l2beat/backend-tools'
import {
  BlockIndexerClient,
  BlockProvider,
  HttpClient,
  HttpClient2,
  RetryHandler,
  RpcClient2,
} from '@l2beat/shared'
import { assert, ProjectId, assertUnreachable } from '@l2beat/shared-pure'
import { ActivityConfig } from '../config/Config'
import { BlockTimestampProvider } from '../modules/tvl/services/BlockTimestampProvider'
import { DegateClient } from '../peripherals/degate'
import { LoopringClient } from '../peripherals/loopring/LoopringClient'
import { StarkexClient } from '../peripherals/starkex/StarkexClient'
import { StarknetClient } from '../peripherals/starknet/StarknetClient'
import { ZksyncLiteClient } from '../peripherals/zksynclite/ZksyncLiteClient'

export class BlockProviders {
  constructor(
    private readonly config: ActivityConfig,
    private readonly evmClients: RpcClient2[],
    // there needs to be possiblity of undefined,
    // because a chain can possibly be disabled
    readonly zksyncLiteClient: ZksyncLiteClient | undefined,
    readonly starknetClient: StarknetClient | undefined,
    readonly loopringClient: LoopringClient | undefined,
    readonly degateClient: DegateClient | undefined,
    readonly starkexClient: StarkexClient | undefined,
    private readonly indexerClients: BlockIndexerClient[],
  ) {}

  getEvmBlockProvider(chain: string) {
    const clients = this.evmClients.filter((r) => r.chain === chain)
    assert(clients.length > 0, `No configured clients for ${chain}`)

    return new BlockProvider(clients)
  }

  getBlockTimestampProvider(chain: string) {
    const project = this.config.projects.find((p) => p.id === chain)
    assert(project, `Project ${chain} not found`)

    const indexerClients = this.indexerClients.filter((c) => c.chain === chain)

    switch (project.config.type) {
      case 'rpc': {
        const blockClients = this.evmClients.filter((r) => r.chain === chain)
        assert(blockClients.length > 0, `No configured clients for ${chain}`)
        return new BlockTimestampProvider({ indexerClients, blockClients })
      }
      case 'zksync': {
        assert(this.zksyncLiteClient, 'zksyncLiteClient should be defined')
        const blockClients = [this.zksyncLiteClient]
        return new BlockTimestampProvider({ indexerClients, blockClients })
      }
      case 'starknet': {
        assert(this.starknetClient, 'starknetClient should be defined')
        const blockClients = [this.starknetClient]
        return new BlockTimestampProvider({ indexerClients, blockClients })
      }
      case 'loopring': {
        assert(this.loopringClient, 'loopringClient should be defined')
        const blockClients = [this.loopringClient]
        return new BlockTimestampProvider({ indexerClients, blockClients })
      }
      case 'degate': {
        assert(this.degateClient, 'degateClient should be defined')
        const blockClients = [this.degateClient]
        return new BlockTimestampProvider({ indexerClients, blockClients })
      }
      case 'starkex': {
        throw new Error('Starkex should not be handled with this method')
      }
      default:
        assertUnreachable(project.config)
    }
  }
}

export function initBlockProviders(config: ActivityConfig): BlockProviders {
  let zksyncLiteClient: ZksyncLiteClient | undefined
  let starknetClient: StarknetClient | undefined
  let loopringClient: LoopringClient | undefined
  let degateClient: DegateClient | undefined
  let starkexClient: StarkexClient | undefined

  const evmClients: RpcClient2[] = []
  const indexerClients: BlockIndexerClient[] = []

  const http = new HttpClient()
  const http2 = new HttpClient2()
  const logger = Logger.SILENT

  for (const project of config.projects) {
    switch (project.config.type) {
      case 'rpc': {
        const retryHandler =
          project.id === ProjectId('zkfair')
            ? RetryHandler.UNRELIABLE_API(logger)
            : RetryHandler.RELIABLE_API(logger)

        // TODO: handle multiple urls
        const rpcClient = new RpcClient2({
          url: project.config.url,
          http: http2,
          rateLimiter: new RateLimiter({
            callsPerMinute: project.config.callsPerMinute,
          }),
          retryHandler,
          logger,
          chain: project.id,
        })

        evmClients.push(rpcClient)

        break
      }
      case 'zksync': {
        zksyncLiteClient = new ZksyncLiteClient(
          http,
          logger,
          project.config.url,
          project.config.callsPerMinute,
        )
        break
      }
      case 'starknet': {
        starknetClient = new StarknetClient(project.config.url, http, {
          callsPerMinute: project.config.callsPerMinute,
        })
        break
      }
      case 'loopring': {
        loopringClient = new LoopringClient(http, logger, project.config.url, {
          callsPerMinute: project.config.callsPerMinute,
        })
        break
      }
      case 'degate': {
        degateClient = new DegateClient(http, logger, project.config.url, {
          callsPerMinute: project.config.callsPerMinute,
        })
        break
      }
      case 'starkex': {
        starkexClient = new StarkexClient(config.starkexApiKey, http, logger, {
          callsPerMinute: config.starkexCallsPerMinute,
        })
        break
      }
      default:
        assertUnreachable(project.config)
    }
  }

  return new BlockProviders(
    config,
    evmClients,
    zksyncLiteClient,
    starknetClient,
    loopringClient,
    degateClient,
    starkexClient,
    indexerClients,
  )
}
