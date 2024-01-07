import { ChainId, ProjectId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { Layer3 } from './types'
import { VALUES } from '../discovery/values'
import { formatSeconds } from '../utils/formatSeconds'
import {CONTRACTS} from './common'


const discovery = new ProjectDiscovery('deri', ChainId.ARBITRUM)

const assumedBlockTime = 12 
const validatorAfkBlocks = discovery.getContractValue<number>(
  'RollupProxy',
  'VALIDATOR_AFK_BLOCKS',
)
const validatorAfkTime = validatorAfkBlocks * assumedBlockTime
const challengeWindow = discovery.getContractValue<number>(
  'RollupProxy',
  'confirmPeriodBlocks',
)
const challengeWindowSeconds = challengeWindow * assumedBlockTime
const totalDelay = challengeWindowSeconds //not sure that the equivalent timelock delay is, maybe it is an instamt upgrade rollup 
const upgradesExecutor = {
  upgradableBy: ['UpgradeExecutorAdmin'],
  upgradeDelay: `${formatSeconds(
    totalDelay,
  )}`,
  upgradeConsiderations:
    'An upgrade is first initiaited by putting it up for discussion in the community Discord. If there is soft-consensus, it is put to an vote in the community governance forum',
}

const upgradesProxyAdmin = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: `${formatSeconds(
    totalDelay,
  )}`,
  upgradeConsiderations:
  'An upgrade is first initiaited by putting it up for discussion in the community Discord. If there is soft-consensus, it is put to an vote in the community governance forum',
}

const maxTimeVariation = discovery.getContractValue<number[]>(
  '0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77',
  'maxTimeVariation',
)
const selfSequencingDelay = maxTimeVariation[2]

export const deri: Layer3 = {
  type: 'layer3',
  isUpcoming: false,
  isUnderReview: true,
  id: ProjectId('deri'),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Deri',
    slug: 'deri',
    description:
      'Deri is an Ethereum Layer-3 that leverages Arbitrum Nitro to enable efficient cross-chain futures, options, and derivatives.',
    purpose: 'DeFi',
    category: 'Optimistic Rollup',
    provider: 'Arbitrum Orbit',
    links: {
      websites: ['https://deri.io/'],
      apps: [],
      documentation: ['https://docs.deri.io/'],
      explorers: ['https://explorer-dchain.deri.io/'],
      repositories: ['https://github.com/OffchainLabs/nitro'],
      socialMedia: [
        'https://twitter.com/DeriProtocol',
        'https://t.me/DeriProtocol',
        'https://discord.com/invite/kb8ZbYgp8M',
      ],
    },
  },
  config: {
    escrows: [],
  },
  contracts: {
    addresses: [ 
      discovery.getContractDetails('RollupProxy', {
        description:
          'Main contract implementing the Deri Protocol. Manages other components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.',
        ...upgradesExecutor,
    }),
      discovery.getContractDetails('Bridge', {
        description:
          'Contract managing Inboxes and Outboxes. It escrows funds sent to the rollup.',
        ...upgradesProxyAdmin,
    }),
      discovery.getContractDetails('0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77', {
        description:
          'Main entry point for the Sequencer submitting transaction batches.',
        ...upgradesProxyAdmin,
    }),
      discovery.getContractDetails('0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad', {
        description:
          'Entry point for users depositing ETH on Arbitrum which is escrowed in a Bridge contract. It is also the entry point in sending sending L2--> L3 messages.',
        ...upgradesProxyAdmin,
    }),
    discovery.getContractFromValue('RollupProxy', 'outbox', {
      description:
        "Deri's Outbox system allows for arbitrary L3 to L2 contract calls; i.e., messages initiated from L3 which eventually resolve in execution on L2.",
      ...upgradesProxyAdmin,
    }),
    discovery.getContractDetails('UpgradeExecutor', {
      description:
        "This contract can upgrade the system's contracts.",
      ...upgradesExecutor,
    }),
    ],
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_RISK(
      Math.round(totalDelay / 86400).toString(), // delay in days
      ),
    ],
  }
}
