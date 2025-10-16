import { UnixTime } from '@l2beat/shared-pure'

import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('lambda')

export const lambda: ScalingProject = opStackL2({
  addedAt: UnixTime(1718703383), // 2024-06-18T09:36:23Z
  archivedAt: UnixTime(1739145600), // 2025-02-10T00:00:00.000Z,
  discovery,
  additionalPurposes: ['Storage'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Lambda Chain',
    slug: 'lambda',
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    description:
      'Lambda Chain is an OP Stack Rollup on Ethereum, focusing on long-term data storage and -availability.',
    links: {
      websites: ['https://lambda.im/'],
      bridges: ['https://portal.lambda.im/bridge/'],
      documentation: ['https://docs.lambda.im/', 'https://docs.optimism.io/'],
      explorers: ['https://scan.lambda.im/'],
      repositories: ['https://github.com/LambdaIM'],
      socialMedia: [
        'https://twitter.com/Lambdaim',
        'https://discord.gg/lambdastorage',
        'https://t.me/HelloLambda',
      ],
    },
  },
  associatedTokens: ['LAMB'],
  genesisTimestamp: UnixTime(1713345623),
  isNodeAvailable: true,
  milestones: [
    {
      title: 'Lambda Chain Mainnet Launch',
      url: 'https://lambdanetwork.medium.com/lambda-is-about-to-launch-a-permanent-storage-da-network-leveraging-das-technology-to-provide-data-cdc80c8f69d1',
      date: '2024-04-17T00:00:00.00Z',
      description: 'Lambda Chain is live on mainnet.',
      type: 'general',
    },
  ],
  chainConfig: {
    name: 'lambda',
    chainId: 56026,
    explorerUrl: 'https://scan.lambda.im',
    sinceTimestamp: UnixTime(1713345623),
    multicallContracts: [
      // fails the tests since the address is not the usual one
      // {
      //   address: EthereumAddress('0xCeA9c77D5c8FF7aa13D94E8ED6b763eD51A55487'),
      //   batchSize: 150,
      //   sinceBlock: 1423879,
      //   version: '3',
      // },
    ],
    apis: [
      { type: 'rpc', url: 'https://nrpc.lambda.im', callsPerMinute: 300 },
      { type: 'blockscout', url: 'https://scan.lambda.im/api' },
      { type: 'blockscoutV2', url: 'https://scan.lambda.im/api/v2' },
    ],
  },
})
