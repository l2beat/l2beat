import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { BaseProject } from '../../types'

const _discovery = new ProjectDiscovery('axelar')

export const axelar: BaseProject = {
  id: ProjectId('axelar'),
  slug: 'axelar',
  name: 'Axelar',
  shortName: undefined,
  addedAt: UnixTime(1769520298),
  interopConfig: {
    description:
      'Token bridge built on the Axelar messaging protocol, mostly used for the multichain axlUSDC token. It is validated by a full validator set on a Cosmos blockchain.',
    plugins: [
      {
        plugin: 'axelar',
        bridgeType: 'lockAndMint',
      },
      {
        plugin: 'axelar',
        bridgeType: 'burnAndMint',
      },
      {
        plugin: 'axelar',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'multichain', // technically its a token bridge, but >90% used for axlUSDC, which is a multichain token
  },
}
