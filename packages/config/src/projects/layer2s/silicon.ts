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

const discovery = new ProjectDiscovery('silicon')

const shared = new ProjectDiscovery('shared-polygon-cdk')
const bridge = shared.getContract('Bridge')

const membersCountDAC = discovery.getContractValue<number>(
  'SiliconDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'SiliconDAC',
  'requiredAmountOfSignatures',
)

const isForcedBatchDisallowed =
  discovery.getContractValue<string>('SiliconValidium', 'forceBatchAddress') !==
  '0x0000000000000000000000000000000000000000'

const upgradeability = {
  upgradableBy: ['SiliconDAC Upgrader'],
  upgradeDelay: 'None',
}

export const silicon: Layer2 = polygonCDKStack({
  addedAt: new UnixTime(1725027256), // 2024-08-30T14:14:16Z
  additionalBadges: [Badge.DA.DAC],
  discovery,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  display: {
    name: 'Silicon',
    slug: 'silicon',
    description:
      'Silicon is a Validium built on the Polygon CDK Stack, aiming to become the social network of the future.',
    links: {
      websites: ['https://silicon.network/'],
      apps: ['https://bridge.silicon.network/'],
      documentation: ['https://docs.silicon.network/'],
      explorers: ['https://scope.silicon.network'],
      socialMedia: ['https://x.com/0xSilicon'],
    },
  },
  rpcUrl: 'https://rpc.silicon.network',
  rollupModuleContract: discovery.getContract('SiliconValidium'),
  rollupVerifierContract: discovery.getContract('Verifier'),
  isForcedBatchDisallowed,
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
    name: 'silicon',
    chainId: 2355,
    explorerUrl: 'https://scope.silicon.network/',
    minTimestampForTvl: new UnixTime(1724183531),
  },
  nonTemplateTechnology: {
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_BOTH,
    },
  },
  nonTemplateEscrows: [
    // shared
    shared.getEscrowDetails({
      address: bridge.address,
      tokens: '*',
      sharedEscrow: {
        type: 'AggLayer',
        nativeAsset: 'etherPreminted',
        premintedAmount: '340282366920938463463374607431768211455',
      },
    }),
  ],
  stateDerivation: {
    nodeSoftware:
      'Node software can be found [here](https://github.com/0xPolygon/cdk-validium-node).',
    compressionScheme: 'No compression scheme yet.',
    genesisState:
      'The genesis state, whose corresponding root is accessible as Batch 0 root in the `getRollupBatchNumToStateRoot(5,0)` method of PolygonRollupManager, is available [here](https://github.com/0xPolygonHermez/zkevm-contracts/blob/1ad7089d04910c319a257ff4f3674ffd6fc6e64e/tools/addRollupType/genesis.json).',
    dataFormat:
      'The trusted sequencer request signatures from DAC members off-chain, and posts hashed batches with signatures to the SiliconValidium contract.',
  },
  nonTemplatePermissions: {
    [discovery.chain]: {
      actors: [
        {
          name: 'LocalAdmin',
          accounts: [
            discovery.formatPermissionedAccount(
              discovery.getContractValue('SiliconValidium', 'admin'),
            ),
          ],
          description:
            'Admin and ForceBatcher of the SiliconValidium contract, can set core system parameters like timeouts, sequencer, activate forced transactions, and set the DA committee members in the SiliconDAC contract.',
        },
        {
          name: 'SiliconDAC Upgrader',
          accounts: [
            discovery.formatPermissionedAccount(
              discovery.getContractValue('DACProxyAdmin', 'owner'),
            ),
          ],
          description:
            'Can upgrade the SiliconDAC contract and thus change the data availability rules any time.',
        },
      ],
    },
  },
  nonTemplateContracts: [
    discovery.getContractDetails('SiliconDAC', {
      description:
        'Validium committee contract that allows the owner to setup the members of the committee and stores the required amount of signatures threshold.',
      ...upgradeability,
    }),
  ],
  milestones: [
    {
      title: 'Silicon Mainnet Launch',
      url: 'https://x.com/0xSilicon/status/1828704079687917908',
      date: '2024-08-28',
      description:
        'Silicon Mainnet launches officially, integrated with Polygon AggLayer.',
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
