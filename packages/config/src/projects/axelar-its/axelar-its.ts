import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const axelarits: BaseProject = {
  id: ProjectId('axelar-its'),
  slug: 'axelar-its',
  name: 'Axelar ITS',
  shortName: undefined,
  addedAt: UnixTime(1769520298),
  interopConfig: {
    description:
      'The Interchain Token Service by Axelar is a multichain token framework built on the Axelar messaging protocol. It is validated by a full validator set on a Cosmos blockchain.',
    plugins: [
      {
        plugin: 'axelar-its',
        bridgeType: 'burnAndMint',
      },
      {
        plugin: 'axelar-its',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'multichain',
  },
}
