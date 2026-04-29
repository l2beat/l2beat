import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const cctpv1: BaseProject = {
  id: ProjectId('cctpv1'),
  slug: 'cctpv1',
  name: 'CCTP v1',
  shortName: undefined,
  addedAt: UnixTime(1769523398),
  interopConfig: {
    description:
      'This is the first version cross-chain transfer protocol by Circle. Mainly used for USDC burn-mint transfers, it coexists with the v2 protocol and can also be used for arbitrary message passing.',
    plugins: [
      {
        plugin: 'cctp-v1',
        bridgeType: 'burnAndMint',
      },
    ],
    type: 'multichain',
  },
}
