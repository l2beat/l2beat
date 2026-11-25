import { getEnv } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { v } from '@l2beat/validate'
import { encodePacked, keccak256 } from 'viem'
import chainList from './chains.json'
import { getDiscoveredConfig } from './discovery'
import { getRpcUrls } from './getRpcUrls'
import { getUopsChains } from './getUopsChains'
import preImages from './preImages.json'
import tokenList from './tokens.json'
import { Chain, type Config } from './types'
import wellKnownAbi from './wellknownabi.json'

export async function getConfig(): Promise<Config> {
  const chains = v.array(Chain).parse(chainList)
  const tokens = v
    .record(v.string(), v.tuple([v.string(), v.number()]))
    .parse(tokenList)
  const env = getEnv()

  const discovered = getDiscoveredConfig(chains)
  const projects = await new ProjectService().getProjects({
    select: ['chainConfig'],
  })

  return {
    port: env.integer('PORT', 3000),
    etherscanApiKey: env.string('ETHERSCAN_API_KEY'),
    chains,
    rpcUrls: getRpcUrls(
      chains,
      env.string('ALCHEMY_API_KEY'),
      projects.map((project) => project.chainConfig),
    ),
    discovered,
    tokens: Object.fromEntries(
      Object.entries(tokens).map(([k, [name, decimals]]) => [
        k,
        { name, decimals },
      ]),
    ),
    wellKnownAbi,
    hashes: getHashes(discovered.preImages.concat(preImages)),
    uopsChains: await getUopsChains(),
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
