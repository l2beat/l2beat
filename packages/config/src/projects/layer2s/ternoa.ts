import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
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

const discovery = new ProjectDiscovery('ternoa')

const shared = new ProjectDiscovery('shared-polygon-cdk')
const bridge = shared.getContract('Bridge')

const membersCountDAC = discovery.getContractValue<number>(
  'TernoaDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'TernoaDAC',
  'requiredAmountOfSignatures',
)

const isForcedBatchDisallowed =
  discovery.getContractValue<string>('TernoaValidium', 'forceBatchAddress') !==
  '0x0000000000000000000000000000000000000000'

const upgradeability = {
  upgradableBy: ['TernoaDAC Upgrader'],
  upgradeDelay: 'None',
}

export const ternoa: Layer2 = polygonCDKStack({
  addedAt: new UnixTime(1727455020), // 2024-09-27T17:09:00Z
  additionalBadges: [Badge.DA.DAC], // TODO: add Badge.RaaS.Zeeve
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  additionalPurposes: ['Payments'],
  display: {
    name: 'Ternoa',
    slug: 'ternoa',
    description:
      'Ternoa is a modular Validium leveraging the Polygon CDK stack. It is built by the team behind the Substrate-based Ternoa Layer 1 and focuses on PayFi.',
    links: {
      websites: ['https://ternoa.network/'],
      apps: ['https://portal.polygon.technology/bridge'],
      explorers: ['https://explorer-mainnet.zkevm.ternoa.network/'],
      documentation: ['https://docs.ternoa.network/learn/ternoa-zkevm+'],
      repositories: ['https://github.com/capsule-corp-ternoa'],
      socialMedia: [
        'https://x.com/ternoa_',
        'https://t.me/ternoa',
        'https://medium.com/ternoa',
        'https://discord.com/invite/cNZTGtGJNR',
        'https://linkedin.com/company/ternoa/mycompany/',
        'https://youtube.com/channel/UCUYvbtRE5HoWPz7z88V7Khw',
      ],
    },
  },
  rpcUrl: 'https://rpc-mainnet.zkevm.ternoa.network', // successfully tested at 5k/min
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
            'PolygonValidiumEtrog.sol - Etherscan source code, sequenceBatchesValidium function',
          url: 'https://etherscan.io/address//0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F#code#F1#L91',
        },
      ],
    },
  },
  rollupModuleContract: discovery.getContract('TernoaValidium'),
  rollupVerifierContract: discovery.getContract('Verifier'),
  isForcedBatchDisallowed,
  chainConfig: {
    name: 'ternoa',
    chainId: 752025,
    explorerUrl: 'https://explorer-mainnet.zkevm.ternoa.network/',
    minTimestampForTvl: new UnixTime(1735650935),
  },
  associatedTokens: ['CAPS'],
  nonTemplateEscrows: [
    shared.getEscrowDetails({
      address: bridge.address,
      tokens: '*',
      sharedEscrow: {
        type: 'AggLayer',
        nativeAsset: 'etherWrapped',
        wethAddress: EthereumAddress(
          '0x5A77f1443D16ee5761d310e38b62f77f726bC71c',
        ),
        tokensToAssignFromL1: ['CAPS'],
      },
    }),
  ],
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
      'The trusted sequencer request signatures from DAC members off-chain, and posts hashed batches with signatures to the WirexPayChainValidium contract.',
  },

  nonTemplatePermissions: [
    {
      name: 'LocalAdmin',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue('TernoaValidium', 'admin'),
        ),
      ],
      description:
        'Admin and ForceBatcher of the TernoaValidium contract, can set core system parameters like timeouts, sequencer, activate forced transactions, and set the DA committee members in the TernoaDAC contract.',
    },
    {
      name: 'TernoaDAC Upgrader',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue('DACProxyAdmin', 'owner'),
        ),
      ],
      description:
        'Can upgrade the TernoaDAC contract and thus change the data availability rules any time.',
    },
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('TernoaDAC', {
      description:
        'Validium committee contract that allows the owner to setup the members of the committee and stores the required amount of signatures threshold.',
      ...upgradeability,
    }),
  ],
  milestones: [
    {
      title: 'Ternoa Mainnet Launch',
      url: 'https://x.com/Ternoa_/status/1884519126812487828',
      date: '2025-01-29',
      description: 'Ternoa 2.0 mainnet is live.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [],
  dataAvailabilitySolution: PolygoncdkDAC({
    dac: {
      requiredMembers: requiredSignaturesDAC,
      membersCount: membersCountDAC,
    },
  }),
})
