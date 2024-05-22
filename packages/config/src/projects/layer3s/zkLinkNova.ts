import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const zklinknova: Layer3 = underReviewL3({
  id: 'zklinknova',
  // TODO(Linea, zkSync Era): zkLink Nexus is a multi-chain zkRollup architecture. In addition to Linea, it currently supports zkSync Era and will support more Layer2s in the future.
  hostChain: 'Multiple',
  display: {
    name: 'zkLink Nova',
    slug: 'zklinknova',
    description:
      'zkLink Nova is a multi-chain rollup infrastructure based on zero-knowledge technology.',
    purposes: ['Universal'],
    category: 'Validium',
    provider: 'zkLink Nexus',
    links: {
      websites: ['https://zk.link'],
      apps: ['https://playground-nexus.zk.link'],
      documentation: ['https://docs.zk.link'],
      explorers: ['https://scan-nexus.zk.link'],
      repositories: ['https://github.com/zkLinkProtocol'],
      socialMedia: [
        'https://blog.zk.link',
        'https://twitter.com/zkLink_Official',
        'http://discord.gg/zklink',
        'https://t.me/zkLinkorg',
      ],
    },
  },
  escrows: [
    {
      chain: 'arbitrum',
      includeInTotal: false,
      ...discovery.getEscrowDetails({
        address: EthereumAddress('0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b'),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
      }),
    },
  ],
})