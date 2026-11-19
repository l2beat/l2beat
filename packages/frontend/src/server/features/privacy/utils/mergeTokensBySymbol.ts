import type { ProjectPrivacyToken } from '@l2beat/config'
import { getPrivacyBucketAddress } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'

/**
 * One token per symbol, with the buckets of all of them. A project deployed
 * on several chains has a token per chain, and its assets on all chains are
 * one row each, like its value locked by symbol. A bucket of a merged token
 * names its chain, since the labels repeat across chains.
 */
export function mergeTokensBySymbol(
  tokens: ProjectPrivacyToken[],
  chainNames: Map<string, string>,
): ProjectPrivacyToken[] {
  const bySymbol = new Map<string, ProjectPrivacyToken[]>()
  for (const token of tokens) {
    const group = bySymbol.get(token.token.symbol) ?? []
    group.push(token)
    bySymbol.set(token.token.symbol, group)
  }
  return [...bySymbol.values()].map((group) => {
    const [first] = group
    assert(first, 'Empty token group')
    if (group.length === 1) return first
    return {
      ...first,
      buckets: group.flatMap((token) =>
        token.buckets.map((bucket) => {
          const chain = getPrivacyBucketAddress(bucket.address).chain
          return {
            ...bucket,
            label: `${bucket.label} on ${chainNames.get(chain) ?? chain}`,
          }
        }),
      ),
    }
  })
}
