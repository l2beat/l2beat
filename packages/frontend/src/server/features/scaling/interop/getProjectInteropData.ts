import type { Project } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { MAX_SELECTED_CHAINS } from '~/pages/interop/components/flows/consts'
import { mapInteropChainsToWithIcons } from '~/pages/interop/utils/mapInteropChainsToWithIcons'
import type { RouterOutputs } from '~/trpc/React'
import type { SsrHelpers } from '~/trpc/server'
import { manifest } from '~/utils/Manifest'
import { getInteropChains } from './utils/getInteropChains'

export interface ProjectInteropData {
  chainId: string
  canonicalProtocolId: string | undefined
  interopChains: InteropChainWithIcon[]
  protocols: {
    id: string
    slug: string
    name: string
    iconUrl: string
  }[]
  defaultSelectedChains: string[]
  summary: {
    volume: number
    transferCount: number
    protocols: {
      items: {
        id: string
        name: string
        iconUrl: string
        volume: number
      }[]
      remainingCount: number
    }
    tokens: {
      items: {
        id: string
        symbol: string
        iconUrl: string
        volume: number
      }[]
      remainingCount: number
    }
  }
}

export async function getProjectInteropData(
  projectId: ProjectId,
  interopProjects: Project<'interopConfig'>[],
  helpers: SsrHelpers,
): Promise<ProjectInteropData | undefined> {
  const interopChains = mapInteropChainsToWithIcons(
    manifest,
    getInteropChains().filter((chain) => !chain.isUpcoming),
  )

  const currentInteropChain = interopChains.find(
    (chain) => chain.id === projectId,
  )
  if (!currentInteropChain) return undefined

  const orderedInteropChains = [
    currentInteropChain,
    ...interopChains.filter((chain) => chain.id !== currentInteropChain.id),
  ]
  const defaultSelectedChains = orderedInteropChains
    .map((chain) => chain.id)
    .slice(0, MAX_SELECTED_CHAINS)
  const protocols = interopProjects.map((protocol) => ({
    id: protocol.id,
    slug: protocol.slug,
    name: protocol.interopConfig.name ?? protocol.name,
    iconUrl: manifest.getUrl(`/icons/${protocol.slug}.png`),
  }))
  const interopFlows: RouterOutputs['interop']['flows'] =
    await helpers.queryClient.fetchQuery(
      helpers.trpc.interop.flows.queryOptions({
        chains: defaultSelectedChains,
        protocolIds: protocols.map((protocol) => protocol.id),
      }),
    )
  const currentChainData = interopFlows.chainData.find(
    (chain) => chain.chainId === currentInteropChain.id,
  )
  const canonicalProtocolId = interopProjects.find(
    (protocol) => protocol.id === projectId,
  )?.id

  return {
    chainId: currentInteropChain.id,
    canonicalProtocolId,
    interopChains: orderedInteropChains,
    protocols,
    defaultSelectedChains,
    summary: {
      volume: currentChainData?.totalVolume ?? 0,
      transferCount:
        (currentChainData?.transfersIn ?? 0) +
        (currentChainData?.transfersOut ?? 0),
      protocols: {
        items: (currentChainData?.topProtocols ?? []).map((protocol) => ({
          id: protocol.id,
          name: protocol.name,
          iconUrl: protocol.iconUrl,
          volume: protocol.volume,
        })),
        remainingCount: Math.max(
          (currentChainData?.protocolCount ?? 0) -
            (currentChainData?.topProtocols.length ?? 0),
          0,
        ),
      },
      tokens: {
        items: (currentChainData?.topTokens ?? []).map((token) => ({
          id: token.id,
          symbol: token.symbol,
          iconUrl: token.iconUrl,
          volume: token.volume,
        })),
        remainingCount: Math.max(
          (currentChainData?.tokenCount ?? 0) -
            (currentChainData?.topTokens.length ?? 0),
          0,
        ),
      },
    },
  }
}
