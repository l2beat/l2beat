import { NEW_CRYPTOGRAPHY, RISK_VIEW } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { polygonCDKStack } from './templates/polygonCDKStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('xlayer')

const membersCountDAC = discovery.getContractValue<number>(
  'XLayerValidiumDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'XLayerValidiumDAC',
  'requiredAmountOfSignatures',
)

const isForcedBatchDisallowed =
  discovery.getContractValue<string>(
    'XLayerValidiumEtrog',
    'forceBatchAddress',
  ) !== '0x0000000000000000000000000000000000000000'

const upgradeability = {
  upgradableBy: ['ProxyAdminOwner'],
  upgradeDelay: 'No delay',
}

export const xlayer: Layer2 = polygonCDKStack({
  discovery,
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
          contract: 'XLayerValidiumEtrog',
          references: [
            'https://etherscan.io/address/0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507',
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
          text: 'XLayerValidiumEtrog.sol - Etherscan source code, sequenceBatches function',
          href: 'https://etherscan.io/address/0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507',
        },
      ],
    },
  },
  display: {
    name: 'X Layer',
    slug: 'xlayer',
    description:
      'X Layer is Validium by OKX with seamless integration with OKX products. It is powered by the Polygon CDK.',
    headerWarning:
      'X Layer is using AggLayer, meaning it shares the TVL escrow contracts with Polygon zkEVM and other connected chains.',
    purposes: ['Universal'],
    links: {
      websites: ['https://okx.com/x1'],
      apps: [],
      documentation: ['https://okx.com/xlayer/docs'],
      explorers: ['https://okx.com/explorer/xlayer'],
      repositories: [],
      socialMedia: ['https://twitter.com/XLayerOfficial'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  nonTemplateEscrows: [],
  milestones: [
    {
      name: 'X Layer Public Launch',
      link: 'https://x.com/XLayerOfficial/status/1780056275898048562',
      date: '2024-04-16',
      description: 'X Layer is now accessible to everyone.',
    },
  ],
  knowledgeNuggets: [],
  rollupManagerContract: discovery.getContract('PolygonRollupManager'),
  rollupModuleContract: discovery.getContract('XLayerValidiumEtrog'),
  rollupVerifierContract: discovery.getContract('XLayerVerifier'),
  rpcUrl: 'https://rpc.xlayer.tech',
  isForcedBatchDisallowed,
  nonTemplateTechnology: {
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_BOTH,
    },
  },
  nonTemplateContracts: [
    discovery.getContractDetails('XLayerValidiumDAC', {
      description:
        'Validium committee contract that allows the admin to setup the members of the committee and stores the required amount of signatures threshold.',
      ...upgradeability,
    }),
  ],
})
