import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const layerzero: BaseProject = {
  id: ProjectId('layerzero'),
  slug: 'layerzero',
  name: 'LayerZero',
  shortName: undefined,
  addedAt: UnixTime(1769421770),
  interopConfig: {
    description:
      'LayerZero OFT (omnichain fungible token) is a multichain token framework built on the modular, highly cusomizable LayerZero messaging protocol. It is validated by customizable smart contracts called DVNs.',
    isAggregate: true,
    plugins: [
      {
        plugin: 'layerzero-v2-ofts',
        bridgeType: 'burnAndMint',
      },
      {
        plugin: 'layerzero-v2-ofts',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'multichain',
  },
}
