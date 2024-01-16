import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'

import {
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { formatSeconds } from '../utils/formatSeconds'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('degate3')

const forcedWithdrawalDelay = discovery.getContractValue<number[]>(
  'ExchangeV3',
  'getConstants',
)[2]

const maxAgeDepositUntilWithdrawable = discovery.getContractValue<number>(
  'ExchangeV3',
  'getMaxAgeDepositUntilWithdrawable',
)

const forcedWithdrawalFee = discovery.getContractValue<number>(
  'LoopringV3',
  'forcedWithdrawalFee',
)

const maxForcedWithdrawalFee = discovery.getContractValue<(number | string)[]>(
  'ExchangeV3',
  'getConstants',
)[10]
const maxForcedWithdrawalFeeString = `${utils.formatEther(
  maxForcedWithdrawalFee,
)} ETH`

const delay1 = discovery.getContractValue<number>('TimeLock1', 'MINIMUM_DELAY')
const delay2 = discovery.getContractValue<number>('TimeLock2', 'MINIMUM_DELAY')

const upgradeDelay = Math.min(delay1, delay2)

const timelockUpgrades1 = {
  upgradableBy: ['Degate HomeDAO2 Multisig'],
  upgradeDelay: formatSeconds(delay1),
}

const timelockUpgrades2 = {
  upgradableBy: ['Degate HomeDAO2 Multisig'],
  upgradeDelay: formatSeconds(delay2),
}

export const degate3: Layer2 = {
  type: 'layer2',
  id: ProjectId('degate3'),
  display: {
    name: 'DeGate V1',
    slug: 'degate3',
    description:
      'DeGate is a ZK Rollup enabling a decentralized order book exchange. DeGate smart contracts are forked from Loopring V3.',
    purposes: ['Exchange'],
    provider: 'Loopring',
    category: 'ZK Rollup',
    dataAvailabilityMode: 'StateDiffs',
    links: {
      websites: ['https://degate.com/'],
      apps: ['https://app.degate.com/'],
      documentation: ['https://docs.degate.com/'],
      explorers: [],
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
  config: {
    associatedTokens: ['DG'],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x54D7aE423Edb07282645e740C046B9373970a168'),
        sinceTimestamp: new UnixTime(1699746983),
        tokens: '*',
      }),
    ],
    liveness: {
      duplicateData: [
        {
          from: 'stateUpdates',
          to: 'proofSubmissions',
        },
      ],
      proofSubmissions: [],
      batchSubmissions: [],
      stateUpdates: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x9b93e47b7F61ad1358Bd47Cd01206708E85AE5eD',
          ),
          selector: '0x377bb770',
          functionSignature:
            'function submitBlocks(bool isDataCompressed,bytes data)',
          sinceTimestamp: new UnixTime(1699747007),
        },
      ],
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, forcedWithdrawalDelay),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_FORCE_VIA_L1_LOOPRING(
        forcedWithdrawalDelay,
        forcedWithdrawalFee,
        maxAgeDepositUntilWithdrawable,
      ),
      sources: [
        {
          contract: 'ExchangeV3',
          references: [
            'https://etherscan.io/address/0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b#code#F23#L102',
            'https://etherscan.io/address/0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b#code#F35#L162',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP,
      sources: [
        {
          contract: 'ExchangeV3',
          references: [
            'https://etherscan.io/address/0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b#code#F1#L420',
          ],
        },
      ],
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
        usersHave7DaysToExit: null,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: [
          true,
          'Users have at least 30d to exit as the system upgrades have a 45d delay.',
        ],
      },
    },
    {
      rollupNodeLink: 'https://github.com/degatedev/degate-state-recover',
    },
  ),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'Operator - DeGate design doc',
          href: 'https://github.com/degatedev/protocols/blob/degate_mainnet/DeGate%20Protocol%20Specification%20Document.md#operator',
        },
      ],
    },
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          text: 'Operator - DeGate design doc',
          href: 'https://github.com/degatedev/protocols/blob/degate_mainnet/DeGate%20Protocol%20Specification%20Document.md#operator',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN,
      references: [
        {
          text: 'Introduction - DeGate design doc',
          href: 'https://github.com/degatedev/protocols/blob/degate_mainnet/DeGate%20Protocol%20Specification%20Document.md#design-features',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          text: 'ExchangeV3.sol#L341-L348 - DeGate source code',
          href: 'https://etherscan.io/address/0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b#code#F1#L341',
        },
        {
          text: 'LoopringIOExchangeOwner.sol#L98-L101 - DeGate source code',
          href: 'https://etherscan.io/address/0x9b93e47b7F61ad1358Bd47Cd01206708E85AE5eD#code#F1#L98',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.WITHDRAW_OR_HALT(),
      references: [
        {
          text: 'Forced Withdrawals - DeGate design doc',
          href: 'https://github.com/degatedev/protocols/blob/degate_mainnet/Smart%20Contract%20Design.md#force-withdrawal',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'no proof'),
        references: [
          {
            text: 'Withdraw - DeGate design doc',
            href: 'https://github.com/degatedev/protocols/blob/degate_mainnet/Smart%20Contract%20Design.md#normal-withdrawal',
          },
        ],
      },
      {
        ...EXITS.FORCED(),
        references: [
          {
            text: 'Forced Request Handling - DeGate design doc',
            href: 'https://github.com/degatedev/protocols/blob/degate_mainnet/Smart%20Contract%20Design.md#force-withdrawal',
          },
          {
            text: 'ExchangeV3.sol#L392 - DeGate source code, forceWithdraw function',
            href: 'https://etherscan.io/address/0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b#code#F1#L392',
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
            text: 'Forced Request Handling - DeGate design doc',
            href: 'https://github.com/degatedev/protocols/blob/degate_mainnet/Smart%20Contract%20Design.md#exodus-mode',
          },

          {
            text: 'ExchangeV3.sol#L420 - DeGate source code, withdrawFromMerkleTree function',
            href: 'https://etherscan.io/address/0xc56C1dfE64D21A345E3A3C715FFcA1c6450b964b#code#F1#L420',
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
  permissions: [
    {
      name: 'BlockVerifier Owner',
      description: 'This address is the owner of the BlockVerifier contract.',
      accounts: [discovery.getPermissionedAccount('BlockVerifier', 'owner')],
    },
    {
      name: 'Block Submitters',
      accounts: discovery.getPermissionedAccounts(
        'LoopringIOExchangeOwner',
        'blockSubmitters',
      ),
      description:
        'Actors who can submit new blocks, updating the L2 state on L1.',
    },
    {
      name: 'Degate HomeDAO2 Multisig',
      accounts: [discovery.getPermissionedAccount('TimeLock1', 'admin')],
      description: (() => {
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

        const permissionedAccount =
          discovery.formatPermissionedAccount(ownerDepositContract)

        assert(
          permissionedAccount.type !== 'EOA',
          'DeGate: found unexpected EOA',
        )
        return `Actor allowed to upgrade the ExchangeV3 and DefaultDepositContract contracts. This address is the owner of the following contracts: LoopringIOExchangeOwner, LoopringV3, DefaultDepositContract. Can add or remove block submitters. Can change the forced withdrawal fee up to ${maxForcedWithdrawalFeeString}. Can change a way that balance is calculated per contract during the deposit, allowing the support of non-standard tokens.`
      })(),
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('ExchangeV3', {
        description: `Main ExchangeV3 contract.`,
        ...timelockUpgrades1,
      }),
      discovery.getContractDetails(
        'LoopringIOExchangeOwner',
        'Contract used by the Prover to submit exchange blocks with zkSNARK proofs that are later processed and verified by the BlockVerifier contract.',
      ),
      discovery.getContractDetails('DefaultDepositContract', {
        description: `ERC 20 token basic deposit contract. Handles user deposits and withdrawals.`,
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
    risks: [],
  },
  milestones: [
    {
      name: 'DeGate Mainnet Beta Redeploy',
      link: 'https://medium.com/degate/degate-mainnet-beta-redeployment-oct-2023-e07c8eeaec4c',
      date: '2023-10-27T00:00:00Z',
      description:
        'DeGate redeploy Mainnet Beta with the ability to upgrade the smart contracts, with a time delay.',
    },
  ],
}
