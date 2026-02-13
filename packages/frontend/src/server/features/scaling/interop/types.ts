import type { InteropDurationSplit } from '@l2beat/config'
import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
} from '@l2beat/database'
import { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { TopItems } from './utils/getTopItems'

export type ProtocolEntry = {
  id: ProjectId
  iconUrl: string
  protocolName: string
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
  averageDuration: AverageDuration | null
  byBridgeType: ByBridgeTypeData | undefined
  averageValueInFlight: number | undefined
  netMintedValue: number | undefined
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
  tokens: TopItems<TokenData>
  averageDuration: AverageDuration | null
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

const SelectedChainsSchema = v.tuple([
  v.union([v.string(), v.undefined()]),
  v.union([v.string(), v.undefined()]),
])
export type SelectedChains = v.infer<typeof SelectedChainsSchema>

export type InteropDashboardParams = v.infer<typeof InteropDashboardParams>
export const InteropDashboardParams = v.object({
  selectedChains: SelectedChainsSchema,
  type: KnownInteropBridgeType.optional(),
})

export type InteropProtocolTokensParams = v.infer<
  typeof InteropProtocolTokensParams
>
export const InteropProtocolTokensParams = v.object({
  id: v.string().transform((value) => ProjectId(value)),
  selectedChains: SelectedChainsSchema,
  type: KnownInteropBridgeType.optional(),
})

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
  inTransferCount: number
  inDurationSum: number
  outTransferCount: number
  outDurationSum: number
  mintedValueUsd: number | undefined
  burnedValueUsd: number | undefined
}

export type TokenData = {
  id: string
  symbol: string
  iconUrl: string
  volume: number | null
  transferCount: number
  avgDuration: AverageDuration | null
  avgValue: number | null
  netMintedValue: number | undefined
}

export type ChainData = {
  id: string
  name: string
  iconUrl: string
  volume: number
  transferCount: number
  avgDuration: AverageDuration | null
  avgValue: number
  netMintedValue: number | undefined
}

export type SingleAverageDuration = {
  type: 'single'
  duration: number
}

export type SplitAverageDuration = {
  type: 'split'
  in: {
    label: string
    duration: number | null
  }
  out: {
    label: string
    duration: number | null
  }
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
