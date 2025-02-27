import { Env } from '@l2beat/backend-tools'
import type { ProjectService } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import type { BlockApi } from './BlockApi'
import type { ChainApi } from './ChainApi'
import type { IndexerApi } from './IndexerApi'

const DEFAULT_CALLS_PER_MINUTE = 60

export async function getChainConfig(
  ps: ProjectService,
  env: Env,
): Promise<ChainApi[]> {
  const projects = await ps.getProjects({ select: ['chainConfig'] })

  const apis: ChainApi[] = []
  for (const project of projects) {
    const chain = project.chainConfig.name

    const indexerApis: IndexerApi[] = []
    const blockApis: BlockApi[] = []

    for (const api of project.chainConfig?.apis ?? []) {
      switch (api.type) {
        case 'etherscan':
          indexerApis.push({
            type: api.type,
            url: api.url,
            apiKey: env.string(Env.key(chain, 'ETHERSCAN_API_KEY')),
          })
          break
        case 'blockscout':
          indexerApis.push({
            type: api.type,
            url: api.url,
          })
          break
        case 'blockscoutV2':
          // TODO: not sure why we don't support this
          break
        case 'rpc':
          blockApis.push({
            type: 'rpc',
            url: env.string(Env.key(chain, 'RPC_URL'), api.url),
            callsPerMinute: env.integer(
              Env.key(chain, 'RPC_CALLS_PER_MINUTE'),
              api.callsPerMinute ?? DEFAULT_CALLS_PER_MINUTE,
            ),
            // TODO: add configuration param
            retryStrategy: chain === 'zkfair' ? 'UNRELIABLE' : 'RELIABLE',
          })
          break
        case 'fuel':
        case 'loopring':
        case 'degate3':
        case 'zksync':
          blockApis.push({
            type: api.type,
            url: api.url,
            callsPerMinute: api.callsPerMinute ?? DEFAULT_CALLS_PER_MINUTE,
            retryStrategy: 'RELIABLE',
          })
          break
        case 'starkex': {
          const starkexApiKey = env.optionalString('STARKEX_API_KEY')
          if (starkexApiKey) {
            blockApis.push({
              type: 'starkex',
              product: api.product,
              apiKey: starkexApiKey,
              callsPerMinute: env.integer('STARKEX_API_CALLS_PER_MINUTE', 600),
              retryStrategy: 'RELIABLE',
            })
          }
          break
        }
        case 'starknet':
          blockApis.push({
            type: 'starknet',
            url: env.string('STARKNET_RPC_URL', api.url),
            callsPerMinute: env.integer(
              'STARKNET_RPC_CALLS_PER_MINUTE',
              api.callsPerMinute ?? DEFAULT_CALLS_PER_MINUTE,
            ),
            retryStrategy: 'RELIABLE',
          })
          break
        default:
          assertUnreachable(api)
      }
    }

    for (const url of getConfiguredRpcs(env, chain)) {
      // TODO: every rpc for a given chain has the same calls per minute!
      const callsPerMinute = env.integer(
        Env.key(chain, 'RPC_CALLS_PER_MINUTE'),
        DEFAULT_CALLS_PER_MINUTE,
      )
      // only add previously unknown urls
      if (!blockApis.some((x) => x.type === 'rpc' && x.url === url)) {
        blockApis.push({
          type: 'rpc',
          url,
          callsPerMinute,
          // TODO: add configuration param
          retryStrategy: chain === 'zkfair' ? 'UNRELIABLE' : 'RELIABLE',
        })
      }
    }

    if (indexerApis.length > 0 || blockApis.length > 0) {
      apis.push({ name: chain, indexerApis, blockApis })
    }
  }

  const exceptions = getExceptions(env)
  apis.push(...exceptions)

  return apis
}

function getConfiguredRpcs(env: Env, chain: string) {
  if (chain === 'starknet' || chain === 'paradex') {
    return []
  }
  return [
    env.optionalString(Env.key(chain, 'RPC_URL')),
    env.optionalString(Env.key(chain, 'RPC_URL_FOR_TVL')),
    env.optionalString(Env.key(chain, 'RPC_URL_FOR_ACTIVITY')),
  ].filter((x) => x !== undefined)
}

function getExceptions(env: Env): ChainApi[] {
  const apis: ChainApi[] = []

  const paradexRpc = env.optionalString('PARADEX_RPC_URL')
  if (paradexRpc) {
    apis.push({
      name: 'paradex',
      indexerApis: [],
      blockApis: [
        {
          type: 'starknet',
          url: paradexRpc,
          callsPerMinute: env.integer(
            'PARADEX_RPC_CALLS_PER_MINUTE',
            DEFAULT_CALLS_PER_MINUTE,
          ),
          retryStrategy: 'RELIABLE',
        },
      ],
    })
  }

  return apis
}
