import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { BaseProject } from '../../types'

const _discovery = new ProjectDiscovery('wormholewtt')

export const wormholeWtt: BaseProject = {
  id: ProjectId('wormhole-wtt'),
  slug: 'wormhole-wtt',
  name: 'Wormhole WTT',
  shortName: 'Wormhole WTT',
  addedAt: UnixTime(1770637610),
  interopConfig: {
    plugins: [
      {
        plugin: 'wormhole-token-bridge',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'other',
  },
  isInteropProtocol: true,
}
