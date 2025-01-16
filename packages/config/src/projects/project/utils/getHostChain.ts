import { ProjectId } from '@l2beat/shared-pure'
import { layer2s } from '../../layer2s'

export function getHostChain(id: ProjectId) {
  if (id === ProjectId.ETHEREUM) {
    return { id, slug: 'ethereum', name: 'Ethereum', shortName: undefined }
  }
  const host = layer2s.find((x) => x.id === id)
  if (!host) {
    throw new Error(`Invalid host chain: ${host}`)
  }
  return {
    id,
    slug: host.display.slug,
    name: host.display.name,
    shortName: host.display.shortName,
  }
}
