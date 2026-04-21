import { ProjectId } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const agglayerCanonical: BaseProject = {
  id: ProjectId('agglayer-canonical'),
  slug: 'agglayer-canonical',
  name: 'Agglayer Canonical',
  shortName: undefined,
  addedAt: 1743677000,
  interopConfig: {
    name: 'Agglayer Canonical',
    plugins: [
      {
        plugin: 'agglayer',
        bridgeType: 'lockAndMint',
      },
      {
        plugin: 'agglayer',
        bridgeType: 'burnAndMint',
      },
    ],
    type: 'canonical',
  },
  isInteropProtocol: true,
}
