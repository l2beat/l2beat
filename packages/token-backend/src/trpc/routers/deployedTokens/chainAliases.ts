import type { DeployedTokenRecord } from '@l2beat/database'
import type { ChainRecord } from '@l2beat/database/dist/repositories/ChainRepository'

export function buildAliasToChainMap(
  chains: ChainRecord[],
): Map<string, string> {
  return new Map([
    ...chains.map((c) => [c.name, c.name] as const),
    ...chains.flatMap(
      (c) => c.aliases?.map((alias) => [alias, c.name] as const) ?? [],
    ),
  ])
}

export function platformsToChainAddressPairs(
  platforms: Record<string, string | null | undefined>,
  aliasToChain: Map<string, string>,
): { chain: string; address: string }[] {
  return Object.entries(platforms)
    .map(([platform, address]) => {
      const chain = aliasToChain.get(platform)
      if (!chain || !address) return undefined
      return { chain, address }
    })
    .filter((x): x is { chain: string; address: string } => x !== undefined)
}

export function findUnregisteredPlatformTokens(
  platforms: Record<string, string | null | undefined>,
  deployedTokens: DeployedTokenRecord[],
  aliasToChain: Map<string, string>,
  excludeChain?: string,
): { chain: string; address: string }[] {
  const pairs = platformsToChainAddressPairs(platforms, aliasToChain)
  return pairs.filter(({ chain, address }) => {
    if (excludeChain && chain === excludeChain) return false
    const record = deployedTokens.find(
      (x) =>
        x.chain === chain && x.address.toLowerCase() === address.toLowerCase(),
    )
    return !record
  })
}
