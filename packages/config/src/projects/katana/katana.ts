import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'

const discovery = new ProjectDiscovery('katana')

export const katana: ScalingProject = {
  id: ProjectId('katana'),
  isUpcoming: true,
  type: 'layer2',
  riskView: {
    stateValidation: {
      value: '',
    },
    dataAvailability: {
      value: '',
    },
    exitWindow: {
      value: '',
    },
    sequencerFailure: {
      value: '',
    },
    proposerFailure: {
      value: '',
    },
  },
  capability: 'universal',
  addedAt: UnixTime(1749119953),
  display: {
    name: 'Katana',
    slug: 'katana',
    description:
      'Katana is an upcoming app-specific Layer 2 specializing as a DEX. It is in predeposit mode, where users deposit funds to yearn contracts on ethereum of which the yield goes to the katana treasury.',
    purposes: ['Universal'],
    category: 'Validium',
    stack: 'OP Stack',
    links: {
      websites: ['https://katana.network/'],
      apps: ['https://app.katana.network/krates?p=deposit'],
      socialMedia: [
        'https://x.com/katana',
        'https://discord.com/invite/KatanaNetwork',
      ],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x7B5A0182E400b241b317e781a4e9dEdFc1429822'),
        tokens: ['USDC.pdkatana'],
        isUpcoming: true,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x48c03B6FfD0008460F8657Db1037C7e09dEedfcb'),
        tokens: ['USDT.pdkatana'],
        isUpcoming: true,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x92C82f5F771F6A44CfA09357DD0575B81BF5F728'),
        tokens: ['WBTC.pdkatana'],
        isUpcoming: true,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xcc6a16Be713f6a714f68b0E1f4914fD3db15fBeF'),
        tokens: ['WETH.pdkatana'],
        isUpcoming: true,
      }),
    ],
  },
  stage: { stage: 'UnderReview' },
}
