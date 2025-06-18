import { getEnv } from '@l2beat/backend-tools'
import { v } from '@l2beat/validate'
import { encodePacked, keccak256 } from 'viem'
import chainList from './chains.json'
import { getDiscoveredConfig } from './discovery'
import preImages from './preImages.json'
import tokenList from './tokens.json'
import { Chain, type Config } from './types'
import wellKnownAbi from './wellknownabi.json'

export function getConfig(): Config {
  const chains = v.array(Chain).parse(chainList)
  const tokens = v
    .record(v.string(), v.tuple([v.string(), v.number()]))
    .parse(tokenList)
  const env = getEnv()

  const discovered = getDiscoveredConfig(chains)

  return {
    port: env.integer('PORT', 3000),
    alchemyApiKey: env.string('ALCHEMY_API_KEY'),
    etherscanApiKey: env.string('ETHERSCAN_API_KEY'),
    chains,
    discovered,
    tokens: Object.fromEntries(
      Object.entries(tokens).map(([k, [name, decimals]]) => [
        k,
        { name, decimals },
      ]),
    ),
    wellKnownAbi,
    hashes: getHashes(discovered.preImages.concat(preImages)),
  }
}

function getHashes(preImages: string[]): Record<`0x${string}`, string> {
  const result: Record<`0x${string}`, string> = {}
  const unique = [...new Set(preImages)]
  for (const item of unique) {
    const hash = keccak256(encodePacked(['string'], [item]))
    result[hash] = item
  }
  return result
}
