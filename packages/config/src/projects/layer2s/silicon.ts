import { UnixTime } from '@l2beat/shared-pure'
import { NEW_CRYPTOGRAPHY, RISK_VIEW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { polygonCDKStack } from './templates/polygonCDKStack'
import { Layer2 } from './types'

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
  badges: [Badge.DA.DAC],
  discovery,
  display: {
    name: 'Silicon',
    slug: 'silicon',
    description:
      'Silicon is a Validium built on the Polygon CDK Stack, aiming to become the social network of the future.',
    purposes: ['Universal'],
    links: {
      websites: ['https://silicon.network/'],
      apps: ['https://bridge.silicon.network/'],
      documentation: ['https://docs.silicon.network/'],
      explorers: ['https://scope.silicon.network'],
      repositories: [],
      socialMedia: ['https://x.com/0xSilicon'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.silicon.network',
  rollupModuleContract: discovery.getContract('SiliconValidium'),
  rollupVerifierContract: discovery.getContract('Verifier'),
  isForcedBatchDisallowed,
  daProvider: {
    name: 'DAC',
    bridge: {
      type: 'DAC Members',
      requiredSignatures: requiredSignaturesDAC,
      membersCount: membersCountDAC,
    },
    riskView: {
      ...RISK_VIEW.DATA_EXTERNAL_DAC({
        membersCount: membersCountDAC,
        requiredSignatures: requiredSignaturesDAC,
      }),
      sources: [
        {
          contract: 'PolygonDataCommittee.sol',
          references: [
            'https://etherscan.io/address/0xAce9269EaC3419937093154dea0AD44C36Df6963#code',
          ],
        },
      ],
    },
    technology: {
      name: 'Data is not stored on chain',
      description:
        'The transaction data is not recorded on the Ethereum main chain. Transaction data is stored off-chain and only the hashes are posted on-chain by the Sequencer, after being signed by the DAC members.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the external data becomes unavailable.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'PolygonValidiumStorageMigration.sol - Etherscan source code, sequenceBatchesValidium function',
          href: 'https://etherscan.io/address/0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C#code#F1#L126',
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
  nonTemplatePermissions: [
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
  nonTemplateContracts: [
    discovery.getContractDetails('SiliconDAC', {
      description:
        'Validium committee contract that allows the owner to setup the members of the committee and stores the required amount of signatures threshold.',
      ...upgradeability,
    }),
  ],
  milestones: [
    {
      name: 'Silicon Mainnet Launch',
      link: 'https://x.com/0xSilicon/status/1828704079687917908',
      date: '2024-08-28',
      description:
        'Silicon Mainnet launches officially, integrated with Polygon AggLayer.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [],
})
