import { getEnv } from '@l2beat/backend-tools'
import { z } from 'zod'
import list from './chains.json'
import { getDiscoveredConfig } from './discovery'
import { Chain, type Config } from './types'

export function getConfig(): Config {
  const chains = z.array(Chain).parse(list)
  const env = getEnv()
  return {
    port: env.integer('PORT', 3000),
    alchemyApiKey: env.string('ALCHEMY_API_KEY'),
    etherscanApiKey: env.string('ETHERSCAN_API_KEY'),
    chains,
    discovered: getDiscoveredConfig(chains),
  }
}
