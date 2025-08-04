import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { getStage } from '../../processing/utils/getStage'

const discovery = new ProjectDiscovery('hibachi')

export const hibachi = {
  type: 'layer3',
  id: ProjectId('hibachi'),
  addedAt: UnixTime(1750346284), // Thursday, June 19, 2025 3:18:00 PM
  badges: [BADGES.VM.AppChain, BADGES.DA.Celestia],
  REASON_FOR_BEING_OTHER: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  display: {
    name: 'Hibachi',
    slug: 'hibachi',
    description:
      'Hibachi is a high-performance off-chain CLOB using encrypted data.',
    purposes: ['Exchange'],
    category: 'Other',
    links: {
      websites: ['https://hibachi.xyz/trade'],
      documentation: ['https://docs.hibachi.xyz/'],
      socialMedia: ['https://x.com/hibachi_xyz'],
    },
  },
  stage: getStage({
    stage: 'NotApplicable',
  }),
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'arb1:0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400',
        ),
        tokens: ['USDT0'],
      }),
    ],
  },
}
