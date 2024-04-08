import { ProjectId } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('xai', 'arbitrum')

export const xai: Layer3 = orbitStackL3({
  discovery,
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Xai',
    slug: 'xai',
    description:
      'Xai is an Ethereum Layer-3 that leverages Arbitrum AnyTrust to enable open trade in the next generation of video games.',
    purposes: ['Gaming'],
    links: {
      websites: ['https://xai.games/'],
      apps: [],
      documentation: ['https://xai-foundation.gitbook.io/xai-network/'],
      explorers: ['https://explorer.xai-chain.net/'],
      repositories: ['https://github.com/OffchainLabs/nitro'],
      socialMedia: [
        'https://twitter.com/xai_games',
        'https://t.me/XaiSentryNodes',
        'https://discord.gg/xaigames',
      ],
    },
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  associatedTokens: ['XAI'],
  nativeToken: 'XAI',
  rpcUrl: 'https://xai-chain.net/rpc',
  nonTemplateTechnology: {
    stateCorrectness: {
      name: 'Fraud proofs ensure state correctness',
      description: `After some period of time, the published state root is assumed to be correct. For a certain time period, one of the whitelisted actors can submit a fraud proof that shows that the state was incorrect. The challenge protocol can be subject to delay attacks. \
        After the state root is published, there is also a trusted entity, called Challenger, that signs it and submits the signature to a Referee smart contract. The signatures submitted to the referee are used then verified by sentry nodes. The role of sentry nodes is to verify (assert) the submitted state root after it has been submitted. There is no integrated way to flag an invalid state root, sentry nodes will have to raise the alarm by external means, making them just observation nodes.`,
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'none of the whitelisted verifiers checks the published state. Fraud proofs assume at least one honest and able validator.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'How is fraud proven - Arbitrum documentation FAQ',
          href: 'https://developer.offchainlabs.com/intro/#q-and-how-exactly-is-fraud-proven-sounds-complicated',
        },
        {
          text: 'Arbitrum Glossary: Challenge Period',
          href: 'https://developer.arbitrum.io/intro/glossary#challenge-period',
        },
        {
          text: 'RollupUser.sol - Etherscan source code, onlyValidator modifier',
          href: `https://etherscan.io/address/0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A#code`,
        },
        {
          text: 'Referee.sol - Etherscan source code, submitChallenge function',
          href: 'https://arbiscan.io/address/0x254954e3f6bd7443444036bea2d8fe88fdf496c1#code#F53#L337',
        },
        {
          text: 'Referee.sol - Etherscan source code, submitAssertionToChallenge function',
          href: 'https://arbiscan.io/address/0x254954e3f6bd7443444036bea2d8fe88fdf496c1#code#F53#L428',
        },
        {
          text: 'Solutions to Delay Attacks on Rollups',
          href: 'https://medium.com/offchainlabs/solutions-to-delay-attacks-on-rollups-434f9d05a07a',
        },
      ],
    },
  },
  nonTemplatePermissions: [
    {
      name: 'RollupOwner',
      accounts: discovery.getAccessControlRolePermission(
        'UpgradeExecutor',
        'EXECUTOR_ROLE',
      ),
      description:
        'Multisig that can execute upgrades via the UpgradeExecutor.',
    },
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('L1GatewayRouter', {
      description: 'Router managing token <--> gateway mapping.',
    }),
    discovery.getContractDetails('SentryReferee', {
      description:
        'The referree contract allows to create new challenges (state root reports) from the permissioned challenger, collects assertions from sentry nodes, and distributes esXAI rewards for operating a sentry node. \
        The referee contract is also a whitelisted address in the esXAI token contract, which allows it to initiate arbitrary esXAI token transfers.',
    }),
    discovery.getContractDetails('NodeLicenseRegistry', {
      description:
        'This is the contract where Xai Sentry Keys to run a node are minted.',
    }),
  ],
  milestones: [
    {
      name: 'XAI Mainnet Launch',
      link: 'https://x.com/XAI_GAMES/status/1744815749410242568',
      date: '2024-01-09T00:00:00Z',
      description: 'XAI launches on Arbitrum One.',
    },
  ],
})
