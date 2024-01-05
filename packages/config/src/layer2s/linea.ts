import { ContractValue } from '@l2beat/discovery-types'
import {
  assert,
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'

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

const upgradesTimelock = {
  upgradableBy: ['AdminMultisig'],
  upgradeDelay: timelockDelay === 0 ? 'No delay' : timelockDelayString,
}

const upgrades = {
  upgradableBy: ['AdminMultisig'],
  upgradeDelay: 'No delay',
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

const TOKENS: Omit<Token, 'chainId'>[] = [
  {
    id: AssetId('lyra:stone-stakestone-ether'),
    name: 'StakeStone Ether',
    symbol: 'STONE',
    decimals: 18,
    iconUrl:
      'https://assets.coingecko.com/coins/images/33103/large/200_200.png?1702602672',
    address: EthereumAddress('0x93F4d0ab6a8B4271f4a28Db399b5E30612D21116'),
    coingeckoId: CoingeckoId('stakestone-ether'),
    sinceTimestamp: new UnixTime(1699781729),
    category: 'other',
    type: 'EBV',
    formula: 'totalSupply',
    bridgedUsing: {
      bridge: 'Layer Zero',
      slug: 'omnichain',
    },
  },
]

export const linea: Layer2 = {
  type: 'layer2',
  id: ProjectId('linea'),
  display: {
    name: 'Linea',
    slug: 'linea',
    warning: 'The circuit of the program being proven is not public.',
    description:
      'Linea is a ZK Rollup powered by Consensys zkEVM, designed to scale the Ethereum network.',
    purpose: 'Universal',
    category: 'ZK Rollup',
    dataAvailabilityMode: 'TxData',
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
  },
  config: {
    tokenList: TOKENS.map((t) => ({ ...t, chainId: ChainId.LINEA })),
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
      startBlock: 1,
    },
    liveness: {
      proofSubmissions: [],
      duplicateData: [
        {
          from: 'stateUpdates',
          to: 'batchSubmissions',
        },
        {
          from: 'stateUpdates',
          to: 'proofSubmissions',
        },
      ],
      batchSubmissions: [],
      stateUpdates: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0x4165d6dd',
          functionSignature:
            'function finalizeBlocks((bytes32, uint32, bytes[], bytes32[], bytes, uint16[])[] _blocksData,bytes _proof,uint256 _proofType,bytes32 _parentStateRootHash)',
          sinceTimestamp: new UnixTime(1689159923),
        },
      ],
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      sources: [
        {
          contract: 'zkEVM',
          references: [
            'https://etherscan.io/address/0xb32c3D0dDb0063FfB15E8a50b40cC62230D820B3#code#F1#L116',
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
            'https://etherscan.io/address/0xb32c3D0dDb0063FfB15E8a50b40cC62230D820B3#code#F1#L221',
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
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'ZkEvmV2.sol#L275 - Etherscan source code, _verifyProof() function',
          href: 'https://etherscan.io/address/0xb32c3D0dDb0063FfB15E8a50b40cC62230D820B3#code#F1#L297',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'ZkEvmV2.sol#L221 - Etherscan source code, _processBlockTransactions() function',
          href: 'https://etherscan.io/address/0xb32c3D0dDb0063FfB15E8a50b40cC62230D820B3#code#F1#L221',
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
          href: 'https://etherscan.io/address/0xb32c3D0dDb0063FfB15E8a50b40cC62230D820B3#code#F1#L125',
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
            text: 'L1MessageService.sol#L115 - Etherscan source code, claimMessage() function',
            href: 'https://etherscan.io/address/0xb32c3D0dDb0063FfB15E8a50b40cC62230D820B3#code#F21#L118',
          },
        ],
      },
    ],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'AdminMultisig',
      'Admin of the Linea rollup. It can upgrade core contracts, bridges, change the verifier address, and publish blocks by effectively overriding the proof system.',
    ),
    discovery.contractAsPermissioned(
      discovery.getContract('Roles'),
      `Module to the AdminMultisig. Allows to add additional members to the multisig via permissions to call functions specified by roles. ${(() => {
        const roles = discovery.getContract('Roles')
        assert(roles.values !== undefined)
        const rolesCount = Object.entries(
          roles.values.roles['roles' as keyof ContractValue],
        ).length
        assert(rolesCount === 0)

        return 'Currently there are no additional members.'
      })()}`,
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
        ...upgradesTimelock,
        pausable: {
          pausableBy: pausers,
          paused: isPaused,
        },
        references: [
          {
            text: 'ZkEvmV2.sol#L275 - Etherscan source code, state injections: stateRoot and exitRoot are part of the validity proof input.',
            href: 'https://etherscan.io/address/0xb32c3D0dDb0063FfB15E8a50b40cC62230D820B3#code#F1#L297',
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
