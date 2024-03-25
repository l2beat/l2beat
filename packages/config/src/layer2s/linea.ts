import {
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'

import {
  addSentimentToDataAvailability,
  CONTRACTS,
  EXITS,
  FORCE_TRANSACTIONS,
  FRONTRUNNING_RISK,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  RISK_VIEW,
  ScalingProjectPermissionedAccount,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('linea')

const timelockDelay = discovery.getContractValue<number>(
  'Timelock',
  'getMinDelay',
)
const timelockDelayString = formatSeconds(timelockDelay)

const upgradesTimelock = {
  upgradableBy: ['AdminMultisig'],
  upgradeDelay: timelockDelay === 0 ? 'No delay' : timelockDelayString,
}

const upgrades = {
  upgradableBy: ['AdminMultisig'],
  upgradeDelay: 'No delay',
}

const zodiacRoles = discovery.getContractValue<{
  roles: Record<string, Record<string, boolean>>
}>('Roles', 'roles')
const zodiacPauserRole = '1'
const zodiacPausers: ScalingProjectPermissionedAccount[] = Object.keys(
  zodiacRoles.roles[zodiacPauserRole].members,
).map((zodiacPauser) => discovery.formatPermissionedAccount(zodiacPauser))

const isPaused: boolean =
  discovery.getContractValue<boolean>('zkEVM', 'generalPause') ||
  discovery.getContractValue<boolean>('zkEVM', 'l1l2Pause') ||
  discovery.getContractValue<boolean>('zkEVM', 'l2l1Pause')

const periodInSeconds = discovery.getContractValue<number>(
  'zkEVM',
  'periodInSeconds',
)

const withdrawalLimitInWei = discovery.getContractValue<number>(
  'zkEVM',
  'limitInWei',
)

const withdrawalLimitString = `Currently, there is a general limit of ${utils.formatEther(
  withdrawalLimitInWei,
)} ETH that can be withdrawn within each ${formatSeconds(
  periodInSeconds,
)} time window.`

export const linea: Layer2 = {
  type: 'layer2',
  id: ProjectId('linea'),
  display: {
    name: 'Linea',
    slug: 'linea',
    warning: 'The circuit of the program being proven is not public.',
    description:
      'Linea is a ZK Rollup powered by Consensys zkEVM, designed to scale the Ethereum network.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://linea.build/'],
      apps: [],
      documentation: ['https://docs.linea.build/'],
      explorers: ['https://explorer.linea.build/', 'https://linea.l2scan.co/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/LineaBuild',
        'https://discord.gg/consensys',
        'https://linea.mirror.xyz/',
      ],
      rollupCodes: 'https://rollup.codes/linea',
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      explanation:
        'Linea is a ZK rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted on L1. Tx data, proofs and state roots are currently posted in the same transaction. Blocks can also be finalized by the operator without the need to provide a proof.',
    },
    finality: {
      finalizationPeriod: 0,
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xd19d4B5d358258f05D7B411E21A1460D11B0876F'),
        sinceTimestamp: new UnixTime(1689159923),
        tokens: ['ETH'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x504A330327A089d8364C4ab3811Ee26976d388ce'),
        sinceTimestamp: new UnixTime(1691079071),
        tokens: ['USDC'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319'),
        sinceTimestamp: new UnixTime(1691060675),
        tokens: '*',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://linea-mainnet.infura.io/v3',
      startBlock: 1,
    },
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0x7a776315',
          functionSignature:
            'function submitData((bytes32,bytes32,bytes32,uint256,uint256,bytes32,bytes))',
          sinceTimestampInclusive: new UnixTime(1707831168),
        },
      },
      {
        uses: [
          {
            type: 'liveness',
            subtype: 'stateUpdates',
          },
          {
            type: 'l2costs',
            subtype: 'stateUpdates',
          },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0x4165d6dd',
          functionSignature:
            'function finalizeBlocks((bytes32, uint32, bytes[], bytes32[], bytes, uint16[])[] _blocksData,bytes _proof,uint256 _proofType,bytes32 _parentStateRootHash)',
          sinceTimestampInclusive: new UnixTime(1689159923),
          untilTimestampExclusive: new UnixTime(1707831168),
        },
      },
      {
        uses: [
          {
            type: 'liveness',
            subtype: 'stateUpdates',
          },
          {
            type: 'l2costs',
            subtype: 'stateUpdates',
          },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0xd630280f',
          functionSignature:
            'function finalizeCompressedBlocksWithProof(bytes,uint256,(bytes32,bytes32[],bytes32,uint256,uint256,uint256,bytes32,uint256,bytes32[],uint256,bytes))',
          sinceTimestampInclusive: new UnixTime(1707831168),
        },
      },
    ],
    liveness: {
      duplicateData: {
        from: 'stateUpdates',
        to: 'proofSubmissions',
      },
    },
    finality: {
      type: 'Linea',
      lag: 0,
      minTimestamp: new UnixTime(1707831168),
    },
  },
  chainConfig: {
    name: 'linea',
    chainId: 59144,
    explorerUrl: 'https://lineascan.build',
    explorerApi: {
      url: 'https://api.lineascan.build/api',
      type: 'etherscan',
    },
    // ~ Timestamp of block number 0 on Linea
    // https://lineascan.build/block/0
    minTimestampForTvl: UnixTime.fromDate(new Date('2023-07-06T14:00:00Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 42,
        version: '3',
      },
    ],
    coingeckoPlatform: 'linea',
  },
  dataAvailability: addSentimentToDataAvailability({
    layers: ['Ethereum (calldata)'],
    bridge: { type: 'Enshrined' },
    mode: 'Transactions data (compressed)',
  }),
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      sources: [
        {
          contract: 'zkEVM',
          references: [
            'https://etherscan.io/address/0xAA4b3a9515c921996Abe7930bF75Eff7466a4457#code',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      description:
        RISK_VIEW.DATA_ON_CHAIN.description +
        ' Unlike most ZK rollups, transaction data is posted instead of state diffs.',
      sources: [
        {
          contract: 'zkEVM',
          references: [
            'https://etherscan.io/address/0xAA4b3a9515c921996Abe7930bF75Eff7466a4457#code',
          ],
        },
      ],
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(timelockDelay, 0),
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
      rollupNodeSourceAvailable: false,
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
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
    },
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      description:
        STATE_CORRECTNESS.VALIDITY_PROOFS.description +
        ' Operator can finalize L2 state root without proof.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'the operator forces and finalizes L2 state root without proof.',
        },
      ],
      references: [
        {
          text: 'ZkEvmV2.sol - Etherscan source code, _verifyProof() function',
          href: 'https://etherscan.io/address/0xAA4b3a9515c921996Abe7930bF75Eff7466a4457#code',
        },
      ],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'LineaRollup.sol - Etherscan source code, submitData() function',
          href: 'https://etherscan.io/address/0xAA4b3a9515c921996Abe7930bF75Eff7466a4457#code',
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
          text: 'LineaRollup.sol - Etherscan source code, onlyRole(OPERATOR_ROLE) modifier',
          href: 'https://etherscan.io/address/0xAA4b3a9515c921996Abe7930bF75Eff7466a4457#code',
        },
      ],
    },
    forceTransactions: FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'no proof'),
        description:
          EXITS.REGULAR('zk', 'no proof').description +
          ' Note that withdrawal requests can be censored by the Sequencer. ' +
          withdrawalLimitString,
        risks: [EXITS.OPERATOR_CENSORS_WITHDRAWAL],
        references: [
          {
            text: 'L1MessageService.sol - Etherscan source code, claimMessageWithProof() function',
            href: 'https://etherscan.io/address/0xAA4b3a9515c921996Abe7930bF75Eff7466a4457#code',
          },
        ],
      },
    ],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'AdminMultisig',
      'Admin of the Linea rollup. It can upgrade core contracts, bridges, update permissioned actors, and publish blocks by effectively overriding the proof system.',
    ),
    discovery.contractAsPermissioned(
      discovery.getContract('Roles'),
      `Module to the AdminMultisig. Allows to add additional members to the multisig via permissions to call functions specified by roles.`,
    ),
    {
      accounts: discovery.getAccessControlRolePermission(
        'zkEVM',
        'OPERATOR_ROLE',
      ),
      name: 'Operators',
      description:
        'The operators are allowed to prove blocks and post the corresponding transaction data.',
    },
    {
      accounts: zodiacPausers,
      name: 'Pauser',
      description:
        'Address allowed to pause the ERC20Bridge, the USDCBridge and the core functionalities of the project.',
    },
    {
      accounts: discovery.getAccessControlRolePermission(
        'zkEVM',
        'VERIFIER_SETTER_ROLE',
      ),
      name: 'Verifier Setters',
      description:
        'The verifier setters are allowed to change the verifier address.',
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('zkEVM', {
        description:
          'The main contract of the Linea zkEVM rollup. Contains state roots, the verifier addresses and manages messages between L1 and the L2.',
        ...upgradesTimelock,
        pausable: {
          pausableBy: discovery
            .getAccessControlField('zkEVM', 'PAUSE_MANAGER_ROLE')
            .members.map((a) => a.toString()),
          paused: isPaused,
        },
        references: [
          {
            text: 'LineaRollup.sol - Etherscan source code, state injections: stateRoot and l2MerkleRoot are part of the validity proof input.',
            href: 'https://etherscan.io/address/0xAA4b3a9515c921996Abe7930bF75Eff7466a4457#code',
          },
        ],
      }),
      discovery.getContractDetails(
        'Timelock',
        `Owner of the ProxyAdmin and Verifier Setter. The current delay is ${timelockDelayString}.`,
      ),
      discovery.getContractDetails('ERC20Bridge', {
        description: 'Contract used to bridge ERC20 tokens.',
        ...upgrades,
      }),
      discovery.getContractDetails('USDCBridge', {
        description: 'Contract used to bridge USDC tokens.',
        ...upgrades,
      }),
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(timelockDelayString)],
  },
  milestones: [
    {
      name: 'Alpha v2 is released',
      date: '2024-02-13',
      description: 'This release reduces L1 costs and fees for users.',
      link: 'https://docs.linea.build/build-on-linea/linea-version#alpha-v2-release-notes',
    },
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
