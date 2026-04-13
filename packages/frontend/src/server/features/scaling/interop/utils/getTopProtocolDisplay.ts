import type { Project } from '@l2beat/config'
import { manifest } from '~/utils/Manifest'
import type { ProtocolDisplayable } from '../types'
import { pickTopProtocolIdByVolume } from './pickTopProtocolIdByVolume'

export type ProtocolStats = {
  volume: number
  transferCount: number
}

export function getTopProtocolDisplay(
  protocols: Map<string, ProtocolStats>,
  projectsById: Map<string, Project<'interopConfig'>>,
): ProtocolDisplayable | undefined {
  const topProtocolId = pickTopProtocolIdByVolume(
    Array.from(protocols, ([id, stats]) => [id, stats.volume]),
  )

  if (!topProtocolId) return undefined

  const protocolProject = projectsById.get(topProtocolId)
  if (!protocolProject) return undefined

  return {
    name: protocolProject.interopConfig.name ?? protocolProject.name,
    iconUrl: manifest.getUrl(`/icons/${protocolProject.slug}.png`),
  }
}
