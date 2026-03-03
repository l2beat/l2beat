import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
  InteropTransferRecord,
} from '@l2beat/database'
import type { InteropBridgeType } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import type { InteropAggregationConfig } from '../../../../config/features/interop'
import { getAggregatedTokens, getAggregatedTransfer } from './aggregation'
import type { InteropTransferClassifier } from './InteropTransferClassifier'

export interface AggregationResult {
  aggregatedTransfers: AggregatedInteropTransferRecord[]
  aggregatedTokens: AggregatedInteropTokenRecord[]
}

export class InteropAggregationService {
  constructor(private readonly classifier: InteropTransferClassifier) {}

  aggregate(
    transfers: InteropTransferRecord[],
    configs: InteropAggregationConfig[],
    timestamp: number,
  ): AggregationResult {
    const aggregatedTransfers: AggregatedInteropTransferRecord[] = []
    const aggregatedTokens: AggregatedInteropTokenRecord[] = []

    for (const config of configs) {
      const classifiedTransfers = this.classifier.classifyTransfers(
        transfers,
        config,
      )

      // Aggregate transfers and tokens
      for (const [type, records] of Object.entries(classifiedTransfers)) {
        const bridgeType = type as InteropBridgeType
        const grouped = groupBy(records, (x) => `${x.srcChain}-${x.dstChain}`)

        for (const group of Object.values(grouped)) {
          aggregatedTransfers.push({
            timestamp,
            id: config.id,
            bridgeType,
            ...getAggregatedTransfer(group, {
              calculateValueInFlight: bridgeType === 'nonMinting',
              calculateNetMinted: bridgeType === 'lockAndMint',
            }),
          })

          aggregatedTokens.push(
            ...getAggregatedTokens(group, {
              calculateNetMinted: bridgeType === 'lockAndMint',
            }).map((token) => ({
              timestamp,
              id: config.id,
              bridgeType,
              ...token,
            })),
          )
        }
      }
    }

    return {
      aggregatedTransfers,
      aggregatedTokens,
    }
  }
}
