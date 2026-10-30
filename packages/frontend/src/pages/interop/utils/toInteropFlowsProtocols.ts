import type { Project } from '@l2beat/config'
import type { Manifest } from '~/utils/Manifest'
import type { InteropFlowsProtocol } from '../components/flows/utils/InteropFlowsContext'

export function toInteropFlowsProtocols(
  manifest: Manifest,
  protocols: Project<'interopConfig'>[],
): InteropFlowsProtocol[] {
  return protocols.map((protocol) => ({
    id: protocol.id,
    name: protocol.interopConfig.name ?? protocol.name,
    slug: protocol.slug,
    iconUrl: manifest.getUrl(`/icons/${protocol.slug}.png`),
  }))
}
