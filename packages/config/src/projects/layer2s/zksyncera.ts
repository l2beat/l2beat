import { UnixTime, formatSeconds } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { Layer2 } from './types'
import { Upgradeability, zkStackL2 } from './templates/zkStack'

const discovery = new ProjectDiscovery('zksync2')
const discovery_ZKstackGovL2 = new ProjectDiscovery(
  'shared-zk-stack',
  'zksync2',
)

const executionDelayOldS = discovery.getContractValue<number>(
  'ValidatorTimelockOld',
  'executionDelay',
)
const executionDelayOld =
  executionDelayOldS > 0 && formatSeconds(executionDelayOldS)

const validatorsOld = () => {
  // old validatorTL accepted validators in constructor
  const constructorArgsValis = discovery.getContractValue<{
    _validators: string[]
  }>('ValidatorTimelockOld', 'constructorArgs')

  const validatorsAdded = discovery
    .getContractValue<string[]>('ValidatorTimelockOld', 'validatorsAdded')
    .concat(constructorArgsValis._validators)

  const validatorsRemoved = discovery.getContractValue<string[]>(
    'ValidatorTimelockOld',
    'validatorsRemoved',
  )

  // Create a map to track the net state of each validator (added or removed)
  const validatorStates = new Map<string, number>()

  // Increment for added validators
  validatorsAdded.forEach((validator) => {
    validatorStates.set(validator, (validatorStates.get(validator) || 0) + 1)
  })

  // Decrement for removed validators
  validatorsRemoved.forEach((validator) => {
    validatorStates.set(validator, (validatorStates.get(validator) || 0) - 1)
  })

  // Filter validators that have a net positive state (added more times than removed)
  return Array.from(validatorStates.entries())
    .filter(([_, state]) => state > 0)
    .map(([validator, _]) => validator)
}

export const zksyncera: Layer2 = zkStackL2({
  discovery,
  discovery_ZKstackGovL2,
  validatorsEvents: {
    added: `zksyncValidatorsAdded`,
    removed: 'zksyncValidatorsRemoved',
  },
  badges: [
    Badge.VM.EVM,
    Badge.DA.EthereumBlobs,
    Badge.Stack.ZKStack,
    Badge.Other.L3HostChain,
    Badge.Infra.ElasticChain,
  ],
  display: {
    name: 'ZKsync Era',
    slug: 'zksync-era',
    description:
      'ZKsync Era is a general-purpose ZK Rollup with full EVM compatibility.',
    purposes: ['Universal'],
    links: {
      websites: ['https://zksync.io/', 'https://zksync.dappradar.com/'],
      apps: ['https://portal.zksync.io/bridge/'],
      documentation: ['https://docs.zksync.io/'],
      explorers: [
        'https://explorer.zksync.io/',
        'https://era.zksync.network/',
        'https://zksync-era.l2scan.co/',
        'https://zksync.blockscout.com/',
        'https://hyperscan.xyz/',
      ],
      repositories: ['https://github.com/matter-labs/zksync-era'],
      socialMedia: [
        'https://zksync.mirror.xyz/',
        'https://join.zksync.dev/',
        'https://t.me/zksync',
        'https://twitter.com/zksync',
        'https://twitter.com/zkSyncDevs',
      ],
      rollupCodes: 'https://rollup.codes/zksync-era',
    },
    activityDataSource: 'Blockchain RPC',
  },
  chainConfig: {
    name: 'zksync2',
    chainId: 324,
    explorerUrl: 'https://era.zksync.network/',
    explorerApi: {
      url: 'https://api-era.zksync.network/api',
      type: 'etherscan',
    },
    minTimestampForTvl: new UnixTime(1676384520),
    coingeckoPlatform: 'zksync',
  },
  nonTemplatePermissions: [
    {
      name: 'ValidatorTimelockOld Validators',
      accounts: validatorsOld().map((v) =>
        discovery.formatPermissionedAccount(v),
      ),
      description:
        'Actors that are allowed to propose, execute and revert L2 batches on L1 through the currently unused ValidatorTimelockOld.',
    },
  ],
  nonTemplateContracts: (zkStackUpgrades: Upgradeability) => [
    discovery.getContractDetails('ZKsync', {
      description:
        'The main Rollup contract. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract \
          then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.',
      ...zkStackUpgrades,
    }),
    discovery.getContractDetails('ChainAdmin', {
      description:
        'Intermediary governance contract proxies the *Elastic Chain Operator* role for the shared contracts and the *ChainAdmin* role for ZKsync Era.',
    }),
    discovery.getContractDetails(
      'ValidatorTimelockOld',
      `Intermediary contract between the *Validators* and the ZKsync Era diamond that delays block execution (ie withdrawals and other L2 --> L1 messages) by ${executionDelayOld}.`,
    ),
  ],
  milestones: [
    {
      name: 'Onchain Governance Launch',
      link: 'https://blog.zknation.io/zksync-governance-system/',
      date: '2024-09-12T00:00:00Z',
      description:
        'An onchain Governance system is introduced, including a Security Council and Guardians.',
      type: 'general',
    },
    {
      name: 'ZKsync Protocol Upgrade v24',
      link: 'https://github.com/ZKsync-Community-Hub/zksync-developers/discussions/519',
      date: '2024-06-06T00:00:00Z',
      description:
        'A protocol upgrade that introduces a shared bridge and the foundation for other ZK stack chains.',
      type: 'general',
    },
    {
      name: 'ZKsync Era starts using blobs',
      link: 'https://twitter.com/zksync/status/1767983026443579448',
      date: '2024-03-13T00:00:00Z',
      description: 'ZKsync Era starts publishing data to blobs.',
      type: 'general',
    },
    {
      name: 'Introduction of Boojum prover',
      link: 'https://zksync.mirror.xyz/HJ2Pj45EJkRdt5Pau-ZXwkV2ctPx8qFL19STM5jdYhc',
      date: '2023-07-17T00:00:00Z',
      description: 'Deployment of Boojum - new high-performance proof system.',
      type: 'general',
    },
    {
      name: 'ZKsync 2.0 baby alpha launch',
      link: 'https://blog.matter-labs.io/baby-alpha-has-arrived-5b10798bc623',
      date: '2022-10-28T00:00:00Z',
      description: 'ZKsync 2.0 baby alpha is launched on mainnet.',
      type: 'general',
    },
    {
      name: 'Fair Onboarding Alpha and Rebranding',
      link: 'https://blog.matter-labs.io/all-aboard-zksync-era-mainnet-8b8964ba7c59',
      date: '2023-02-16T00:00:00Z',
      description:
        'ZKsync 2.0 rebrands to ZKsync Era and lets registered projects and developers deploy on mainnet.',
      type: 'general',
    },
    {
      name: 'Full Launch Alpha',
      link: 'https://blog.matter-labs.io/gm-zkevm-171b12a26b36',
      date: '2023-03-24T00:00:00Z',
      description: 'ZKsync Era is now permissionless and open for everyone.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [],
})
