import type { Project } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'

export type ProtocolsByType = {
  nonMinting: {
    iconSlug: string
    protocolName: string
    volume: number
  }[]
  lockMint: {
    iconSlug: string
    protocolName: string
    volume: number
  }[]
  omniChain: {
    iconSlug: string
    protocolName: string
    volume: number
  }[]
}

export function getProtocolsByType(
  records: {
    id: string
    srcChain: string
    dstChain: string
    srcValueUsd: number | null
    dstValueUsd: number | null
    transferCount: number
  }[],
  interopProjects: Project<'interopConfig'>[],
): ProtocolsByType {
  const volumeByProtocol = new Map<string, number>()

  for (const record of records) {
    const currentVolume = volumeByProtocol.get(record.id) ?? 0
    volumeByProtocol.set(
      record.id,
      currentVolume + (record.srcValueUsd ?? record.dstValueUsd ?? 0),
    )
  }

  const protocolsByType = groupBy(
    interopProjects,
    (p) => p.interopConfig.bridgeType,
  )

  const nonMintingData = Array.from(volumeByProtocol.entries()).filter(
    ([key]) => protocolsByType.nonMinting?.some((p) => p.id === key),
  )
  const mintLockData = Array.from(volumeByProtocol.entries()).filter(([key]) =>
    protocolsByType.canonical?.some((p) => p.id === key),
  )
  const omniChainData = Array.from(volumeByProtocol.entries()).filter(([key]) =>
    protocolsByType.omnichain?.some((p) => p.id === key),
  )

  const getProjectCommon = (key: string) => {
    const project = interopProjects.find((p) => p.id === key)
    assert(project, `Project not found: ${key}`)
    return {
      protocolName: project?.interopConfig.name ?? project.name,
      iconSlug: project?.slug,
    }
  }

  return {
    nonMinting: nonMintingData.map(([key, value]) => {
      return {
        ...getProjectCommon(key),
        volume: value,
      }
    }),
    lockMint: mintLockData.map(([key, value]) => {
      return {
        ...getProjectCommon(key),
        volume: value,
      }
    }),
    omniChain: omniChainData.map(([key, value]) => {
      return {
        ...getProjectCommon(key),
        volume: value,
      }
    }),
  }
}
