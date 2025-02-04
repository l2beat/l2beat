import type { Env } from '@l2beat/backend-tools'
import type { ProjectService } from '@l2beat/config'
import type { DaBeatConfig } from '../Config'

export async function getDaBeatConfig(
  ps: ProjectService,
  env: Env,
): Promise<DaBeatConfig> {
  const projects = await ps.getProjects({
    select: ['daLayer'],
    whereNot: ['isUpcoming'],
  })

  const coingeckoIds = projects
    .map((x) => x.daLayer.economicSecurity?.token.coingeckoId)
    .filter((x) => x !== undefined)
    .filter((x, i, a) => a.indexOf(x) === i) // unique

  const types = projects
    .map((x) => x.daLayer.economicSecurity?.name)
    .filter((x) => x !== undefined)
    .filter((x, i, a) => a.indexOf(x) === i) // unique

  return {
    coingeckoIds,
    types,
    quicknodeApiUrl: env.string([
      'QUICKNODE_API_URL_FOR_DA_BEAT',
      'QUICKNODE_API_URL',
    ]),
    quicknodeCallsPerMinute: env.integer(
      [
        'QUICKNODE_API_CALLS_PER_MINUTE_FOR_DA_BEAT',
        'QUICKNODE_API_CALLS_PER_MINUTE',
      ],
      600,
    ),
    celestiaApiUrl: env.string([
      'CELESTIA_API_URL_FOR_DA_BEAT',
      'CELESTIA_API_URL',
    ]),
    celestiaCallsPerMinute: env.integer(
      [
        'CELESTIA_API_CALLS_PER_MINUTE_FOR_DA_BEAT',
        'CELESTIA_API_CALLS_PER_MINUTE',
      ],
      600,
    ),
    nearRpcUrl: env.string(
      ['NEAR_RPC_URL_FOR_DA_BEAT', 'NEAR_RPC_URL'],
      'https://rpc.mainnet.near.org/',
    ),
    availWsUrl: env.string(
      ['AVAIL_WS_URL_FOR_DA_BEAT', 'AVAIL_WS_URL'],
      'wss://avail-mainnet.public.blastapi.io/',
    ),
  }
}
