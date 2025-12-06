import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { agglayer } from '../../templates/agglayer'

const discovery = new ProjectDiscovery('gpt')

export const gpt: ScalingProject = agglayer({
  addedAt: UnixTime(1720180654), // 2024-07-05T11:57:34Z
  archivedAt: UnixTime(1737676800), // 2025-01-24T00:00:00.000Z,
  additionalBadges: [BADGES.DA.DAC, BADGES.RaaS.Gateway],
  additionalPurposes: ['AI'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  display: {
    name: 'GPT Protocol',
    slug: 'gpt',
    headerWarning:
      'The operator has stopped servicing this Validium and a fork was [deployed outside the shared Polygon Agglayer contracts](https://app.blocksec.com/explorer/tx/eth/0x6e3d75c42350019dce5484cc45e9db89b2a29bf8ff8c000ddfa2aa5a9df08628).',
    description:
      'GPT Protocol is a Validium built on the Polygon CDK stack. The purpose of the project is to create a decentralized market of AI compute power.',
    links: {
      websites: ['https://gptprotocol.org/'],
      bridges: [
        'https://bridge.gptprotocol.io/',
        'https://assistant.gptprotocol.io/',
        'https://staking.gptprotocol.org/',
      ],
      explorers: ['https://explorer.gptprotocol.io/'],
      repositories: ['https://github.com/gptprotocol'],
      socialMedia: [
        'https://x.com/gpt_protocol',
        'https://t.me/gpt_protocol',
        'https://discord.com/invite/gptprotocol',
        'https://instagram.com/gptprotocol/',
      ],
    },
  },
  associatedTokens: ['GPT'],
  discovery,
  chainConfig: {
    chainId: 1511670449,
    sinceTimestamp: UnixTime(1716807971),
    name: 'gpt',
    apis: [
      {
        type: 'rpc',
        // tested at over 10k requests per minute with no ratelimit (we default to 1500/min)
        url: 'https://rpc.gptprotocol.io',
        callsPerMinute: 300,
      },
    ],
  },
  nonTemplateEscrows: [], // removed as their rpc is broken and last tvs was USD 81
  stateDerivation: {
    nodeSoftware:
      'Node software can be found [here](https://github.com/0xPolygon/cdk-validium-node).',
    compressionScheme: 'No compression scheme yet.',
    genesisState:
      'The genesis state, whose corresponding root is accessible as Batch 0 root in the `getRollupBatchNumToStateRoot(5,0)` method of AgglayerManager, is available [here](https://github.com/0xPolygonHermez/zkevm-contracts/blob/1ad7089d04910c319a257ff4f3674ffd6fc6e64e/tools/addRollupType/genesis.json).',
    dataFormat:
      'The trusted sequencer request signatures from DAC members off-chain, and posts hashed batches with signatures to the GptProtocolValidium contract.',
  },
  milestones: [
    {
      title: 'GPT Protocol Launch',
      url: 'https://x.com/gpt_protocol/status/1827155009123090891',
      date: '2024-08-24',
      description:
        'GPT Protocol launches officially, integrated with Polygon Agglayer.',
      type: 'general',
    },
  ],
})
