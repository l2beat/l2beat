import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const layerzero: BaseProject = {
  id: ProjectId('layerzero'),
  slug: 'layerzero',
  name: 'LayerZero',
  shortName: undefined,
  addedAt: UnixTime(1769421770),
  interopConfig: {
    isAggregate: true,
    showAlways: ['burnAndMint'],
    plugins: [
      {
        plugin: 'layerzero-v2-ofts',
      },
    ],
  },
  isInteropProtocol: true,
}
