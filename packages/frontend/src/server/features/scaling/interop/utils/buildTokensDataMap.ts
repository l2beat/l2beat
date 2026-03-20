import { manifest } from '~/utils/Manifest'
import type {
  AggregatedInteropTransferWithTokens,
  CommonInteropData,
  TokenFlowData,
} from '../types'
import { accumulateTokens, INITIAL_COMMON_INTEROP_DATA } from './accumulate'
import { getInteropChains } from './getInteropChains'

export type TokenInteropData = CommonInteropData & {
  flows: Map<string, TokenFlowData>
}

export function buildTokensDataMap(
  records: AggregatedInteropTransferWithTokens[],
): Map<string, TokenInteropData> {
  const chainIconMap = new Map(
    getInteropChains().map((chain) => [
      chain.id,
      manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
    ]),
  )

  const tokenDataMap: Map<string, TokenInteropData> = new Map()
  for (const record of records) {
    for (const token of record.tokens) {
      const current = tokenDataMap.get(token.abstractTokenId) ?? {
        ...INITIAL_COMMON_INTEROP_DATA,
        flows: new Map<string, TokenFlowData>(),
      }

      tokenDataMap.set(token.abstractTokenId, {
        ...accumulateTokens(current, token),
        flows: current.flows,
      })

      const flowKey = `${record.srcChain}::${record.dstChain}`
      const currentFlow = current.flows.get(flowKey)
      if (currentFlow) {
        currentFlow.volume += token.volume
      } else {
        current.flows.set(flowKey, {
          srcChain: {
            id: record.srcChain,
            iconUrl: chainIconMap.get(record.srcChain),
          },
          dstChain: {
            id: record.dstChain,
            iconUrl: chainIconMap.get(record.dstChain),
          },
          volume: token.volume,
        })
      }
    }
  }

  return tokenDataMap
}
