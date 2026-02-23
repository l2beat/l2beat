import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const mayan: BaseProject = {
  id: ProjectId('mayan'),
  slug: 'mayan',
  name: 'Mayan',
  shortName: undefined,
  addedAt: UnixTime(1771847938),
  interopConfig: {
    plugins: [
      {
        plugin: 'mayan-swift',
        bridgeType: 'nonMinting',
      },
    ],
  },
  isInteropProtocol: true,
}
