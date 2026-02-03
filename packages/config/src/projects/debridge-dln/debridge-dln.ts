import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const debridgeDln: BaseProject = {
  id: ProjectId('debridge-dln'),
  slug: 'debridge-dln',
  name: 'Debridge DLN',
  shortName: undefined,
  addedAt: UnixTime(1768915493),
  interopConfig: {
    showAlways: ['nonMinting'],
    plugins: [
      {
        plugin: 'debridge-dln',
      },
    ],
  },
  isInteropProtocol: true,
}
