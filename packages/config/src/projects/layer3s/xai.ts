import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('xai', 'arbitrum')

// orbitStack template currently does not support upgradeability
const upgradeability = {
  upgradableBy: ['ProxyAdmin (through UpgradeExecutor)'],
  upgradeDelay: 'No delay',
}
const stakingUpgradeability = {
  upgradableBy: ['StakingProxyAdmin'],
  upgradeDelay: 'No delay',
}

assert(
  sameArrays(
    discovery.get$Admins('SentryReferee'),
    discovery.get$Admins('PoolFactory'),
    discovery.get$Admins('NodeLicenseRegistry'),
    [discovery.getContract('StakingProxyAdmin').address],
  ),
  'The upgradeability changed, please review it in the .ts descriptions.',
)

export const xai: Layer3 = orbitStackL3({
  createdAt: new UnixTime(1701958025), // 2023-12-07T14:07:05Z
  discovery,
  hostChain: ProjectId('arbitrum'),
  badges: [Badge.DA.DAC, Badge.L3ParentChain.Arbitrum],
  additionalPurposes: ['Gaming'],
  display: {
    name: 'Xai',
    slug: 'xai',
    description:
      'Xai is an Ethereum Layer-3 that leverages Arbitrum AnyTrust to enable open trade in the next generation of video games.',
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
    activityDataSource: 'Blockchain RPC',
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
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      includeInTotal: false,
      address: EthereumAddress('0xb591cE747CF19cF30e11d656EB94134F523A9e77'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'XaiMultisig',
      'Multisig that can execute upgrades via the UpgradeExecutor.',
    ),
    {
      name: 'Xai Deployer (StakingProxyAdmin owner)',
      accounts: [
        discovery.getPermissionedAccount('StakingProxyAdmin', 'owner'),
      ],
      description:
        'The Xai Deployer EOA can upgrade all staking v2 related contracts (NodeLicenseRegistry, PoolFactory, SentryReferee, StakingPool) instantly and potentially steal all funds.',
    },
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('L1GatewayRouter', {
      description: 'Router managing token <--> gateway mapping.',
      ...upgradeability,
    }),
    discovery.getContractDetails('SentryReferee', {
      description:
        'The referree contract allows to create new challenges (state root reports) from the permissioned challenger, collects assertions from sentry nodes, and distributes esXAI rewards for operating a sentry node. \
        The referee contract is also a whitelisted address in the esXAI token contract, which allows it to initiate arbitrary esXAI token transfers. Additional staking through this contract is disabled. Stakers can continue to get staking rewards here or withdraw their assets.',
      ...stakingUpgradeability,
    }),
    discovery.getContractDetails('PoolFactory', {
      description: (() => {
        const stakingEnabled = <boolean>(
          discovery.getContractValue('PoolFactory', 'stakingEnabled')
        )
        const description = `The PoolFactory allows creating and managing staking pools for V2 staking. Users can stake esXAI (and / or Sentry Keys) in pools. This contract's address is whitelisted in the esXAI token contract, which allows it to initiate arbitrary esXAI token transfers. V2 staking through this contract is currently ${
          stakingEnabled ? 'enabled' : 'disabled'
        }.`
        return description
      })(),
      ...stakingUpgradeability,
    }),
    discovery.getContractDetails('NodeLicenseRegistry', {
      description:
        'This is the contract where Xai Sentry Keys to run a node are minted.',
      ...stakingUpgradeability,
    }),
  ],
  milestones: [
    {
      name: 'XAI Mainnet Launch',
      link: 'https://x.com/XAI_GAMES/status/1744815749410242568',
      date: '2024-01-09T00:00:00Z',
      description: 'XAI launches on Arbitrum One.',
      type: 'general',
    },
  ],
})

function sameArrays<T>(...arrays: T[][]) {
  const first = new Set(arrays[0] ?? [])
  return arrays
    .map((x) => new Set(x))
    .every((set) => {
      if (set.size !== first.size) return false
      for (const x of set) {
        if (!first.has(x)) return false
      }
      for (const x of first) {
        if (!set.has(x)) return false
      }
      return true
    })
}
