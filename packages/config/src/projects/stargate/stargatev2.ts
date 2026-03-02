import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { BaseProject } from '../../types'

const _discovery = new ProjectDiscovery('stargatev2')

export const stargate: BaseProject = {
  id: ProjectId('stargate'),
  slug: 'stargate',
  name: 'Stargate',
  shortName: undefined,
  addedAt: UnixTime(1718620600),
  interopConfig: {
    plugins: [
      {
        plugin: 'stargate',
        transferType: 'stargate-v2-taxi.Transfer',
        bridgeType: 'nonMinting',
      },
      {
        plugin: 'stargate',
        transferType: 'stargate-v2-taxi.Transfer',
        bridgeType: 'lockAndMint',
      },
      // TODO: needs bus/taxi duration split
    ],
    type: 'intent',
  },
  isInteropProtocol: true,
}
