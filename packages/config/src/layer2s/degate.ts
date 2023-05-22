import { assert, ProjectId, UnixTime } from '@l2beat/shared'

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
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('degate')

export const degate: Layer2 = {
  type: 'layer2',
  id: ProjectId('degate'),
  display: {
    name: 'DeGate',
    slug: 'degate',
    description:
      'DeGate is an app-specific ZK rollup that enables a Trustless, fast and low-fee decentralized order book exchange, helping users to trade easy and sleep easy.',
    purpose: 'Exchange',
    links: {
      websites: ['https://degate.com/'],
      apps: ['https://app.degate.com/'],
      documentation: ['https://docs.degate.com/'],
      explorers: [],
      repositories: ['https://github.com/degatedev/protocols'],
      socialMedia: [
        'https://twitter.com/DeGateDex',
        'https://discord.com/invite/RFVDKGemJb',
        'https://www.youtube.com/@degatedex1718',
        'https://medium.com/degate',
        'https://mirror.xyz/0x078a601f492043C8e7D0E15B0F8815f58b4c342f',
      ],
    },
  },
  config: {
    associatedTokens: ['DG'],
    escrows: [
      discovery.getEscrowDetails({
        identifier: 'DefaultDepositContract',
        sinceTimestamp: new UnixTime(1681991243),
        tokens: '*',
      }),
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    upgradeability: RISK_VIEW.UPGRADABLE_NO,
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_EXIT_L1,
    validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_MP,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    provider: 'loopring',
    category: 'ZK Rollup',
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
          href: 'https://github.com/degatedev/protocols/blob/degate_mainnet/packages/loopring_v3/contracts/core/impl/ExchangeV3.sol#L341-L348',
        },
        {
          text: 'LoopringIOExchangeOwner.sol#L98-L101 - DeGate source code',
          href: 'https://github.com/degatedev/protocols/blob/degate_mainnet/packages/loopring_v3/contracts/aux/access/LoopringIOExchangeOwner.sol#L98-L101',
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
        ],
      },
      {
        ...EXITS.EMERGENCY('Withdrawal Mode', 'merkle proof'),
        references: [
          {
            text: 'Forced Request Handling - DeGate design doc',
            href: 'https://github.com/degatedev/protocols/blob/degate_mainnet/Smart%20Contract%20Design.md#exodus-mode',
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
        const owner4 = discovery.getAddressFromValue('BlockVerifier', 'owner')

        assert(owner1 === owner2 && owner2 === owner3 && owner3 === owner4)

        const accountsList = discovery.getPermissionedAccountsList(
          'DefaultDepositContract',
          'owner',
        )

        // if it was updated, we should add multisig participants
        assert(accountsList.length === 1 && accountsList[0].type === 'EOA')

        return accountsList
      })(),
      description:
        'This address is the owner of the following contracts: LoopringIOExchangeOwner, LoopringV3, DefaultDepositContract, BlockVerifier. Can add or remove block submitters. Can change the forced withdrawal fee. Can change a way that balance is calculated per contract during the deposit, allowing the support of non-standard tokens.',
    },
    {
      name: 'Block Submitters',
      accounts: discovery.getPermissionedAccountsList(
        'LoopringIOExchangeOwner',
        'blockSubmitters',
      ),
      description:
        'Actors who can submit new blocks, updating the L2 state on L1.',
    },
  ],
  contracts: {
    addresses: [
      discovery.getMainContractDetails(
        'ExchangeV3',
        'Main ExchangeV3 contract.',
      ),
      discovery.getMainContractDetails(
        'LoopringIOExchangeOwner',
        'Contract used by the Prover to submit exchange blocks with zkSNARK proofs that are later processed and verified by the BlockVerifier contract.',
      ),
      discovery.getMainContractDetails(
        'DefaultDepositContract',
        'ERC 20 token basic deposit contract. Handles user deposits and withdrawals.',
      ),
      discovery.getMainContractDetails(
        'LoopringV3',
        'Contract for setting exchange fee parameters.',
      ),
      discovery.getMainContractDetails(
        'BlockVerifier',
        'zkSNARK Verifier based on ethsnarks library.',
      ),
    ],
    risks: [],
  },
  milestones: [
    {
      name: 'DeGate DEX Launches Mainnet Beta',
      link: 'https://medium.com/degate/degate-dex-launches-mainnet-beta-trade-easy-sleep-easy-603574bd3a46',
      date: '2023-05-03T13:00:00Z',
      description:
        'The main features of Mainnet Beta include limit orders and grid trading. Deposits are subject to safe deposit limits.',
    },
  ],
}
