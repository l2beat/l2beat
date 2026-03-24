import type {
  AggregatedInteropTransferWithTokens,
  CommonInteropData,
  TokenFlowData,
} from '../types'
import { accumulateTokens, INITIAL_COMMON_INTEROP_DATA } from './accumulate'

export type TokenInteropData = CommonInteropData & {
  flows: Map<string, TokenFlowData>
}

export function buildTokensDataMap(
  records: AggregatedInteropTransferWithTokens[],
): Map<string, TokenInteropData> {
  const tokenDataMap: Map<string, TokenInteropData> = new Map()
  for (const record of records) {
    for (const token of record.tokens) {
      const current = tokenDataMap.get(token.abstractTokenId) ?? {
        ...INITIAL_COMMON_INTEROP_DATA,
        flows: new Map<string, TokenFlowData>(),
      }

      tokenDataMap.set(
        token.abstractTokenId,
        accumulateTokens(current, token, {
          srcChain: record.srcChain,
          dstChain: record.dstChain,
        }),
      )
    }
  }

  return tokenDataMap
}
