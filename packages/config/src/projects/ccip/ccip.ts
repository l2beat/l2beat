import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const ccip: BaseProject = {
  id: ProjectId('ccip'),
  slug: 'ccip',
  name: 'Chainlink CCIP',
  shortName: 'CCIP',
  addedAt: UnixTime(1769526436),
  interopConfig: {
    showAlways: ['lockAndMint', 'burnAndMint'],
    plugins: [
      {
        plugin: 'ccip',
      },
    ],
  },
  isInteropProtocol: true,
}
