import type { RouterOutputs } from '~/trpc/React'
import { getSsrHelpers } from '~/trpc/server'

// Determine the volume order across all chains on a throwaway client so the
// all-chains query is not dehydrated (the client never requests it).
export async function getFlowChainOrderByVolume(
  chainIds: string[],
  protocolIds: string[],
): Promise<string[]> {
  const ordering = getSsrHelpers()
  const flowsData: RouterOutputs['interop']['flows'] =
    await ordering.queryClient.fetchQuery(
      ordering.trpc.interop.flows.queryOptions({
        chains: chainIds,
        protocolIds,
      }),
    )
  const chainsByVolume = flowsData.chainData
    .toSorted((a, b) => b.totalVolume - a.totalVolume)
    .map((chain) => chain.chainId)
  return chainsByVolume.length > 0 ? chainsByVolume : chainIds
}
