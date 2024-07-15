import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const gpt: Layer2 = underReviewL2({
  id: 'gpt',
  display: {
    name: 'GPT Protocol',
    slug: 'gpt',
    category: 'Validium',
    provider: 'Polygon',
    description:
      'GPT Protocol is a Validium built on the Polygon CDK stack. The purpose of the project is to create a decentralized market of AI compute power.',
    purposes: ['AI'],
    links: {
      websites: ['https://gptprotocol.org/'],
      apps: [
        'https://bridge.gptprotocol.io/',
        'https://assistant.gptprotocol.io/',
        'https://staking.gptprotocol.org/',
      ],
      documentation: [],
      explorers: ['https://explorer.gptprotocol.io/'],
      repositories: ['https://github.com/gptprotocol'],
      socialMedia: [
        'https://x.com/gpt_protocol',
        'https://t.me/gpt_protocol',
        'https://discord.com/invite/gptprotocol',
        'https://instagram.com/gptprotocol/',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  // rpcUrl: 'https://sequencer.gptprotocol.io/',
  transactionApi: {
    type: 'rpc',
    startBlock: 1,
    defaultUrl: 'https://sequencer.gptprotocol.io/',
    defaultCallsPerMinute: 1500,
  },
  escrows: [], // shared
})
