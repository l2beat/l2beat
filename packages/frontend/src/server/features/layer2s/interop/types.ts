import type { InteropType } from '@l2beat/config'
import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
  InteropTransferTypeStatsMap,
} from '@l2beat/database'
import { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { FilterableEntry } from '~/components/table/filters/filterableValue'
import type { InteropFlowData } from './utils/getFlows'
import type { TopItems } from './utils/getTopItems'

export type ProtocolEntry = {
  id: ProjectId
  slug: string
  iconUrl: string
  name: string
  shortName: string | undefined
  description: string | undefined
  type: InteropType
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
  topRoute:
    | {
        srcChain: { id: string; name: string; iconUrl: string }
        dstChain: { id: string; name: string; iconUrl: string }
        volume: number
      }
    | undefined
  snapshotTimestamp: number | undefined
} & FilterableEntry

export type ProtocolDisplayable = {
  name: string
  slug: string
  iconUrl: string
}

export type ByBridgeTypeData = {
  lockAndMint: LockAndMintProtocolData | undefined
  nonMinting: NonMintingProtocolData | undefined
  burnAndMint: BurnAndMintProtocolData | undefined
  unknown: BridgeTypeCommonData | undefined
}

type BridgeTypeCommonData = {
  volume: number
  transferCount: number
  averageValue: number | null
  tokens: TopItems<TokenData>
  flows: InteropFlowData[]
}

export type LockAndMintProtocolData = BridgeTypeCommonData & {
  netMintedValue: number | undefined
}

export type NonMintingProtocolData = BridgeTypeCommonData & {
  averageValueInFlight: number | undefined
}

export type BurnAndMintProtocolData = BridgeTypeCommonData

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
  /** When set, only the top N protocol entries (by volume) are returned. */
  limit: v.number().optional(),
})

export type InteropProtocolParams = v.infer<typeof InteropProtocolParams>
export const InteropProtocolParams = v.object({
  id: v.string().transform((value) => ProjectId(value)),
  ...InteropSelectionInputShape,
})

const InteropProjectScope = v.object({
  type: v.literal('project'),
  projectId: v.string().transform((value) => ProjectId(value)),
})
const InteropSelectionScope = v.object({
  type: v.literal('selection'),
  protocolIds: v.array(v.string()),
  anchorChain: v.string().optional(),
})
export type InteropScope = v.infer<typeof InteropScope>
export const InteropScope = v.union([
  InteropProjectScope,
  InteropSelectionScope,
])

export type InteropBridgeSelectionParams = v.infer<
  typeof InteropBridgeSelectionParams
>
export const InteropBridgeSelectionParams = v.object({
  ...InteropSelectionInputShape,
  protocolIds: v.array(v.string()),
  anchorChain: v.string().optional(),
})

export type InteropTokenParams = v.infer<typeof InteropTokenParams>
export const InteropTokenParams = v.object({
  tokenId: v.string(),
  ...InteropSelectionInputShape,
})

export type InteropTopItemsParams = v.infer<typeof InteropTopItemsParams>
export const InteropTopItemsSort = v.object({
  id: v.enum([
    'symbol',
    'pair',
    'topProtocol',
    'volume',
    'transferCount',
    'avgDuration',
    'avgValue',
    'flows',
    'netMintedValue',
  ]),
  desc: v.boolean(),
})
export type InteropTopItemsSort = v.infer<typeof InteropTopItemsSort>
export const InteropTopItemsSorting = v.array(InteropTopItemsSort)
export type InteropTopItemsSorting = v.infer<typeof InteropTopItemsSorting>

const InteropTopItemsParamsShape = {
  id: v.union([
    v.string().transform((value) => ProjectId(value)),
    v.undefined(),
  ]),
  ...InteropSelectionInputShape,
  type: KnownInteropBridgeType.optional(),
  protocolIds: v.array(v.string()).optional(),
  anchorChain: v.string().optional(),
}
export const InteropTopItemsParams = v.object(InteropTopItemsParamsShape)

export type InteropTopItemsInfiniteParams = v.infer<
  typeof InteropTopItemsInfiniteParams
>
export const InteropTopItemsInfiniteParams = v.object({
  ...InteropTopItemsParamsShape,
  cursor: v.number().optional(),
  limit: v.number().optional(),
  sort: InteropTopItemsSorting.optional(),
})

export type InteropProtocolTransfersParams = v.infer<
  typeof InteropProtocolTransfersParams
>
export type InteropProtocolTransfersCursor = v.infer<
  typeof InteropProtocolTransfersCursor
>
export const InteropProtocolTransfersCursor = v.object({
  timestamp: v.number(),
  transferId: v.string(),
})
export const InteropProtocolTransfersParams = v.object({
  scope: InteropScope,
  ...InteropSelectionInputShape,
  type: KnownInteropBridgeType.optional(),
  tokenId: v.string().optional(),
  snapshotTimestamp: v.number(),
  limit: v.number().optional(),
  cursor: InteropProtocolTransfersCursor.optional(),
})

export type InteropTokenTransfersParams = v.infer<
  typeof InteropTokenTransfersParams
>
export const InteropTokenTransfersParams = v.object({
  tokenId: v.string(),
  ...InteropSelectionInputShape,
  snapshotTimestamp: v.number(),
  limit: v.number().optional(),
  cursor: InteropProtocolTransfersCursor.optional(),
})

export type InteropFlowsParams = v.infer<typeof InteropFlowsParams>
export const InteropFlowsParams = v.object({
  chains: v.array(v.string()),
  protocolIds: v.array(v.string()),
  tokenId: v.string().optional(),
})

export type InteropProtocolsByVolumeParams = v.infer<
  typeof InteropProtocolsByVolumeParams
>
export const InteropProtocolsByVolumeParams = v.object({
  chains: v.array(v.string()),
  protocolIds: v.array(v.string()),
})

export type InteropTransferBridge = {
  name: string
  href: string
}

export type InteropProtocolTransferDetailsItem = {
  transferId: string
  timestamp: number
  srcAmount: number | undefined
  srcSymbol: string
  srcAbstractTokenId: string | undefined
  srcTokenIssuer: string | null
  srcTokenIconUrl: string
  dstAmount: number | undefined
  dstSymbol: string
  dstAbstractTokenId: string | undefined
  dstTokenIssuer: string | null
  dstTokenIconUrl: string
  valueUsd: number | undefined
  bridge: InteropTransferBridge
  duration: number | undefined
  srcChain: string
  srcChainIconUrl: string | undefined
  srcTxHash: string | undefined
  srcTxHashHref: string | undefined
  dstChain: string
  dstChainIconUrl: string | undefined
  dstTxHash: string | undefined
  dstTxHashHref: string | undefined
}

export type InteropProtocolTransfersResponse = {
  items: InteropProtocolTransferDetailsItem[]
  nextCursor: InteropProtocolTransfersCursor | undefined
}

export type AggregatedInteropTransferWithTokens =
  AggregatedInteropTransferRecord & {
    tokens: Omit<
      AggregatedInteropTokenRecord,
      'id' | 'timestamp' | 'srcChain' | 'dstChain' | 'bridgeType'
    >[]
  }

export type ScopedInteropTransfer = Pick<
  AggregatedInteropTransferWithTokens,
  'id' | 'timestamp' | 'bridgeType' | 'srcChain' | 'dstChain'
> &
  CommonInteropData & {
    tokens: [AggregatedInteropTransferWithTokens['tokens'][number]]
    volume: number
    identifiedCount: number
    avgValueInFlight: undefined
  }

export type InteropTransferWithTokens =
  | AggregatedInteropTransferWithTokens
  | ScopedInteropTransfer

export type CommonInteropData = {
  volume: number
  transferCount: number
  transfersWithDurationCount: number
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
  topProtocol: ProtocolDisplayable | undefined
  volume: number | null
  transferCount: number
  avgDuration: AverageDuration | null
  avgValue: number | null
  minTransferValueUsd: number | undefined
  maxTransferValueUsd: number | undefined
  netMintedValue: number | undefined
  flows: TokenFlowData[]
}

export type InteropTokensResponse = {
  items: TokenData[]
  nextCursor: number | undefined
}

export type TokensPairData = {
  id: string
  tokenA: { id: string; symbol: string; issuer: string | null; iconUrl: string }
  tokenB: { id: string; symbol: string; issuer: string | null; iconUrl: string }
  topProtocol: ProtocolDisplayable | undefined
  volume: number | null
  transferCount: number
  avgDuration: AverageDuration | null
  avgValue: number | null
  minTransferValueUsd: number | undefined
  maxTransferValueUsd: number | undefined
  netMintedValue: number | undefined
  flows: TokenFlowData[]
}

export type InteropTokensPairsResponse = {
  items: TokensPairData[]
  nextCursor: number | undefined
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
