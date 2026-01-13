import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

const ABSTRACT_TOKEN_ID = 'yoI9zn'

export const usdt0: BaseProject = {
  id: ProjectId('usdt0'),
  slug: 'usdt0',
  name: 'USDT0',
  shortName: undefined,
  addedAt: UnixTime(1767959267),
  interopConfig: {
    bridgeType: 'omnichain',
    plugins: [
      {
        filterBy: 'abstractTokenId',
        abstractTokenId: ABSTRACT_TOKEN_ID,
        plugin: 'layerzero-v2',
      },
      {
        filterBy: 'abstractTokenId',
        abstractTokenId: ABSTRACT_TOKEN_ID,
        plugin: 'layerzero-v2-ofts',
      },
    ],
  },
  isInteropProtocol: true,
}
