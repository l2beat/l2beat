import type { InteropDurationSplit } from '@l2beat/config'
import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
  InteropTransferTypeStatsMap,
} from '@l2beat/database'
import { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { TopItems } from './utils/getTopItems'

export type ProtocolEntry = {
  id: ProjectId
  iconUrl: string
  name: string
  shortName: string | undefined
  bridgeTypes: KnownInteropBridgeType[]
  isAggregate: boolean | undefined
  subgroup:
    | {
        name: string
        iconUrl: string
      }
    | undefined
  volume: number
  tokens: TopItems<TokenData>
  chains: TopItems<ChainData>
  transferCount: number
  averageValue: number | null
  minTransferValueUsd: number | undefined
  maxTransferValueUsd: number | undefined
  averageDuration: AverageDuration | null
  byBridgeType: ByBridgeTypeData | undefined
  averageValueInFlight: number | undefined
  netMintedValue: number | undefined
  snapshotTimestamp: number | undefined
}

export type ProtocolDisplayable = {
  name: string
  iconUrl: string
}

export type ByBridgeTypeData = {
  lockAndMint: LockAndMintProtocolData | undefined
  nonMinting: NonMintingProtocolData | undefined
  burnAndMint: BurnAndMintProtocolData | undefined
}

export type LockAndMintProtocolData = {
  volume: number
  netMintedValue: number | undefined
  tokens: TopItems<TokenData>
}

export type NonMintingProtocolData = {
  volume: number
  tokens: TopItems<TokenData>
  averageValueInFlight: number
}

export type BurnAndMintProtocolData = {
  volume: number
  tokens: TopItems<TokenData>
}

export type InteropSelectionInput = v.infer<typeof InteropSelectionInput>
const InteropSelectionInputShape = {
  from: v.array(v.string().check((value) => value.length > 0)),
  to: v.array(v.string().check((value) => value.length > 0)),
}
export const InteropSelectionInput = v.object(InteropSelectionInputShape)

export type InteropDashboardParams = v.infer<typeof InteropDashboardParams>
export const InteropDashboardParams = v.object({
  ...InteropSelectionInputShape,
  type: KnownInteropBridgeType.optional(),
})

export type InteropProtocolTokensParams = v.infer<
  typeof InteropProtocolTokensParams
>
export const InteropProtocolTokensParams = v.object({
  id: v.string().transform((value) => ProjectId(value)),
  ...InteropSelectionInputShape,
  type: KnownInteropBridgeType.optional(),
})

export type InteropProtocolTransfersParams = v.infer<
  typeof InteropProtocolTransfersParams
>
export const InteropProtocolTransfersParams = v.object({
  id: v.string().transform((value) => ProjectId(value)),
  ...InteropSelectionInputShape,
  type: KnownInteropBridgeType.optional(),
  expectedTransferCount: v.number(),
  expectedVolume: v.number(),
  snapshotTimestamp: v.number(),
  cursor: v.number().optional(),
})

export type InteropProtocolTransferDetailsItem = {
  transferId: string
  timestamp: number
  srcAmount: number | undefined
  srcSymbol: string | undefined
  srcTokenIconUrl: string
  dstAmount: number | undefined
  dstSymbol: string | undefined
  dstTokenIconUrl: string
  valueUsd: number | undefined
  duration: number
  srcChain: string
  srcTxHash: string
  srcTxHashHref: string
  dstChain: string
  dstTxHash: string
  dstTxHashHref: string
}

export type InteropProtocolTransferStats = {
  transferCount: number
  volume: number
}

export type InteropProtocolTransfersResponse = {
  items: InteropProtocolTransferDetailsItem[]
  hasIntegrityMismatch: boolean
  nextCursor: number | undefined
}

export type AggregatedInteropTransferWithTokens =
  AggregatedInteropTransferRecord & {
    tokens: Omit<
      AggregatedInteropTokenRecord,
      'id' | 'timestamp' | 'srcChain' | 'dstChain' | 'bridgeType'
    >[]
  }

export type CommonInteropData = {
  volume: number
  transferCount: number
  totalDurationSum: number
  transferTypeStats: InteropTransferTypeStatsMap | undefined
  minTransferValueUsd: number | undefined
  maxTransferValueUsd: number | undefined
  mintedValueUsd: number | undefined
  burnedValueUsd: number | undefined
}

export type TokenFlowData = {
  srcChain: {
    id: string
    iconUrl: string | undefined
  }
  dstChain: {
    id: string
    iconUrl: string | undefined
  }
  volume: number
}

export type TokenData = {
  id: string
  symbol: string
  issuer: string | null
  iconUrl: string
  volume: number | null
  transferCount: number
  avgDuration: AverageDuration | null
  avgValue: number | null
  minTransferValueUsd: number | undefined
  maxTransferValueUsd: number | undefined
  netMintedValue: number | undefined
  flows: TokenFlowData[]
}

export type ChainData = {
  id: string
  name: string
  iconUrl: string
  volume: number
  transferCount: number
  avgDuration: AverageDuration | null
  avgValue: number
  minTransferValueUsd: number | undefined
  maxTransferValueUsd: number | undefined
  netMintedValue: number | undefined
}

export type SingleAverageDuration = {
  type: 'single'
  duration: number
}

export type SplitAverageDuration = {
  type: 'split'
  splits: {
    label: string
    duration: number | null
  }[]
}

export type UnknownAverageDuration = {
  type: 'unknown'
}

export type AverageDuration =
  | SingleAverageDuration
  | SplitAverageDuration
  | UnknownAverageDuration
/** Two-level map: projectId -> bridgeType -> durationSplit config */

export type DurationSplitMap = Map<
  string,
  Map<KnownInteropBridgeType, NonNullable<InteropDurationSplit>>
>
