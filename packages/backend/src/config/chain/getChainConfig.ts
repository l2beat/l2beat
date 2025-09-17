import { Env } from '@l2beat/backend-tools'
import type { ProjectService } from '@l2beat/config'
import type { RetryHandlerVariant } from '@l2beat/shared'
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

    const multicallV3 = project.chainConfig.multicallContracts?.find(
      (m) => m.version === '3',
    )

    const indexerApis: IndexerApi[] = []
    const blockApis: BlockApi[] = []

    for (const api of project.chainConfig?.apis ?? []) {
      switch (api.type) {
        case 'etherscan':
          indexerApis.push({
            type: api.type,
            url: env.string('ETHERSCAN_API_URL'),
            apiKey: env.string('ETHERSCAN_API_KEY'),
            chainId: api.chainId,
          })
          break
        case 'routescan':
          indexerApis.push({
            type: api.type,
            url: api.url,
          })
          break
        case 'blockscout':
          indexerApis.push({
            type: api.type,
            url: api.url,
          })
          break
        case 'blockscoutV2':
        case 'sourcify':
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
            multicallV3: multicallV3
              ? {
                  address: multicallV3.address,
                  sinceBlock: multicallV3.sinceBlock,
                }
              : undefined,
            retryStrategy:
              (env.optionalString(Env.key(chain, 'RETRY_STRATEGY')) as
                | RetryHandlerVariant
                | undefined) ??
              api.retryStrategy ??
              'RELIABLE',
          })
          break
        case 'fuel':
        case 'loopring':
        case 'degate3':
        case 'zksync':
          blockApis.push({
            type: api.type,
            url: env.string(Env.key(chain, 'API_URL'), api.url),
            callsPerMinute: env.integer(
              Env.key(chain, 'API_CALLS_PER_MINUTE'),
              api.callsPerMinute ?? DEFAULT_CALLS_PER_MINUTE,
            ),
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
            url: env.string(Env.key(chain, 'RPC_URL'), api.url),
            callsPerMinute: env.integer(
              Env.key(chain, 'RPC_CALLS_PER_MINUTE'),
              api.callsPerMinute ?? DEFAULT_CALLS_PER_MINUTE,
            ),
            retryStrategy: 'RELIABLE',
          })
          break
        case 'svm-rpc':
          blockApis.push({
            type: 'svm-rpc',
            url: env.string(Env.key(chain, 'RPC_URL'), api.url),
            callsPerMinute: env.integer(
              Env.key(chain, 'RPC_CALLS_PER_MINUTE'),
              api.callsPerMinute ?? DEFAULT_CALLS_PER_MINUTE,
            ),
            retryStrategy: 'RELIABLE',
          })
          break
        default:
          assertUnreachable(api)
      }
    }

    if (indexerApis.length > 0 || blockApis.length > 0) {
      apis.push({ name: chain, indexerApis, blockApis })
    }
  }

  return apis
}
