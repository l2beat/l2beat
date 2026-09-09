import { ProjectId } from '@l2beat/shared-pure'
import { manifest } from '~/utils/Manifest'
import type { CommonProjectEntry } from './getCommonProjectEntry'

/**
 * Ethereum is not a scaling project, so tables that show it as a baseline
 * row cannot use getCommonProjectEntry and build the row here instead.
 */
export function getEthereumCommonEntry(options?: {
  description?: string
}): CommonProjectEntry {
  return {
    id: ProjectId.ETHEREUM,
    slug: 'ethereum',
    icon: manifest.getUrl('/icons/ethereum.png'),
    name: 'Ethereum',
    shortName: undefined,
    backgroundColor: 'blue',
    statuses: undefined,
    description: options?.description,
  }
}
