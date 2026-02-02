import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const axelarits: BaseProject = {
  id: ProjectId('axelar-its'),
  slug: 'axelar-its',
  name: 'Axelar ITS',
  shortName: undefined,
  addedAt: UnixTime(1769520298),
  interopConfig: {
    bridgeType: 'omnichain',
    plugins: [
      {
        plugin: 'axelar-its',
      },
    ],
  },
  isInteropProtocol: true,
}
