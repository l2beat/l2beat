import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const axelar: BaseProject = {
  id: ProjectId('axelar'),
  slug: 'axelar',
  name: 'Axelar',
  shortName: undefined,
  addedAt: UnixTime(1769520298),
  interopConfig: {
    plugins: [
      {
        plugin: 'axelar',
        transferType: 'axelar.Transfer',
        bridgeType: 'lockAndMint',
      },
      {
        plugin: 'axelar',
        transferType: 'axelar.Transfer',
        bridgeType: 'burnAndMint',
      },
    ],
    type: 'multichain', // technically its a token bridge, but >90% used for axlUSDC, which is a multichain token
  },
  isInteropProtocol: true,
}
