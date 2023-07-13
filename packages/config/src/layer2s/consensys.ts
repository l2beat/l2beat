import { ProjectId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW, RISK_VIEW } from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('linea')

export const linea: Layer2 = {
  type: 'layer2',
  id: ProjectId('linea'),
  display: {
    name: 'Linea',
    slug: 'linea',
    description:
      'Linea is a zkRollup powered by Consensys zkEVM, designed to scale the Ethereum network. At present, it is undergoing further testing and optimization on the Goerli testnet before deployment.',
    purpose: 'Universal',
    category: 'ZK Rollup',
    links: {
      websites: ['https://linea.build/'],
      apps: ['https://goerli.linea.build/'],
      documentation: ['https://docs.linea.build/'],
      explorers: ['https://explorer.goerli.linea.build/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/LineaBuild',
        'https://discord.gg/consensys',
        'https://linea.mirror.xyz/',
      ],
    },
  },
  config: {
    escrows: [],
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      sources: [
        {
          contract: 'zkEVM',
          references: [
            'https://etherscan.io/address/0xE8f627df6Cb02e415b2e6d6e112323BD269b4706#code#F1#L116',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      description:
        RISK_VIEW.DATA_ON_CHAIN.description +
        ' Unlike most zk rollups transactions are posted instead of state diffs.',
      sources: [
        {
          contract: 'zkEVM',
          references: [
            'https://etherscan.io/address/0xE8f627df6Cb02e415b2e6d6e112323BD269b4706#code#F1#L221',
          ],
        },
      ],
    },
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: TECHNOLOGY.UPCOMING,
  contracts: CONTRACTS.EMPTY,
  milestones: [
    {
      name: 'Open Testnet is Live',
      date: '2023-03-28',
      description:
        'Linea has launched on the Goerli testnet, allowing users and developers to test the platform.',
      link: 'https://linea.mirror.xyz/6G30hwV2wPs_wPv0VEgHYaIdghMkIQaad-OI_0br1hM',
    },
  ],
}
