import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { BaseProject } from '../../types'

const _discovery = new ProjectDiscovery('debridge')

export const debridge: BaseProject = {
  id: ProjectId('debridge'),
  slug: 'debridge',
  name: 'deBridge',
  shortName: undefined,
  addedAt: UnixTime(1673362295),
  // this is only the debridge messaging and token bridge
  interopConfig: {
    name: 'deBridge',
    plugins: [
      {
        plugin: 'debridge',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'other',
  },
  isInteropProtocol: true,
}
