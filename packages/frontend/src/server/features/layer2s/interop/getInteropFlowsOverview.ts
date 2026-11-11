import {
  type ChainData,
  type Flow,
  getInteropFlows,
  type InteropFlowsData,
} from './getInteropFlows'
import type { InteropFlowsParams, TokenData } from './types'
import type { TopItems } from './utils/getTopItems'

export type FlowsGraphChainData = Pick<
  ChainData,
  'chainId' | 'totalVolume' | 'netFlow'
>

/** What the flows graph draws. */
export interface InteropFlowsGraphData {
  flows: Flow[]
  chainData: FlowsGraphChainData[]
}

export type FlowsOverviewToken = Pick<
  TokenData,
  'id' | 'symbol' | 'issuer' | 'iconUrl' | 'volume'
>

/** What the flows graph and the general stats panel render. */
export interface InteropFlowsOverview extends InteropFlowsGraphData {
  stats: Omit<InteropFlowsData['stats'], 'topTokens'> & {
    topTokens: TopItems<FlowsOverviewToken>
  }
}

/**
 * Flows without the per-chain and per-pair breakdowns that only the
 * interactive selection panels read. The home page draws a static graph, so
 * shipping those would make it carry most of the payload for nothing.
 */
export async function getInteropFlowsOverview(
  params: InteropFlowsParams,
): Promise<InteropFlowsOverview> {
  return toInteropFlowsOverview(
    await getInteropFlows(params, OVERVIEW_TOP_PROTOCOLS_COUNT),
  )
}

/** The home page ranks five protocols, like every ranking on it. */
const OVERVIEW_TOP_PROTOCOLS_COUNT = 5

export function toInteropFlowsOverview(
  data: InteropFlowsData,
): InteropFlowsOverview {
  return {
    flows: data.flows,
    chainData: data.chainData.map((chain) => ({
      chainId: chain.chainId,
      totalVolume: chain.totalVolume,
      netFlow: chain.netFlow,
    })),
    stats: {
      ...data.stats,
      topTokens: {
        items: data.stats.topTokens.items.map((token) => ({
          id: token.id,
          symbol: token.symbol,
          issuer: token.issuer,
          iconUrl: token.iconUrl,
          volume: token.volume,
        })),
        remainingCount: data.stats.topTokens.remainingCount,
      },
    },
  }
}
