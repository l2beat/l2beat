import type { Logger } from '@l2beat/backend-tools'
import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
  InteropTransferRecord,
} from '@l2beat/database'
import type { InteropBridgeType } from '@l2beat/shared-pure'
import { groupBy } from 'es-toolkit/compat'
import type { InteropAggregationConfig } from '../../../../config/features/interop'
import { getAggregatedTokens, getAggregatedTransfer } from './aggregation'
import type { InteropTransferClassifier } from './InteropTransferClassifier'

export interface AggregationResult {
  aggregatedTransfers: AggregatedInteropTransferRecord[]
  aggregatedTokens: AggregatedInteropTokenRecord[]
}

export class InteropAggregationService {
  constructor(
    private readonly classifier: InteropTransferClassifier,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  aggregate(
    transfers: InteropTransferRecord[],
    configs: InteropAggregationConfig[],
    timestamp: number,
  ): AggregationResult {
    const aggregatedTransfers: AggregatedInteropTransferRecord[] = []
    const aggregatedTokens: AggregatedInteropTokenRecord[] = []
    const missingInConfigMap = new Map<string, Map<InteropBridgeType, number>>()

    for (const config of configs) {
      const classifiedTransfers = this.classifier.classifyTransfers(
        transfers,
        config,
      )

      for (const [type, records] of Object.entries(classifiedTransfers)) {
        const bridgeType = type as InteropBridgeType
        if (
          !config.showAlways ||
          bridgeType === 'unknown' ||
          config.showAlways.includes(bridgeType)
        ) {
          continue
        }

        if (records.length === 0) {
          continue
        }

        const current = missingInConfigMap.get(config.id)
        if (current) {
          current.set(bridgeType, records.length)
        } else {
          missingInConfigMap.set(
            config.id,
            new Map([[bridgeType, records.length]]),
          )
        }
      }

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

    if (missingInConfigMap.size > 0) {
      this.logger.warn(
        'Some bridge types were automatically detected and are not defined in configs',
        {
          missingInConfigs: Array.from(missingInConfigMap.entries()).map(
            ([key, value]) => ({
              id: key,
              ...Object.fromEntries(value.entries()),
            }),
          ),
        },
      )
    }

    return {
      aggregatedTransfers,
      aggregatedTokens,
    }
  }
}
