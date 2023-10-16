import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('degate2')

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

export const degate2: Layer2 = {
  type: 'layer2',
  id: ProjectId('degate2'),
  display: {
    name: 'DeGate V1',
    slug: 'degate2',
    description:
      'DeGate is an app-specific ZK rollup that enables a trustless, fast and low-fee decentralized order book exchange, helping users to trade easy and sleep easy. DeGate smart contracts are forked from Loopring V3.',
    purpose: 'Exchange',
    provider: 'Loopring',
    category: 'ZK Rollup',
    links: {
      websites: ['https://degate.com/'],
      apps: ['https://app.degate.com/'],
      documentation: ['https://docs.degate.com/'],
      explorers: [],
      repositories: ['https://github.com/degatedev/protocols'],
      socialMedia: [
        'https://twitter.com/DeGateDex',
        'https://discord.gg/RFVDKGemJb',
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
        address: EthereumAddress('0xF13e21653AEB763595D5E4baA1dC115689Da49b9'),
        sinceTimestamp: new UnixTime(1693304807),
        tokens: '*',
      }),
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    upgradeability: RISK_VIEW.UPGRADABLE_NO,
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
            'https://etherscan.io/address/0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7#code#F23#L102',
            'https://etherscan.io/address/0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7#code#F35#L162',
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
            'https://etherscan.io/address/0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7#code#F1#L420',
          ],
        },
      ],
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: 'UnderReview',
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
        'Users have at least 30d to exit as the system cannot be upgraded.',
      ],
    },
  }),
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
          href: 'https://etherscan.io/address/0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7#code#F1#L341',
        },
        {
          text: 'LoopringIOExchangeOwner.sol#L98-L101 - DeGate source code',
          href: 'https://etherscan.io/address/0x2CFd271e9b4d0344Fd2Aa0cb1ffd4f6b85c0B215#code#F1#L98',
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
        ...EXITS.FORCED,
        references: [
          {
            text: 'Forced Request Handling - DeGate design doc',
            href: 'https://github.com/degatedev/protocols/blob/degate_mainnet/Smart%20Contract%20Design.md#force-withdrawal',
          },
          {
            text: 'ExchangeV3.sol#L392 - DeGate source code, forceWithdraw function',
            href: 'https://etherscan.io/address/0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7#code#F1#L392',
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
            href: 'https://etherscan.io/address/0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7#code#F1#L420',
          },
        ],
      },
    ],
  },
  permissions: [
    {
      name: 'DefaultDepositContract Owner',
      accounts: (() => {
        const owner1 = discovery.getAddressFromValue(
          'DefaultDepositContract',
          'owner',
        )
        const owner2 = discovery.getAddressFromValue(
          'LoopringIOExchangeOwner',
          'owner',
        )
        const owner3 = discovery.getAddressFromValue('LoopringV3', 'owner')

        // making sure that the description is correct
        assert(owner1 === owner2 && owner2 === owner3 && owner3, 'DeGate')

        const permissionedAccount = discovery.formatPermissionedAccount(owner1)

        // if it was updated, we should add multisig participants
        assert(permissionedAccount.type === 'EOA', 'DeGate')

        return [permissionedAccount]
      })(),
      description: `This address is the owner of the following contracts: LoopringIOExchangeOwner, LoopringV3, DefaultDepositContract. Can add or remove block submitters. Can change the forced withdrawal fee up to ${maxForcedWithdrawalFeeString}. Can change a way that balance is calculated per contract during the deposit, allowing the support of non-standard tokens.`,
    },
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
  ],
  contracts: {
    addresses: [
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
    risks: [],
  },
  milestones: [
    {
      name: 'DeGate Redeploy',
      link: 'https://medium.com/degate/degate-mainnet-beta-redeployment-update-a0f1a6b7350c',
      date: '2023-09-14T00:00:00Z',
      description: 'DeGate redeploys the contracts to fix a bug.',
    },
  ],
}
