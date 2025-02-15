import { Env } from '@l2beat/backend-tools'
import { type ChainConfig, layer2s, layer3s, tokenList } from '@l2beat/config'
import { assert, notUndefined } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import { getChainsWithTokens } from '../features/chains'
import type { BlockApi } from './BlockApi'
import type { ChainApi } from './ChainApi'
import type { IndexerApi } from './IndexerApi'

export function getChainConfig(env: Env, chains: ChainConfig[]): ChainApi[] {
  const { configuredChains, projects } = getConfiguredChains(chains)

  const rpcChains: ChainApi[] = []
  for (const chain of configuredChains) {
    if (chain === 'ethereum') {
      rpcChains.push(getEthereumConfig(env))
      continue
    }
    const project = projects.find((p) => p.id === chain)
    assert(project, `${chain}: Project not found`)
    // TODO: we need to find a better way to link project to it's chain
    const chainConfig = chains.find((c) => c.name === chain.replace(/-/g, ''))

    const indexerConfig =
      project.chainConfig?.explorerApi || chainConfig?.explorerApi
    const indexerApis: IndexerApi[] = []
    if (indexerConfig) {
      const type = indexerConfig.type
      const url = indexerConfig.url

      if (type === 'etherscan') {
        indexerApis.push({
          type,
          url,
          apiKey: env.string(Env.key(chain, 'ETHERSCAN_API_KEY')),
        })
      } else {
        indexerApis.push({
          type,
          url,
        })
      }
    }

    const blockApis: BlockApi[] = []
    const rpcUrls = getRpcUrlsFromEnv(env, chain)
    for (const url of rpcUrls) {
      const callsPerMinute = env.integer(
        Env.key(chain, 'RPC_CALLS_PER_MINUTE'),
        60,
      )
      blockApis.push({
        type: 'rpc',
        url,
        callsPerMinute,
        // TODO: add configuration param
        retryStrategy: chain === 'zkfair' ? 'UNRELIABLE' : 'RELIABLE',
      })
    }

    const defaultRpcConfig = project.config.transactionApi
    if (defaultRpcConfig && defaultRpcConfig.type === 'rpc') {
      blockApis.push({
        type: 'rpc',
        url: defaultRpcConfig.defaultUrl,
        callsPerMinute: defaultRpcConfig.defaultCallsPerMinute ?? 60,
        // TODO: add configuration param
        retryStrategy: chain === 'zkfair' ? 'UNRELIABLE' : 'RELIABLE',
      })
    }

    if (blockApis.length > 0) {
      rpcChains.push({
        name: chain,
        indexerApis,
        blockApis,
      })
    }
  }

  const otherChains = getOtherChains(env)

  return [...rpcChains, ...otherChains]
}

function getRpcUrlsFromEnv(env: Env, chain: string) {
  return [
    env.optionalString(Env.key(chain, 'RPC_URL')),
    env.optionalString(Env.key(chain, 'RPC_URL_FOR_TVL')),
    env.optionalString(Env.key(chain, 'RPC_URL_FOR_ACTIVITY')),
  ].filter(notUndefined)
}

function getConfiguredChains(chains: ChainConfig[]) {
  const sharedEscrowsChains = layer2s
    .filter((c) =>
      c.config.escrows.some(
        (e) =>
          e.sharedEscrow?.type === 'AggLayer' ||
          e.sharedEscrow?.type === 'ElasticChain',
      ),
    )
    .map((l) => l.id)

  const tvlChains = uniq(
    getChainsWithTokens(tokenList, chains).concat(sharedEscrowsChains),
  )

  const projects = [
    ...layer2s.filter((layer2) => !layer2.isArchived),
    ...layer3s,
  ]

  const activityChains = projects
    .flatMap((x) => (x.config.transactionApi ? x.id : undefined))
    .filter(notUndefined)

  const configuredChains = [...tvlChains, ...activityChains]
  return { configuredChains, projects }
}

function getEthereumConfig(env: Env): ChainApi {
  return {
    name: 'ethereum',
    indexerApis: [
      {
        type: 'etherscan',
        url: 'https://api.etherscan.io/api',
        apiKey: env.string('ETHEREUM_ETHERSCAN_API_KEY'),
      },
    ],
    blockApis: [
      {
        type: 'rpc',
        url: env.string('ETHEREUM_RPC_URL'),
        callsPerMinute: env.integer('ETHEREUM_RPC_CALLS_PER_MINUTE', 60),
        retryStrategy: 'RELIABLE',
      },
    ],
  }
}

function getOtherChains(env: Env): ChainApi[] {
  const chains: ChainApi[] = [
    {
      name: 'zksync',
      indexerApis: [],
      blockApis: [
        {
          // TODO: rename to zksynclite
          type: 'zksync',
          url: 'https://api.zksync.io/api/v0.2',
          callsPerMinute: 3_000,
          retryStrategy: 'RELIABLE',
        },
      ],
    },
    {
      name: 'loopring',
      indexerApis: [],
      blockApis: [
        {
          type: 'loopring',
          url: 'https://api3.loopring.io/api/v3',
          callsPerMinute: 240,
          retryStrategy: 'RELIABLE',
        },
      ],
    },
    {
      name: 'degate3',
      indexerApis: [],
      blockApis: [
        {
          type: 'degate3',
          url: 'https://v1-mainnet-backend.degate.com/order-book-api',
          callsPerMinute: 120,
          retryStrategy: 'RELIABLE',
        },
      ],
    },
    {
      name: 'fuel',
      indexerApis: [],
      blockApis: [
        {
          type: 'fuel',
          url: 'https://mainnet.fuel.network/v1/graphql',
          callsPerMinute: 120,
          retryStrategy: 'RELIABLE',
        },
      ],
    },
  ]

  const starknetRpc = env.optionalString('STARKNET_RPC_URL')
  if (starknetRpc) {
    chains.push({
      name: 'starknet',
      indexerApis: [],
      blockApis: [
        {
          type: 'starknet',
          url: starknetRpc,
          callsPerMinute: env.integer('STARKNET_RPC_CALLS_PER_MINUTE', 60),
          retryStrategy: 'RELIABLE',
        },
      ],
    })
  }

  const paradexRpc = env.optionalString('PARADEX_RPC_URL')
  if (paradexRpc) {
    chains.push({
      name: 'paradex',
      indexerApis: [],
      blockApis: [
        {
          type: 'starknet',
          url: paradexRpc,
          callsPerMinute: env.integer('PARADEX_RPC_CALLS_PER_MINUTE', 60),
          retryStrategy: 'RELIABLE',
        },
      ],
    })
  }

  const starkexApiKey = env.optionalString('STARKEX_API_KEY')
  if (starkexApiKey) {
    chains.push({
      name: 'starkex',
      indexerApis: [],
      blockApis: [
        {
          type: 'starkex',
          apiKey: starkexApiKey,
          callsPerMinute: env.integer('STARKEX_API_CALLS_PER_MINUTE', 600),
          retryStrategy: 'RELIABLE',
        },
      ],
    })
  }

  return chains
}
