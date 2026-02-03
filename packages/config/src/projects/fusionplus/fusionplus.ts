import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const fusionplus: BaseProject = {
  id: ProjectId('fusionplus'),
  slug: 'fusionplus',
  name: '1inch Fusion+',
  shortName: undefined,
  addedAt: UnixTime(1770021647),
  interopConfig: {
    showAlways: ['nonMinting'],
    plugins: [
      {
        plugin: 'oneinch-fusion-plus',
      },
    ],
  },
  isInteropProtocol: true,
}
