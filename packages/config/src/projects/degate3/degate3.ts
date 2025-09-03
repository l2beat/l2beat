import {
  assert,
  ChainId,
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'

import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  SOA,
  STATE_VALIDATION,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { PROOFS } from '../../common/proofSystems'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('degate3')

const forcedWithdrawalDelay = discovery.getContractValue<{
  [key: string]: number
}>('ExchangeV3', 'getConstants').MAX_AGE_FORCED_REQUEST_UNTIL_WITHDRAW_MODE

const maxAgeDepositUntilWithdrawable = discovery.getContractValue<number>(
  'ExchangeV3',
  'getMaxAgeDepositUntilWithdrawable',
)

const forcedWithdrawalFee = discovery.getContractValue<number>(
  'LoopringV3',
  'forcedWithdrawalFee',
)

const maxForcedWithdrawalFee = discovery.getContractValue<{
  [key: string]: number
}>('ExchangeV3', 'getConstants').MAX_FORCED_WITHDRAWAL_FEE

const maxForcedWithdrawalFeeString = `${utils.formatEther(
  maxForcedWithdrawalFee,
)} ETH`

const owner1 = discovery.getAddressFromValue('TimeLock1', 'admin')
const owner2 = discovery.getAddressFromValue('TimeLock2', 'admin')
assert(owner1 === owner2, 'The owners are different')

const ownerDepositContract = discovery.getAddressFromValue(
  'DefaultDepositContract',
  'owner',
)
const ownerIOExchange = discovery.getAddressFromValue(
  'LoopringIOExchangeOwner',
  'owner',
)
const ownerV3 = discovery.getAddressFromValue('LoopringV3', 'owner')

// making sure that the description is correct
assert(
  ownerDepositContract === ownerIOExchange &&
    ownerIOExchange === ownerV3 &&
    ownerV3 === owner1,
  'DeGate: owners structure changed, update description',
)

const permissionedAccount = discovery.formatPermissionedAccounts([
  ownerDepositContract,
])

assert(permissionedAccount[0].type !== 'EOA', 'DeGate: found unexpected EOA')

const delay1 = discovery.getContractValue<number>('TimeLock1', 'MINIMUM_DELAY')
const delay2 = discovery.getContractValue<number>('TimeLock2', 'MINIMUM_DELAY')

const upgradeDelay = Math.min(delay1, delay2)
const finalizationPeriod = 0

const timelockUpgrades1 = {
  upgradableBy: [
    { name: 'Degate HomeDAO2 Multisig', delay: formatSeconds(delay1) },
  ],
}

const timelockUpgrades2 = {
  upgradableBy: [
    { name: 'Degate HomeDAO2 Multisig', delay: formatSeconds(delay2) },
  ],
}

export const degate3: ScalingProject = {
  archivedAt: UnixTime(1752041971), // Wednesday, July 9, 2025 6:19:31 AM UTC
  type: 'layer2',
  id: ProjectId('degate3'),
  capability: 'appchain',
  addedAt: UnixTime(1684838286), // 2023-05-23T10:38:06Z
  badges: [
    BADGES.VM.AppChain,
    BADGES.DA.EthereumCalldata,
    BADGES.Fork.LoopringFork,
  ],
  display: {
    name: 'DeGate V1',
    slug: 'degate3',
    description:
      'DeGate is a ZK Rollup enabling a decentralized order book exchange. DeGate smart contracts are forked from Loopring V3.',
    purposes: ['Exchange', 'NFT'],
    stacks: ['Loopring'],
    headerWarning:
      'A system **shutdown** [was triggered](https://etherscan.io/tx/0xa3a340cfebbdbf9999e61cc3838f67d21610944704f9b2546e2fe95435134d5c#eventlog) on 2025-06-27. This irreversible action freezes the L2 state and allows users to withdraw their funds with the help of the operator. Degate announced that they [will withdraw all funds automatically](https://medium.com/degate/announcement-sunsetting-of-orderbook-f9c0d3389e51). If the operator does not cooperate, a withdrawal mode can still be activated, allowing users to withdraw their funds on their own by providing merkle proofs.',
    links: {
      websites: ['https://degate.com/'],
      bridges: ['https://app.degate.com/'],
      documentation: ['https://docs.degate.com/'],
      repositories: ['https://github.com/degatedev/protocols'],
      socialMedia: [
        'https://twitter.com/DeGateDex',
        'https://discord.gg/degate',
        'https://youtube.com/@degatedex1718',
        'https://medium.com/degate',
        'https://mirror.xyz/0x078a601f492043C8e7D0E15B0F8815f58b4c342f',
      ],
    },
    liveness: {
      explanation:
        'DeGate is a ZK rollup based on Loopring’s code base that posts state diffs to the L1. For a transaction to be considered final, the state diffs have to be submitted and validity proof should be generated, submitted, and verified. ',
    },
  },
  proofSystem: {
    type: 'Validity',
    zkCatalogId: ProjectId('loopringprover'),
  },
  chainConfig: {
    name: 'degate3',
    chainId: undefined,
    apis: [
      {
        type: 'degate3',
        url: 'https://v1-mainnet-backend.degate.com/order-book-api',
        callsPerMinute: 120,
      },
    ],
  },
  config: {
    associatedTokens: ['DG'],
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x54D7aE423Edb07282645e740C046B9373970a168',
        ),
        sinceTimestamp: UnixTime(1699746983),
        tokens: '*',
      }),
    ],
    activityConfig: { type: 'block' },
    trackedTxs: [
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
            '0x9b93e47b7F61ad1358Bd47Cd01206708E85AE5eD',
          ),
          selector: '0x377bb770',
          functionSignature:
            'function submitBlocks(bool isDataCompressed,bytes data)',
          sinceTimestamp: UnixTime(1699747007),
        },
      },
    ],
    liveness: {
      duplicateData: {
        from: 'stateUpdates',
        to: 'proofSubmissions',
      },
    },
  },
  scopeOfAssessment: {
    inScope: [SOA.l1Contracts, SOA.gasToken, SOA.derivationSpec],
    notInScope: [
      SOA.specToSourceCode,
      SOA.sourceCodeToVerificationKeys,
      SOA.trustedSetup,
      SOA.sequencerPolicy,
      SOA.nonGasTokens,
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      executionDelay: finalizationPeriod,
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, forcedWithdrawalDelay),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1_LOOPRING(
      forcedWithdrawalDelay,
      forcedWithdrawalFee,
      maxAgeDepositUntilWithdrawable,
    ),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP,
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
      },
      stage1: {
        principle: true,
        usersHave7DaysToExit: null,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: {
          satisfied: true,
          message:
            'Users have at least 30d to exit as the system upgrades have a 45d delay.',
          mode: 'replace',
        },
      },
    },
    {
      rollupNodeLink: 'https://github.com/degatedev/degate-state-recover',
      additionalConsiderations: {
        short:
          'Degate provides an orderbook decentralized exchange for spot trading. Arbitrary contracts are not supported.',
        long: 'Degate provides an orderbook decentralized exchange for spot trading. Arbitrary contracts are not supported.',
      },
    },
  ),
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA,
      references: [
        {
          title: 'Introduction - DeGate design doc',
          url: 'https://github.com/degatedev/protocols/blob/degate_mainnet/DeGate%20Protocol%20Specification%20Document.md#design-features',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          title: 'ExchangeV3.sol#L341-L348 - DeGate source code',
          url: 'https://etherscan.io/address/0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b#code#F1#L341',
        },
        {
          title: 'LoopringIOExchangeOwner.sol#L98-L101 - DeGate source code',
          url: 'https://etherscan.io/address/0x9b93e47b7F61ad1358Bd47Cd01206708E85AE5eD#code#F1#L98',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.WITHDRAW_OR_HALT(),
      references: [
        {
          title: 'Forced Withdrawals - DeGate design doc',
          url: 'https://github.com/degatedev/protocols/blob/degate_mainnet/Smart%20Contract%20Design.md#force-withdrawal',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_WITHDRAWAL('zk'),
        references: [
          {
            title: 'Withdraw - DeGate design doc',
            url: 'https://github.com/degatedev/protocols/blob/degate_mainnet/Smart%20Contract%20Design.md#normal-withdrawal',
          },
        ],
      },
      {
        ...EXITS.FORCED_WITHDRAWAL(),
        references: [
          {
            title: 'Forced Request Handling - DeGate design doc',
            url: 'https://github.com/degatedev/protocols/blob/degate_mainnet/Smart%20Contract%20Design.md#force-withdrawal',
          },
          {
            title:
              'ExchangeV3.sol#L392 - DeGate source code, forceWithdraw function',
            url: 'https://etherscan.io/address/0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b#code#F1#L392',
          },
        ],
      },
      {
        ...EXITS.EMERGENCY(
          'Withdrawal Mode',
          'merkle proof',
          forcedWithdrawalDelay,
        ),
        references: [
          {
            title: 'Forced Request Handling - DeGate design doc',
            url: 'https://github.com/degatedev/protocols/blob/degate_mainnet/Smart%20Contract%20Design.md#exodus-mode',
          },

          {
            title:
              'ExchangeV3.sol#L420 - DeGate source code, withdrawFromMerkleTree function',
            url: 'https://etherscan.io/address/0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b#code#F1#L420',
          },
        ],
      },
    ],
  },
  stateDerivation: {
    nodeSoftware:
      'Node software source code can be found [here](https://github.com/degatedev/degate-state-recover).',
    compressionScheme: 'No compression is used.',
    genesisState:
      'The system does not begin with a genesis state; instead, it initiates from a zero state, as referenced in [`CreateEmptyState`](https://github.com/degatedev/degate-state-recover/blob/main/statemanager/state.go#L28).',
    dataFormat:
      'DeGate bundles off-chain transactions into [zkBlocks](https://github.com/degatedev/protocols/blob/degate_mainnet/Circuit%20Design.md#zkblock) and submits them to the blockchain. zkBlock data definition is documented [here](https://github.com/degatedev/protocols/blob/degate_mainnet/Smart%20Contract%20Design.md#zkblock-data-definition).',
  },
  stateValidation: {
    description:
      'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
    categories: [
      {
        title: 'ZK Circuits',
        description:
          'DeGate utilizes Groth16 for their proving system. The source code of the circuits can be found [here](https://github.com/degatedev/protocols/tree/degate_mainnet/packages/loopring_v3/circuit).',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the proof system is implemented incorrectly.',
          },
        ],
      },
      {
        title: 'Verification Keys Generation',
        description:
          'Groth16 requires a circuit specific trusted setup, so they run their own ceremony. The first phase is run using Powers of Tau ceremony. Some of the instructions on how to regenerate the verification keys can be found [here](https://github.com/degatedev/trusted_setup/tree/master).',
      },
      {
        ...STATE_VALIDATION.VALIDITY_PROOFS,
        references: [
          {
            title: 'Operator - DeGate design doc',
            url: 'https://github.com/degatedev/protocols/blob/degate_mainnet/DeGate%20Protocol%20Specification%20Document.md#operator',
          },
        ],
      },
    ],
    proofVerification: {
      shortDescription:
        'DeGate is a DEX rollup on Ethereum, based on Loopring V3.',
      aggregation: false,
      requiredTools: [
        {
          name: 'Custom tool',
          version: 'v1.1.0',
          link: 'https://github.com/degatedev/trusted_setup/tree/master',
        },
      ],
      verifiers: [
        {
          name: 'BlockVerifier',
          description: 'DeGate utilizes Groth16 for their proving system.',
          verified: 'no',
          contractAddress: EthereumAddress(
            '0xE3B7fE3ce0fa54C5AC7F48E7ED9E52dA045bE4d6',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            {
              name: 'Main circuit',
              ...PROOFS.GROTH16('?'),
              link: 'https://github.com/degatedev/protocols/tree/degate_mainnet/packages/loopring_v3/circuit',
            },
          ],
        },
      ],
    },
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'BlockVerifier Owner',
          discovery.getPermissionedAccounts('BlockVerifier', 'owner'),
          'This address is the owner of the BlockVerifier contract.',
        ),
        discovery.getPermissionDetails(
          'Block Submitters',
          discovery.getPermissionedAccounts(
            'LoopringIOExchangeOwner',
            'blockSubmitters',
          ),
          'Actors who can submit new blocks, updating the L2 state on L1.',
        ),
        discovery.getPermissionDetails(
          'Degate HomeDAO2 Multisig',
          discovery.getPermissionedAccounts('TimeLock1', 'admin'),
          `Actor allowed to upgrade the ExchangeV3 and DefaultDepositContract contracts. This address is the owner of the following contracts: LoopringIOExchangeOwner, LoopringV3, DefaultDepositContract. Can add or remove block submitters. Can change the forced withdrawal fee up to ${maxForcedWithdrawalFeeString}. Can change a way that balance is calculated per contract during the deposit, allowing the support of non-standard tokens.`,
        ),
      ],
    },
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('ExchangeV3', {
          description: 'Main ExchangeV3 contract.',
          ...timelockUpgrades1,
        }),
        discovery.getContractDetails(
          'LoopringIOExchangeOwner',
          'Contract used by the Prover to submit exchange blocks with zkSNARK proofs that are later processed and verified by the BlockVerifier contract.',
        ),
        discovery.getContractDetails('DefaultDepositContract', {
          description:
            'ERC 20 token basic deposit contract. Handles user deposits and withdrawals.',
          ...timelockUpgrades2,
        }),
        discovery.getContractDetails(
          'LoopringV3',
          'Contract for setting exchange fee parameters.',
        ),
        discovery.getContractDetails(
          'BlockVerifier',
          'zkSNARK Verifier based on ethsnarks library.',
        ),
        discovery.getContractDetails(
          'TimeLock1',
          `This timelock contract is set as the proxyOwner of the ExchangeV3 contract. There is a ${formatSeconds(
            delay1,
          )} time delay for upgrading the contract.`,
        ),
        discovery.getContractDetails(
          'TimeLock2',
          `This timelock contract is set as the proxyOwner of the DefaultDepositContract contract. There is a ${formatSeconds(
            delay2,
          )} time delay for upgrading the contract.`,
        ),
      ],
    },
    risks: [],
  },
  milestones: [
    {
      title: 'Shutdown mode activated',
      url: 'https://medium.com/degate/announcement-sunsetting-of-orderbook-f9c0d3389e51',
      date: '2025-06-26T00:00:00Z',
      description:
        'Shutdown mode prevents further state updates and allows users to withdraw their funds.',
      type: 'incident',
    },
    {
      title: 'DeGate Mainnet Beta Redeploy',
      url: 'https://medium.com/degate/degate-mainnet-beta-redeployment-oct-2023-e07c8eeaec4c',
      date: '2023-11-13T00:00:00Z',
      description:
        'DeGate redeploys Mainnet Beta due to a bug, with the ability to upgrade the smart contracts.',
      type: 'incident',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
