import type {
  LockAndMintProtocolData,
  NonMintingProtocolData,
  OmniChainProtocolData,
  ProtocolEntry,
} from '~/server/features/scaling/interop/types'

type BridgeTypeProtocolEntryCommon = Pick<
  ProtocolEntry,
  'iconUrl' | 'protocolName' | 'id' | 'subgroup' | 'isAggregate'
>

export type NonMintingProtocolEntry = BridgeTypeProtocolEntryCommon &
  NonMintingProtocolData

export type LockAndMintProtocolEntry = BridgeTypeProtocolEntryCommon &
  LockAndMintProtocolData

export type OmniChainProtocolEntry = BridgeTypeProtocolEntryCommon &
  OmniChainProtocolData

export type GroupedBridgeTypeProtocolEntries = {
  lockAndMint: LockAndMintProtocolEntry[]
  nonMinting: NonMintingProtocolEntry[]
  omnichain: OmniChainProtocolEntry[]
}

export function getBridgeTypeEntries(entries: ProtocolEntry[]): {
  lockAndMint: LockAndMintProtocolEntry[]
  nonMinting: NonMintingProtocolEntry[]
  omnichain: OmniChainProtocolEntry[]
} {
  const lockAndMint: LockAndMintProtocolEntry[] = []
  const nonMinting: NonMintingProtocolEntry[] = []
  const omnichain: OmniChainProtocolEntry[] = []

  for (const entry of entries) {
    if (entry.byBridgeType?.lockAndMint) {
      lockAndMint.push({
        id: entry.id,
        iconUrl: entry.iconUrl,
        protocolName: entry.protocolName,
        subgroup: entry.subgroup,
        isAggregate: entry.isAggregate,
        ...entry.byBridgeType.lockAndMint,
      })
    }
    if (entry.byBridgeType?.nonMinting) {
      nonMinting.push({
        id: entry.id,
        iconUrl: entry.iconUrl,
        protocolName: entry.protocolName,
        subgroup: entry.subgroup,
        isAggregate: entry.isAggregate,
        ...entry.byBridgeType.nonMinting,
      })
    }
    if (entry.byBridgeType?.omnichain) {
      omnichain.push({
        id: entry.id,
        iconUrl: entry.iconUrl,
        protocolName: entry.protocolName,
        subgroup: entry.subgroup,
        isAggregate: entry.isAggregate,
        ...entry.byBridgeType.omnichain,
      })
    }
  }

  return {
    lockAndMint: lockAndMint.sort((a, b) => b.volume - a.volume).slice(0, 5),
    nonMinting: nonMinting.sort((a, b) => b.volume - a.volume).slice(0, 5),
    omnichain: omnichain.sort((a, b) => b.volume - a.volume).slice(0, 5),
  }
}
