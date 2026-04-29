import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const cctpv2: BaseProject = {
  id: ProjectId('cctpv2'),
  slug: 'cctpv2',
  name: 'CCTP v2',
  shortName: undefined,
  addedAt: UnixTime(1769070497),
  interopConfig: {
    description:
      'This is the cross-chain transfer protocol by Circle in its second version. Mainly used for USDC burn-mint transfers, it coexists with the v1 protocol but improves on its transfer speed.',
    plugins: [
      {
        plugin: 'cctp-v2',
        bridgeType: 'burnAndMint',
      },
    ],
    type: 'multichain',
  },
}
