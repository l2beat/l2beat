import { UnixTime } from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  NEW_CRYPTOGRAPHY,
  RISK_VIEW,
} from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { PolygoncdkDAC } from '../da-beat/templates/polygoncdk-template'
import { polygonCDKStack } from './templates/polygonCDKStack'

const discovery = new ProjectDiscovery('gpt')

const membersCountDAC = discovery.getContractValue<number>(
  'PolygonDataCommittee',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'PolygonDataCommittee',
  'requiredAmountOfSignatures',
)

const isForcedBatchDisallowed =
  discovery.getContractValue<string>('Validium', 'forceBatchAddress') !==
  '0x0000000000000000000000000000000000000000'

export const gpt: Layer2 = polygonCDKStack({
  addedAt: new UnixTime(1720180654), // 2024-07-05T11:57:34Z
  additionalBadges: [Badge.DA.DAC, Badge.RaaS.Gateway],
  additionalPurposes: ['AI'],
  isArchived: true,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  display: {
    name: 'GPT Protocol',
    slug: 'gpt',
    headerWarning:
      'The operator has stopped servicing this Validium and a fork was [deployed outside the shared Polygon AggLayer contracts](https://app.blocksec.com/explorer/tx/eth/0x6e3d75c42350019dce5484cc45e9db89b2a29bf8ff8c000ddfa2aa5a9df08628).',
    description:
      'GPT Protocol is a Validium built on the Polygon CDK stack. The purpose of the project is to create a decentralized market of AI compute power.',
    links: {
      websites: ['https://gptprotocol.org/'],
      apps: [
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
  rpcUrl: 'https://rpc.gptprotocol.io', // tested at over 10k requests per minute with no ratelimit (we default to 1500/min)
  discovery,
  daProvider: {
    layer: DA_LAYERS.DAC,
    bridge: DA_BRIDGES.DAC_MEMBERS({
      requiredSignatures: requiredSignaturesDAC,
      membersCount: membersCountDAC,
    }),
    riskView: RISK_VIEW.DATA_EXTERNAL_DAC({
      membersCount: membersCountDAC,
      requiredSignatures: requiredSignaturesDAC,
    }),
    technology: {
      name: 'Data is not stored on chain',
      description:
        'The transaction data is not recorded on the Ethereum main chain. Transaction data is stored off-chain and only the hashes are posted onchain by the Sequencer, after being signed by the DAC members.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the external data becomes unavailable.',
          isCritical: true,
        },
      ],
      references: [
        {
          title:
            'PolygonValidiumStorageMigration.sol - Etherscan source code, sequenceBatchesValidium function',
          url: 'https://etherscan.io/address/0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C#code#F1#L126',
        },
      ],
    },
  },
  chainConfig: {
    chainId: 1511670449,
    minTimestampForTvl: new UnixTime(1716807971),
    name: 'gpt',
  },
  rollupModuleContract: discovery.getContract('Validium'),
  rollupVerifierContract: discovery.getContract('FflonkVerifier'),
  isForcedBatchDisallowed,
  nonTemplateEscrows: [], // removed as their rpc is broken and last tvs was USD 81
  nonTemplateTechnology: {
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_BOTH,
    },
  },
  stateDerivation: {
    nodeSoftware:
      'Node software can be found [here](https://github.com/0xPolygon/cdk-validium-node).',
    compressionScheme: 'No compression scheme yet.',
    genesisState:
      'The genesis state, whose corresponding root is accessible as Batch 0 root in the `getRollupBatchNumToStateRoot(5,0)` method of PolygonRollupManager, is available [here](https://github.com/0xPolygonHermez/zkevm-contracts/blob/1ad7089d04910c319a257ff4f3674ffd6fc6e64e/tools/addRollupType/genesis.json).',
    dataFormat:
      'The trusted sequencer request signatures from DAC members off-chain, and posts hashed batches with signatures to the GptProtocolValidium contract.',
  },
  milestones: [
    {
      title: 'GPT Protocol Launch',
      url: 'https://x.com/gpt_protocol/status/1827155009123090891',
      date: '2024-08-24',
      description:
        'GPT Protocol launches officially, integrated with Polygon AggLayer.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [],
  customDa: PolygoncdkDAC({
    dac: {
      requiredMembers: requiredSignaturesDAC,
      membersCount: membersCountDAC,
    },
  }),
})
