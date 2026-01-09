import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { InteropProtocol } from '../../internalTypes'

const ABSTRACT_TOKEN_ID = 'yoI9zn'

export const usdt0: InteropProtocol = {
  type: 'interopProtocol',
  addedAt: UnixTime(1767959267),
  id: ProjectId('usdt0'),
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
}
