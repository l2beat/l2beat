import type {
  BurnAndMintProtocolData,
  LockAndMintProtocolData,
  NonMintingProtocolData,
  ProtocolEntry,
} from '~/server/features/scaling/interop/types'

type BridgeTypeProtocolEntryCommon = Pick<
  ProtocolEntry,
  'iconUrl' | 'protocolName' | 'subgroup' | 'isAggregate'
>

export type NonMintingProtocolEntry = BridgeTypeProtocolEntryCommon &
  NonMintingProtocolData

export type LockAndMintProtocolEntry = BridgeTypeProtocolEntryCommon &
  LockAndMintProtocolData

export type BurnAndMintProtocolEntry = BridgeTypeProtocolEntryCommon &
  BurnAndMintProtocolData

export type GroupedBridgeTypeProtocolEntries = {
  lockAndMint: LockAndMintProtocolEntry[]
  nonMinting: NonMintingProtocolEntry[]
  burnAndMint: BurnAndMintProtocolEntry[]
}

export function getBridgeTypeEntries(entries: ProtocolEntry[]): {
  lockAndMint: LockAndMintProtocolEntry[]
  nonMinting: NonMintingProtocolEntry[]
  burnAndMint: BurnAndMintProtocolEntry[]
} {
  const lockAndMint: LockAndMintProtocolEntry[] = []
  const nonMinting: NonMintingProtocolEntry[] = []
  const burnAndMint: BurnAndMintProtocolEntry[] = []

  for (const entry of entries) {
    if (entry.byBridgeType?.lockAndMint) {
      lockAndMint.push({
        iconUrl: entry.iconUrl,
        protocolName: entry.protocolName,
        subgroup: entry.subgroup,
        isAggregate: entry.isAggregate,
        ...entry.byBridgeType.lockAndMint,
      })
    }
    if (entry.byBridgeType?.nonMinting) {
      nonMinting.push({
        iconUrl: entry.iconUrl,
        protocolName: entry.protocolName,
        subgroup: entry.subgroup,
        isAggregate: entry.isAggregate,
        ...entry.byBridgeType.nonMinting,
      })
    }
    if (entry.byBridgeType?.burnAndMint) {
      burnAndMint.push({
        iconUrl: entry.iconUrl,
        protocolName: entry.protocolName,
        subgroup: entry.subgroup,
        isAggregate: entry.isAggregate,
        ...entry.byBridgeType.burnAndMint,
      })
    }
  }

  return {
    lockAndMint: lockAndMint.sort((a, b) => b.volume - a.volume).slice(0, 5),
    nonMinting: nonMinting.sort((a, b) => b.volume - a.volume).slice(0, 5),
    burnAndMint: burnAndMint.sort((a, b) => b.volume - a.volume).slice(0, 5),
  }
}
