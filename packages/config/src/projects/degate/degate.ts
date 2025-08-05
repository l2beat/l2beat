import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
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
  STATE_VALIDATION,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('degate')

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

const owner1 = discovery.getAddressFromValue('DefaultDepositContract', 'owner')
const owner2 = discovery.getAddressFromValue('LoopringIOExchangeOwner', 'owner')
const owner3 = discovery.getAddressFromValue('LoopringV3', 'owner')

// making sure that the description is correct
// if it was updated, we should add multisig participants

assert(owner1 === owner2 && owner2 === owner3 && owner3, 'DeGate')
const permissionedAccount = discovery.formatPermissionedAccounts([owner1])
assert(permissionedAccount[0].type === 'Contract', 'DeGate')

export const degate: ScalingProject = {
  type: 'layer2',
  id: ProjectId('degate'),
  addedAt: UnixTime(1684838286), // 2023-05-23T10:38:06Z
  archivedAt: UnixTime(1696032000), // 2023-09-30T00:00:00.000Z,
  capability: 'appchain',
  badges: [
    BADGES.VM.AppChain,
    BADGES.DA.EthereumCalldata,
    BADGES.Fork.LoopringFork,
  ],
  display: {
    name: 'DeGate Legacy',
    slug: 'degate',
    headerWarning: 'This project is in shutdown mode and no longer active.',
    description:
      'DeGate is an app-specific ZK Rollup that enables a trustless, fast and low-fee decentralized order book exchange, helping users to trade easy and sleep easy. DeGate smart contracts are forked from Loopring V3.',
    purposes: ['Exchange'],
    stacks: ['Loopring'],
    category: 'ZK Rollup',

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
  },
  config: {
    associatedTokens: ['DG'],
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x814d0c1903D69EB1c7ceB8F5190B20A06892d1dA',
        ),
        sinceTimestamp: UnixTime(1681991243),
        tokens: '*',
      }),
    ],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x6B937A5920726e70c5bF1d4d4E18EEeEd46FaE83',
          ),
          selector: '0x377bb770',
          functionSignature:
            'function submitBlocks(bool isDataCompressed,bytes data)',
          sinceTimestamp: UnixTime(1681993655),
          untilTimestamp: UnixTime(1695902496),
        },
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW_NON_UPGRADABLE,
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
            'Users have at least 30d to exit as the system cannot be upgraded.',
          mode: 'replace',
        },
      },
    },
    {
      rollupNodeLink: 'https://github.com/degatedev/degate-state-recover',
    },
  ),
  stateValidation: {
    categories: [
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
  },
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
          url: 'https://etherscan.io/address/0xe63602a9B3DFE983187525AC985Fec4F57B24eD5#code#F1#L341',
        },
        {
          title: 'LoopringIOExchangeOwner.sol#L98-L101 - DeGate source code',
          url: 'https://etherscan.io/address/0x6B937A5920726e70c5bF1d4d4E18EEeEd46FaE83#code#F1#L98',
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
            url: 'https://etherscan.io/address/0xe63602a9B3DFE983187525AC985Fec4F57B24eD5#code#F1#L392',
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
            url: 'https://etherscan.io/address/0xe63602a9B3DFE983187525AC985Fec4F57B24eD5#code#F1#L420',
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
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'DefaultDepositContract Owner',
          permissionedAccount,
          `This address is the owner of the following contracts: LoopringIOExchangeOwner, LoopringV3, DefaultDepositContract. Can add or remove block submitters. Can change the forced withdrawal fee up to ${maxForcedWithdrawalFeeString}. Can change a way that balance is calculated per contract during the deposit, allowing the support of non-standard tokens.`,
        ),
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
      ],
    },
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('ExchangeV3', 'Main ExchangeV3 contract.'),
        discovery.getContractDetails(
          'LoopringIOExchangeOwner',
          'Contract used by the Prover to submit exchange blocks with zkSNARK proofs that are later processed and verified by the BlockVerifier contract.',
        ),
        discovery.getContractDetails(
          'DefaultDepositContract',
          'ERC 20 token basic deposit contract. Handles user deposits and withdrawals.',
        ),
        discovery.getContractDetails(
          'LoopringV3',
          'Contract for setting exchange fee parameters.',
        ),
        discovery.getContractDetails(
          'BlockVerifier',
          'zkSNARK Verifier based on ethsnarks library.',
        ),
      ],
    },
    risks: [],
  },
  milestones: [
    {
      title: 'DeGate DEX Launches Mainnet Beta',
      url: 'https://medium.com/degate/degate-dex-launches-mainnet-beta-trade-easy-sleep-easy-603574bd3a46',
      date: '2023-05-03T00:00:00Z',
      description:
        'DeGate launches mainnet beta with a deposit cap and a program to recover eventual user losses.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
