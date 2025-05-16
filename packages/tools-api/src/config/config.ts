import { getEnv } from '@l2beat/backend-tools'
import { z } from 'zod'
import chainList from './chains.json'
import { getDiscoveredConfig } from './discovery'
import tokenList from './tokens.json'
import { Chain, type Config } from './types'
import wellKnownAbi from './wellknownabi.json'

export function getConfig(): Config {
  const chains = z.array(Chain).parse(chainList)
  const tokens = z
    .record(z.string(), z.tuple([z.string(), z.number()]))
    .parse(tokenList)
  const env = getEnv()
  return {
    port: env.integer('PORT', 3000),
    alchemyApiKey: env.string('ALCHEMY_API_KEY'),
    etherscanApiKey: env.string('ETHERSCAN_API_KEY'),
    chains,
    discovered: getDiscoveredConfig(chains),
    tokens: Object.fromEntries(
      Object.entries(tokens).map(([k, [name, decimals]]) => [
        k,
        { name, decimals },
      ]),
    ),
    wellKnownAbi,
  }
}
