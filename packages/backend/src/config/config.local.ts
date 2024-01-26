import { Env } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { Config } from './Config'
import { makeConfig } from './makeConfig'

export function getLocalConfig(env: Env): Config {
  const activityEnabled = env.boolean('ACTIVITY_ENABLED', false)

  // TODO: This should probably be configurable
  const minTimestamp = UnixTime.now().add(-7, 'days').toStartOf('hour')

  return {
    ...makeConfig(env, {
      name: 'Backend/Local',
      isLocal: true,
      minTimestampOverride: minTimestamp,
    }),
    activity: activityEnabled && {
      starkexApiKey: env.string('STARKEX_API_KEY'),
      starkexCallsPerMinute: env.integer('STARKEX_CALLS_PER_MINUTE', 600),
      skipExplicitExclusion: true,
      projectsExcludedFromAPI:
        env.optionalString('ACTIVITY_PROJECTS_EXCLUDED_FROM_API')?.split(' ') ??
        [],

      projects: {
        ethereum: {
          type: 'rpc',
          callsPerMinute: 60,
          url: env.string(
            'ACTIVITY_ETHEREUM_URL',
            'https://eth-mainnet.alchemyapi.io/v2/demo',
          ),
        },
        optimism: {
          type: 'rpc',
          callsPerMinute: 60,
          url: env.string(
            'ACTIVITY_OPTIMISM_URL',
            'https://mainnet.optimism.io/',
          ),
        },
        arbitrum: {
          type: 'rpc',
          callsPerMinute: 60,
          url: env.string(
            'ACTIVITY_ARBITRUM_URL',
            'https://arb1.arbitrum.io/rpc',
          ),
        },
        zksync2: {
          type: 'rpc',
          callsPerMinute: 60,
        },
        nova: {
          type: 'rpc',
          callsPerMinute: 60,
          url: env.string('ACTIVITY_NOVA_URL', 'https://nova.arbitrum.io/rpc'),
        },
        linea: {
          type: 'rpc',
          callsPerMinute: 60,
          url: env.string(
            'ACTIVITY_LINEA_URL',
            'https://linea-mainnet.infura.io/v3',
          ),
        },
        polygonzkevm: {
          type: 'rpc',
          callsPerMinute: 500,
          url: 'https://polygon-rpc.com/zkevm',
        },
        starknet: {
          type: 'starknet',
          callsPerMinute: 120,
          url: env.string(
            'ACTIVITY_STARKNET_URL',
            'https://starknet-mainnet.public.blastapi.io',
          ),
        },
        scroll: {
          type: 'rpc',
          callsPerMinute: 120,
          url: env.string('ACTIVITY_SCROLL_URL', 'https://rpc.scroll.io'),
        },
        mantle: {
          type: 'rpc',
          callsPerMinute: 120,
          url: env.string('ACTIVITY_MANTLE_URL', 'https://rpc.mantle.xyz'),
        },
        metis: {
          type: 'rpc',
          callsPerMinute: 120,
          url: env.string('ACTIVITY_METIS_URL', 'https://andromeda.metis.io/'),
        },
      },
    },
  }
}
