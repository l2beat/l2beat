import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectPermissionedAccount } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { formatSeconds } from '../utils/formatSeconds'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  FRONTRUNNING_RISK,
  makeBridgeCompatible,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('linea')

const timelockDelay = discovery.getContractValue<number>(
  'Timelock',
  'getMinDelay',
)
const timelockDelayString = formatSeconds(timelockDelay)

const upgrades = {
  upgradableBy: ['AdminMultisig'],
  upgradableDelay: timelockDelay === 0 ? 'No delay' : timelockDelayString,
}

const roles = discovery.getContractValue<{
  OPERATOR_ROLE: { members: string[] }
  PAUSE_MANAGER_ROLE: { members: string[] }
}>('zkEVM', 'accessControl')

const operators: ProjectPermissionedAccount[] = roles.OPERATOR_ROLE.members.map(
  (address) => ({
    address: EthereumAddress(address),
    type: 'EOA',
  }),
)

const pausers: string[] = roles.PAUSE_MANAGER_ROLE.members
const isPaused: boolean =
  discovery.getContractValue<boolean>('zkEVM', 'generalPause') ||
  discovery.getContractValue<boolean>('zkEVM', 'l1l2Pause') ||
  discovery.getContractValue<boolean>('zkEVM', 'l2l1Pause')

export const linea: Layer2 = {
  type: 'layer2',
  id: ProjectId('linea'),
  display: {
    name: 'Linea',
    slug: 'linea',
    headerWarning: 'The circuit of the program being proven is not public.',
    description:
      'Linea is a zkRollup powered by Consensys zkEVM, designed to scale the Ethereum network.',
    purpose: 'Universal',
    category: 'ZK Rollup',
    links: {
      websites: ['https://linea.build/'],
      apps: [],
      documentation: ['https://docs.linea.build/'],
      explorers: ['https://explorer.linea.build/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/LineaBuild',
        'https://discord.gg/consensys',
        'https://linea.mirror.xyz/',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xd19d4B5d358258f05D7B411E21A1460D11B0876F'),
        sinceTimestamp: new UnixTime(1689159923),
        tokens: ['ETH'],
      }),
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      sources: [
        {
          contract: 'zkEVM',
          references: [
            'https://etherscan.io/address/0x4c8d4Ce72afAA417d1F7E833725FdB4E793cd6b3#code#F1#L116',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      description:
        RISK_VIEW.DATA_ON_CHAIN.description +
        ' Unlike most zk rollups, transaction data is posted instead of state diffs.',
      sources: [
        {
          contract: 'zkEVM',
          references: [
            'https://etherscan.io/address/0x4c8d4Ce72afAA417d1F7E833725FdB4E793cd6b3#code#F1#L221',
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
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeOpenSource: true,
    },
    stage1: {
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: null,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: false,
      securityCouncilProperlySetUp: [
        false,
        'Security Council members are not publicly known.',
      ],
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: false,
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'ZkEvmV2.sol#L275 - Etherscan source code, _verifyProof() function',
          href: 'https://etherscan.io/address/0x4c8d4Ce72afAA417d1F7E833725FdB4E793cd6b3#code#F1#L275',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'ZkEvmV2.sol#L221 - Etherscan source code, _processBlockTransactions() function',
          href: 'https://etherscan.io/address/0x4c8d4Ce72afAA417d1F7E833725FdB4E793cd6b3#code#F1#L221',
        },
      ],
    },
    operator: {
      name: 'The system has a centralized sequencer',
      description:
        'Only a trusted sequencer is allowed to submit transaction batches. A mechanism for users to submit their own batches is currently disabled.',
      risks: [
        FRONTRUNNING_RISK,
        {
          category: 'Funds can be frozen if',
          text: 'the sequencer refuses to include an exit transaction.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'ZkEvmV2.sol#L125 - Etherscan source code, onlyRole(OPERATOR_ROLE) modifier',
          href: 'https://etherscan.io/address/0x4c8d4Ce72afAA417d1F7E833725FdB4E793cd6b3#code#F1#L125',
        },
      ],
    },
    forceTransactions: FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'no proof'),
        description:
          EXITS.REGULAR('zk', 'no proof').description +
          ' Note that withdrawal requests can be censored by the Sequencer.',
        risks: [EXITS.OPERATOR_CENSORS_WITHDRAWAL],
        references: [
          {
            text: 'L1MessageService.sol#L115 - Etherscan source code, claimMessage() function',
            href: 'https://etherscan.io/address/0x4c8d4Ce72afAA417d1F7E833725FdB4E793cd6b3#code#F20#L115',
          },
        ],
      },
    ],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'AdminMultisig',
      'Admin of the Linea rollup. It can upgrade the contracts, change the verifier address, and publish blocks by effectively overriding the proof system.',
    ),
    {
      accounts: operators,
      name: 'Operators',
      description:
        'The operators are allowed to prove blocks and post the corresponding transaction data.',
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('zkEVM', {
        description:
          'The main contract of the Linea zkEVM rollup. Contains state roots, the verifier addresses and manages messages between L1 and the L2.',
        ...upgrades,
        pausable: {
          pausableBy: pausers,
          paused: isPaused,
        },
        references: [
          {
            text: 'ZkEvmV2.sol#L275 - Etherscan source code, state injections: stateRoot and exitRoot are part of the validity proof input.',
            href: 'https://etherscan.io/address/0x4c8d4Ce72afAA417d1F7E833725FdB4E793cd6b3#code#F1#L275',
          },
        ],
      }),
      discovery.getContractDetails(
        'PlonkVerifierFull',
        'Plonk verifier contract used by the Linea zkEVM rollup.',
      ),
      discovery.getContractDetails(
        'PlonkVerifierFullLarge',
        'Plonk verifier contract used by the Linea zkEVM rollup.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(timelockDelayString)],
  },
  milestones: [
    {
      name: 'Open Testnet is Live',
      date: '2023-03-28',
      description:
        'Linea has launched on the Goerli testnet, allowing users and developers to test the platform.',
      link: 'https://linea.mirror.xyz/6G30hwV2wPs_wPv0VEgHYaIdghMkIQaad-OI_0br1hM',
    },
    {
      name: 'Mainnet Alpha Launch',
      date: '2023-07-12',
      description: 'Linea has launched on the Ethereum mainnet.',
      link: 'https://linea.mirror.xyz/7l9gKzYzKVOxEOnReavov467Ss_fsrkGzABvbRISPMY',
    },
  ],
}
