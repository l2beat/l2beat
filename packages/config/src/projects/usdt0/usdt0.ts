import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

const ID_USDT = 'xxeNQv'
const ID_USDT0 = 'X5oZeP'

export const usdt0: BaseProject = {
  id: ProjectId('usdt0'),
  slug: 'usdt0',
  name: 'USDT0',
  shortName: undefined,
  addedAt: UnixTime(1767959267),
  interopConfig: {
    subgroupId: ProjectId('layerzero'),
    showAlways: ['burnAndMint', 'lockAndMint'],
    plugins: [
      {
        abstractTokenId: ID_USDT,
        plugin: 'layerzero-v2-ofts',
      },
      {
        abstractTokenId: ID_USDT0,
        plugin: 'layerzero-v2-ofts',
      },
    ],
  },
  isInteropProtocol: true,
}
