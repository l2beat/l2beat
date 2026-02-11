import type { InteropDurationSplit } from '@l2beat/config'
import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
} from '@l2beat/database'
import { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export type ProtocolEntry = {
  id: string
  iconUrl: string
  protocolName: string
  isAggregate: boolean | undefined
  subgroup:
    | {
        name: string
        iconUrl: string
      }
    | undefined
  volume: number
  tokens: TokenData[]
  chains: ChainData[]
  transferCount: number
  averageValue: number
  averageDuration: AverageDuration
  byBridgeType: ByBridgeTypeData | undefined
  averageValueInFlight: number | undefined
  netMintedValue: number | undefined
}

export type ByBridgeTypeData = {
  lockAndMint: LockAndMintProtocolData | undefined
  nonMinting: NonMintingProtocolData | undefined
  burnAndMint: BurnAndMintProtocolData | undefined
}

export type LockAndMintProtocolData = {
  volume: number
  tokens: TokenData[]
  averageDuration: AverageDuration
}

export type NonMintingProtocolData = {
  volume: number
  tokens: TokenData[]
  averageValueInFlight: number
}

export type BurnAndMintProtocolData = {
  volume: number
  tokens: TokenData[]
}

export type InteropDashboardParams = v.infer<typeof InteropDashboardParams>
export const InteropDashboardParams = v.object({
  from: v.array(v.string()),
  to: v.array(v.string()),
  type: KnownInteropBridgeType.optional(),
})

export type InteropSubpageParams = v.infer<typeof InteropSubpageParams>
export const InteropSubpageParams = v.object({
  type: KnownInteropBridgeType,
  from: v.array(v.string()),
  to: v.array(v.string()),
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
