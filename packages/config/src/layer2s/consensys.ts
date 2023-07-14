import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  CONTRACTS,
  STATE_CORRECTNESS,
  DATA_AVAILABILITY,
  FRONTRUNNING_RISK,
  EXITS,
  RISK_CENTRALIZED_VALIDATOR,
  FORCE_TRANSACTIONS,
  TECHNOLOGY,
  UPCOMING_RISK_VIEW,
  RISK_VIEW,
  makeBridgeCompatible,
} from './common'
import { Layer2 } from './types'
import { getStage } from './common/stages/getStage'

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
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xd19d4B5d358258f05D7B411E21A1460D11B0876F'),
        sinceTimestamp: new UnixTime(1689159923),
        tokens: ['ETH'],
      }),
    ],
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
          text: 'ZkEvmV2sol.sol#L275 - Etherscan source code, _verifyProof() function',
          href: 'https://etherscan.io/address/0xE8f627df6Cb02e415b2e6d6e112323BD269b4706#code#F1#L275',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'ZkEvmV2sol#L221 - Etherscan source code, _processBlockTransactions() function',
          href: 'https://etherscan.io/address/0xE8f627df6Cb02e415b2e6d6e112323BD269b4706#code#F1#L221',
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
          text: 'ZkEvmV2sol.sol#L125 - Etherscan source code, onlyRole(OPERATOR_ROLE) modifier',
          href: 'https://etherscan.io/address/0xE8f627df6Cb02e415b2e6d6e112323BD269b4706#code#F1#L125',
        },
      ],
    },
    forceTransactions: FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
    exitMechanism: {
      ...REGULAR('zk', 'no proof'),
      description:
        REGULAR('zk', 'no proof').description +
        ' Note that the withdrawal request can be censored by the Sequencer.',
      references: [
        {
          text: ' Withdrawing is based on l2 to l1 messages',
          href: '',
        },
      ],
      risks: [OPERATOR_CENSORS_WITHDRAWAL],
    },
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'AdminMultisig',
      'Admin of the linea rollup',
    ),
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('zkEVM', {
        description: `The main contract of the Linea zkEVM rollup. It defines the rules of the system including core system parameters, permissioned actors as well as emergency procedures. The emergency state can be activated either by the Security Council, by proving a soundness error or by presenting a sequenced batch that has not been aggregated before a ${_HALT_AGGREGATION_TIMEOUT} timeout. This contract receives transaction batches, L2 state roots as well as zk proofs.`,
        ...timelockUpgrades,
      }),
    ],
    references: [
      {
        text: 'State injections - stateRoot and exitRoot are part of the validity proof input.',
        href: 'https://etherscan.io/address/0xe262Ea2782e2e8dbFe354048c3B5d6DE9603EfEF#code#F1#L806',
      },
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(delay)],
  },
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
