import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'

export const powerloom: ScalingProject = {
  id: ProjectId('powerloom'),
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
  addedAt: UnixTime(1741768931),
  display: {
    name: 'Katana',
    slug: 'katana',
    description: '',
    purposes: ['Universal'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://powerloom.io/'],
      apps: ['https://bridge-v2.powerloom.network/'],
      documentation: ['https://docs.powerloom.io/'],
      explorers: ['https://explorer.powerloom.network/'],
      repositories: ['https://github.com/powerLoom'],
      socialMedia: [
        'https://x.com/powerloom',
        'https://t.me/PowerLoomProtocol',
        'https://linkedin.com/company/powerloom/',
        'https://youtube.com/@powerloom',
        'https://discord.com/invite/powerloom',
      ],
    },
  },
  config: {
    associatedTokens: ['APEX'],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb'),
        sinceTimestamp: UnixTime(1660252039),
        tokens: ['USDC'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b'),
        tokens: ['USDT'],
      }),
    ],
    activityConfig: {
      type: 'day',
      sinceTimestamp: UnixTime(1660252039),
      resyncLastDays: 7,
    },
  },
  stage: { stage: 'UnderReview' },
}
