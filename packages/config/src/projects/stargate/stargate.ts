import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { BaseProject } from '../../types'

const _discovery = new ProjectDiscovery('stargate')

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
        bridgeType: 'nonMinting',
      },
      {
        plugin: 'stargate',
        bridgeType: 'lockAndMint',
      },
    ],
    durationSplit: {
      lockAndMint: [
        {
          label: 'Bus',
          transferTypes: ['stargate-v2-bus.Transfer'],
        },
        {
          label: 'Taxi',
          transferTypes: ['stargate-v2-taxi.Transfer'],
        },
      ],
      nonMinting: [
        {
          label: 'Bus',
          transferTypes: ['stargate-v2-bus.Transfer'],
        },
        {
          label: 'Taxi',
          transferTypes: ['stargate-v2-taxi.Transfer'],
        },
      ],
    },
    type: 'intent',
  },
  isInteropProtocol: true,
}
