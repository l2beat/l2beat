import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'

import {
  CONTRACTS,
  EXITS,
  FORCE_TRANSACTIONS,
  FRONTRUNNING_RISK,
  RISK_VIEW,
  addSentimentToDataAvailability,
  makeBridgeCompatible,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('metis')

const upgradeDelay = 0

const CHALLENGE_PERIOD_SECONDS = discovery.getContractValue<number>(
  'StateCommitmentChain',
  'FRAUD_PROOF_WINDOW',
)

export const metis: Layer2 = {
  isUnderReview: false,
  type: 'layer2',
  id: ProjectId('metis'),
  display: {
    name: 'Metis Andromeda',
    shortName: 'Metis',
    slug: 'metis',
    description:
      'Metis Andromeda is an EVM-equivalent solution originally forked from Optimism OVM. Since April 2024 hashes of data blobs are posted to EOA similarly to OPStack chains. It uses a decentralized Sequencer pool running Tendermint consensus and MPC module to sign transaction batches.',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    purposes: ['Universal'],
    provider: 'OVM',
    category: 'Optimium',
    links: {
      websites: ['https://metis.io'],
      apps: ['https://bridge.metis.io'],
      documentation: ['https://docs.metis.io'],
      explorers: [
        'https://andromeda-explorer.metis.io',
        'https://explorer.metis.io',
      ],
      repositories: ['https://github.com/MetisProtocol'],
      socialMedia: [
        'https://metisl2.medium.com/',
        'https://twitter.com/MetisL2',
        'https://discord.com/invite/metis',
        'https://youtube.com/@Metis_L2',
        'https://t.me/MetisL2',
        'https://instagram.com/metisl2/',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  stage: {
    stage: 'NotApplicable',
  },
  chainConfig: {
    name: 'metis',
    chainId: 1088,
    explorerUrl: 'https://explorer.metis.io',
    explorerApi: {
      url: 'https://api.routescan.io/v2/network/mainnet/evm/1088/etherscan/api',
      type: 'etherscan',
    },
    minTimestampForTvl: UnixTime.fromDate(new Date('2021-11-18T21:19:39Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 2338552,
        version: '3',
        // TODO: fix this
        isNativeBalanceSupported: false,
      },
    ],
    coingeckoPlatform: 'metis',
  },
  config: {
    associatedTokens: ['Metis'],
    escrows: [
      {
        address: EthereumAddress('0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b'),
        sinceTimestamp: new UnixTime(1637077208),
        tokens: '*',
        chain: 'ethereum',
      },
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://andromeda.metis.io/',
      defaultCallsPerMinute: 1500,
      startBlock: 1,
    },
  },
  dataAvailability: addSentimentToDataAvailability({
    layers: ['MEMO'],
    bridge: { type: 'None' },
    mode: 'Transactions data',
  }),
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      secondLine: `${formatSeconds(CHALLENGE_PERIOD_SECONDS)} challenge period`,
    },
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_MEMO,
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, 0),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_ENQUEUE_VIA_L1,
      sources: [
        {
          contract: 'CanonicalTransactionChain',
          references: [
            'https://etherscan.io/address/0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9#code#F1#L212',
          ],
        },
      ],
    },
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL('METIS'),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    stateCorrectness: {
      name: 'No automatic on-chain fraud proof system',
      description:
        'For additional security, any staked Validator can challenge invalid state root submitted by the Sequencer. Other Validators will then act as referees in an interactive challenge game. Dishonest Validator majority can push invalid state root on-chain, and potentially slash honest Sequencer.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'an invalid state root is submitted to the system.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'MVM_Verifier.sol#L133 - Metis source code',
          href: 'https://github.com/MetisProtocol/mvm/blob/develop/packages/contracts/contracts/MVM/MVM_Verifier.sol#L133',
        },
      ],
    },
    dataAvailability: {
      name: 'Data is recorded off-chain in MEMO',
      description:
        'Transaction data is not stored on-chain, rather it is recorded in off-chain decentralized storage \
        MEMO from MemoLabs. Data hashes are posted to an EOA address.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'sequencer withholds data for more than seven days while at the same time submits fraudulent state root.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'The Tech Journey: Lower Gas Costs & Storage Layer on Metis',
          href: 'https://metisdao.medium.com/the-tech-journey-lower-gas-costs-storage-layer-on-metis-867ddcf6d381',
        },
      ],
    },
    operator: {
      name: 'The system has a decentralized sequencer set',
      description:
        'As of April 2024 Metis uses a permissioned sequencer pool running a Tendermint consensus. Once consensus is reached on a block, an MPC address is used to submit a block hash to Ethereum. The infrastracture to manage the MPC is offchain and not trustless because Ethereum does not verify the validity of MPC address.',
      risks: [FRONTRUNNING_RISK],
      references: [
        {
          text: 'Decentralized Sequencer - Metis documentation',
          href: 'https://docs.metis.io/dev/decentralized-sequencer/overview',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.ENQUEUE,
      references: [
        {
          text: 'CanonicalTransactionChain - Etherscan source code',
          href: 'https://etherscan.io/address/0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9#code',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [
          {
            text: 'Withdrawing from Metis - Metis documentation',
            href: 'https://docs.metis.io/building-on-metis/metis-bridge#withdrawing-from-metis',
          },
        ],
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
      EXITS.FORCED('forced-withdrawals'),
    ],
    otherConsiderations: [
      {
        name: 'EVM compatible smart contracts are supported',
        description:
          'Metis uses the Optimistic Virtual Machine (OVM) 2.0 to execute transactions.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'there are mistakes in the highly complex OVM implementation.',
          },
        ],
        references: [
          {
            text: 'MVM repository - Metis source code',
            href: 'https://github.com/MetisProtocol/mvm',
          },
        ],
      },
    ],
  },
  permissions: [
    {
      name: 'Sequencer',
      accounts: [
        {
          address: EthereumAddress(
            '0x1A9da0aedA630dDf2748a453BF6d92560762D914',
          ),
          type: 'EOA',
        },
      ],
      description: 'Central actor allowed to commit transactions to L1.',
    },
    ...discovery.getMultisigPermission(
      'Metis Multisig',
      'This address is the owner of all the upgradable contracts of the system. This allows it to censor messages or pause message bridge altogether, upgrade bridge implementation potentially gaining access to all funds stored in a bridge and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    ),
    {
      name: 'State Root Proposer',
      accounts: [
        discovery.getPermissionedAccount(
          'Lib_AddressManager',
          '_1088_MVM_Proposer',
        ),
      ],
      description: 'Central actor to post new state roots to L1.',
    },
    {
      name: 'Execution Verifiers',
      accounts: [
        // TODO: Verify this. This is the same address as the multisig. If this is correct, we should remove it and change multisig description.
        {
          address: EthereumAddress(
            '0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21',
          ),
          type: 'EOA',
        },
      ],
      description:
        'Those addresses can challenge the state roots submitted by the state root proposer.',
    },
  ],
  contracts: {
    addresses: [
      // note: these three contracts are not used anymore - transaction batch hashes are posted to EOA. Note that these contracts are still being discovered
      /*discovery.getContractDetails(
        'MVM_CanonicalTransaction',
        'MVM CanonicalTransaction is a wrapper of Canonical Transaction Chain that implements optimistic data availability scheme L1. If Sequencer is not malicious, it simply forwards appendSequencerBatch() calls to CanonicalTransactionChain.',
      ),
      */
      discovery.getContractDetails(
        'MVM_Verifier',
        'This contract implements a voting scheme with which the majority of Verifiers can challenge malicious state roots proposed. There are no whitelisted verifiers, hence this contract is not used in practice.',
      ),

      discovery.getContractDetails(
        'CanonicalTransactionChain',
        'The Canonical Transaction Chain (CTC) contract is an append-only log of transactions which must be applied to the OVM state. Given that transactions batch hashes are sent to an EOA address, it allows any account to enqueue() a transaction, which the Sequencer must eventually append to the rollup state.',
      ),
      discovery.getContractDetails(
        'StateCommitmentChain',
        'The State Commitment Chain (SCC) stores a list of proposed state roots in a linked ChainStorageContainer contract. Only a permissioned state root proposer (MVM_Proposer) can submit new state roots.',
      ),
      {
        name: 'ChainStorageContainer-CTC-batches',
        address: EthereumAddress('0x38473Feb3A6366757A249dB2cA4fBB2C663416B7'),
      },
      {
        name: 'ChainStorageContainer-CTC-queue',
        address: EthereumAddress('0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57'),
      },
      {
        name: 'ChainStorageContainer-SCC-batches',
        address: EthereumAddress('0x10739F09f6e62689c0aA8A1878816de9e166d6f9'),
      },
      discovery.getContractDetails(
        'BondManager',
        "The Bond Manager contract will handle deposits in the form of an ERC20 token from bonded Proposers. It will also handle the accounting of gas costs spent by a Verifier during the course of a challenge. In the event of a successful challenge, the faulty Proposer's bond will be slashed, and the Verifier's gas costs will be refunded. Current mock implementation allows only OVM_Proposer to propose new state roots. No slashing is implemented.",
      ),
      discovery.getContractDetails(
        'L1CrossDomainMessenger',
        "The L1 Cross Domain Messenger (L1xDM) contract sends messages from L1 to Metis, and relays messages from Metis onto L1. In the event that a message sent from L1 to Metis is rejected for exceeding the Metis epoch gas limit, it can be resubmitted via this contract's replay function.",
      ),
      discovery.getContractDetails(
        'MVM_DiscountOracle',
        'Oracle specifying user fees for sending L1 -> Metis messages and other parameters for cross-chain communication.',
      ),
      discovery.getContractDetails(
        'Lib_AddressManager',
        'This is a library that stores the mappings between names such as OVM_Sequencer, OVM_Proposer and other contracts and their addresses.',
      ),

      discovery.getContractDetails(
        'MVM_L2ChainManagerOnL1',
        'Contract that allows METIS_MANAGER to switch Sequencer.',
      ),
      discovery.getContractDetails(
        'L1StandardBridge',
        'Main entry point for users depositing ERC20 tokens and ETH that do not require custom gateway.',
      ),
      discovery.getContractDetails(
        'LockingPool',
        'Contract allowing users to lock tokens to apply to become a sequencer, receive rewards, unlock tokens to exit the sequencer, reward distribution.',
      ),
      discovery.getContractDetails(
        'LockingInfo',
        'Contract acting as an escrow for METIS tokens managed by LockingPool.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      name: 'Mainnet launch',
      link: 'https://metisdao.medium.com/metis-to-launch-andromeda-honoring-our-commitment-to-decentralization-fa2d03394398',
      date: '2021-11-19T00:00:00Z',
      description:
        'Public launch of Metis Layer 2 Andromeda, based on the Optimism codebase.',
    },
    {
      name: 'Data availability change',
      link: 'https://metisdao.medium.com/decentralized-storage-goes-live-da876dc6eb70',
      date: '2022-04-12T00:00:00Z',
      description: 'Update moving data to an off-chain committee.',
    },
    {
      name: 'Data hashes posted to EOA',
      link: 'https://etherscan.io/address/0xFf00000000000000000000000000000000001088',
      date: '2023-03-15T00:00:00Z',
      description:
        'Hashes to data blobs are now posted to EOA address instead of CanonicalTransactionChain contract.',
    },
  ],
}
