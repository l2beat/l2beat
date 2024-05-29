import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'
import { DATA_ON_CHAIN, TECHNOLOGY_DATA_AVAILABILITY } from '../../common'

export const taiko: Layer2 = {
  id: ProjectId('taiko'),
  display: {
    name: 'Taiko',
    slug: 'taiko',
    description:
      'Taiko is an Ethereum-equivalent ZK Rollup on the Ethereum network. Taiko combines based sequencing and a contestation mechanism with multi-proofs.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://taiko.xyz'],
      apps: ['https://bridge.hekla.taiko.xyz/'],
      documentation: ['https://docs.taiko.xyz/'],
      explorers: ['https://hekla.taikoscan.network/'],
      repositories: ['https://github.com/taikoxyz'],
      socialMedia: [
        'https://twitter.com/taikoxyz',
        'https://discord.gg/taikoxyz',
        'https://taiko.mirror.xyz',
      ],
      rollupCodes: 'https://rollup.codes/taiko',
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    escrows: [
      {
        // Shared ETH bridge
        address: EthereumAddress('0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC'),
        sinceTimestamp: new UnixTime(1714550603),
        tokens: ['ETH'],
      },
      {
        // Shared ERC20 vault
        address: EthereumAddress('0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab'),
        sinceTimestamp: new UnixTime(1714550603),
        tokens: '*',
      },
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://rpc.mainnet.taiko.xyz',
      defaultCallsPerMinute: 500,
      startBlock: 1,
    },
  },
  chainConfig: {
    name: 'taiko',
    chainId: 167000,
    explorerUrl: 'https://taikoscan.io',
    explorerApi: {
      url: 'https://taikoscan.io/api',
      type: 'etherscan',
    },
    minTimestampForTvl: new UnixTime(1716620627),
  },
  type: 'layer2',
  riskView: {
    validatedBy: {
      description: '',
      sentiment: 'UnderReview',
      value: '',
    },
    sourceUpgradeability: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    destinationToken: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    stateValidation: {
      description: 'Taiko uses a multi-tier proof system to validate the state. However, current tier proofs include either SGX (secure-enclave) execution verification, or approval by a minimum number of Guardians. State validation through the Zk-proof tier is not yet active. The system allows for an invalid state to be proven by either a compromised SGX instance or compromised Guardians. This can lead to a state being proven as valid when it is not.',
      sentiment: 'bad',
      value: 'No proof system',
    },
    dataAvailability: {
      ...DATA_ON_CHAIN,
    },
    exitWindow: {
      description: 'The system is designed to allow users to force transaction by proposing a block directly on L1. However, only one permissioned proposer is currently allowed to propose blocks.',
      sentiment: 'bad',
      value: 'None',
    },
    sequencerFailure: {
      description: 'The system uses a based rollup sequencing mechanism. However, currently there is only one permissioned proposer who can propose blocks. This is a single point of failure and can lead to the system being halted if the proposer fails to propose blocks on L1.',
      sentiment: 'bad',
      value: 'No mechanism', // based rollup sequencing
    },
    proposerFailure: {
      description: 'Only the whitelisted proposer can advance the state on L1, so in the event of failure the withdrawals are frozen.',
      sentiment: 'bad',
      value: 'No mechanism',
    },
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        stateVerificationOnL1: false,
        fraudProofSystemAtLeast5Outsiders: false,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: false,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: false,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/taikoxyz/simple-taiko-node',
    },
  ),
  technology: {
    dataAvailability: {
      name: '',
      description: '.',
      references: [],
      risks: [],
    },
    operator: {
      name: '',
      description: '.',
      references: [],
      risks: [],
    },
    forceTransactions: {
      name: '',
      description: '.',
      references: [],
      risks: [],
    },
    exitMechanisms: [],
  },
  contracts: {
    addresses: [],
    risks: [],
  },
}
