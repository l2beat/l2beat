import type { Project } from '@l2beat/config'
import { manifest } from '~/utils/Manifest'
import type { ProtocolDisplayable } from '../types'

export function getTopProtocolDisplay(
  protocols: Map<string, number>,
  projectsById: Map<string, Project<'interopConfig'>>,
): ProtocolDisplayable | undefined {
  const topProtocolId = pickTopProtocolIdByVolume(protocols)

  if (!topProtocolId) return undefined

  const protocolProject = projectsById.get(topProtocolId)
  if (!protocolProject) return undefined

  return {
    name: protocolProject.interopConfig.name ?? protocolProject.name,
    iconUrl: manifest.getUrl(`/icons/${protocolProject.slug}.png`),
  }
}

export function pickTopProtocolIdByVolume(
  volumeByProtocolId: Iterable<readonly [string, number]>,
): string | undefined {
  return Array.from(volumeByProtocolId).toSorted((a, b) => b[1] - a[1])[0]?.[0]
}
