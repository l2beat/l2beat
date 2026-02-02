import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const axelar: BaseProject = {
  id: ProjectId('axelar'),
  slug: 'axelar',
  name: 'Axelar',
  shortName: undefined,
  addedAt: UnixTime(1769520298),
  interop: {
    configs: [
      {
        bridgeType: 'lockAndMint',
        plugins: [
          {
            plugin: 'axelar',
            transferType: 'axelar.Transfer',
          },
        ],
      },
    ],
  },
  isInteropProtocol: true,
}
