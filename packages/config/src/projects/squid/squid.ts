import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const squid: BaseProject = {
  id: ProjectId('squid'),
  slug: 'squid',
  name: 'Squid',
  shortName: undefined,
  addedAt: UnixTime(1769520298),
  interopConfig: {
    plugins: [
      {
        plugin: 'axelar',
        transferType: 'axelar-squid.Transfer',
      },
      {
        plugin: 'squid-coral',
      },
    ],
  },
  isInteropProtocol: true,
}
