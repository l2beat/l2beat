import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const cctpv1: BaseProject = {
  id: ProjectId('cctpv1'),
  slug: 'cctpv1',
  name: 'CCTP v1',
  shortName: undefined,
  addedAt: UnixTime(1769523398),
  interopConfig: {
    showAlways: ['burnAndMint'],
    plugins: [
      {
        plugin: 'cctp-v1',
      },
    ],
  },
  isInteropProtocol: true,
}
