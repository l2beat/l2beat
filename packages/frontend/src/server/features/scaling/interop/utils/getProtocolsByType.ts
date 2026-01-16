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
  const map = new Map<string, number>()

  for (const record of records) {
    const currentVolume = map.get(record.id) ?? 0
    map.set(
      record.id,
      currentVolume + (record.srcValueUsd ?? record.dstValueUsd ?? 0),
    )
  }

  const groupedProtocols = groupBy(
    interopProjects,
    (p) => p.interopConfig.bridgeType,
  )

  const nonMintingData = Array.from(map.entries()).filter(([key]) =>
    groupedProtocols.nonMinting?.some((p) => p.id === key),
  )
  const mintLockData = Array.from(map.entries()).filter(([key]) =>
    groupedProtocols.canonical?.some((p) => p.id === key),
  )
  const omniChainData = Array.from(map.entries()).filter(([key]) =>
    groupedProtocols.omnichain?.some((p) => p.id === key),
  )

  return {
    nonMinting: nonMintingData.map(([key, value]) => {
      const project = interopProjects.find((p) => p.id === key)
      assert(project, `Project not found: ${key}`)
      return {
        protocolName: project?.interopConfig.name ?? project.name,
        iconSlug: project?.slug,
        volume: value,
      }
    }),
    lockMint: mintLockData.map(([key, value]) => {
      const project = interopProjects.find((p) => p.id === key)
      assert(project, `Project not found: ${key}`)
      return {
        protocolName: project?.interopConfig.name ?? project.name,
        iconSlug: project?.slug,
        volume: value,
      }
    }),
    omniChain: omniChainData.map(([key, value]) => {
      const project = interopProjects.find((p) => p.id === key)
      assert(project, `Project not found: ${key}`)
      return {
        protocolName: project?.interopConfig.name ?? project.name,
        iconSlug: project?.slug,
        volume: value,
      }
    }),
  }
}
