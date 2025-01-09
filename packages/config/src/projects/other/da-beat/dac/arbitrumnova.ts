import { EthereumAddress, UnixTime, formatSeconds } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { nova } from '../../../layer2s/nova'
import { DAC } from '../templates/dac-template'
import { DaEconomicSecurityRisk, DaUpgradeabilityRisk } from '../types'
import { DaRelayerFailureRisk } from '../types/DaRelayerFailureRisk'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('nova')

const assumedBlockTime = 12 // seconds, different from RollupUserLogic.sol#L35 which assumes 13.2 seconds
const challengeWindow = discovery.getContractValue<number>(
  'RollupProxy',
  'confirmPeriodBlocks',
)
const challengeWindowSeconds = challengeWindow * assumedBlockTime
const l1TimelockDelay = discovery.getContractValue<number>(
  'L1Timelock',
  'getMinDelay',
)
const l2TimelockDelay = 259200 // 3 days, got from https://arbiscan.io/address/0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0#readProxyContract
const totalDelay = l1TimelockDelay + challengeWindowSeconds + l2TimelockDelay

const dac = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')
const { membersCount, requiredSignatures } = dac

const upgradeExecutorUpgradeability = {
  upgradableBy: ['SecurityCouncil', 'L1Timelock'],
  upgradeDelay: `${formatSeconds(
    totalDelay,
  )} or 0 if overridden by Security Council.`,
  upgradeConsiderations:
    'An upgrade initiated by the DAO can be vetoed by the Security Council.',
}

export const arbitrumNovaDac = DAC({
  project: nova,
  layer: {
    technology: {
      description: `
    ## Architecture
    ![Nova architecture](/images/da-layer-technology/nova/architecture.png#center)

    Nova is a data availability solution for Arbitrum rollups built on the AnyTrust protocol. It is composed of the following components:
    - **Sequencer Inbox**: Main entry point for the Sequencer submitting transaction batches.
    - **Data Availability Committee (DAC)**: A group of members responsible for storing and providing data on demand.
    - **Data Availability Certificate (DACert)**: A commitment ensuring that data blobs are available without needing full data posting on the L1 chain. 

    
    Committee members run servers that support APIs for storing and retrieving data blobs. 
    The Sequencer API allows the rollup Sequencer to submit data blobs for storage, while the REST API enables anyone to fetch data by hash. 
    When the Sequencer produces a data batch, it sends the batch along with an expiration time to Committee members, who store it and sign it. 
    Once enough signatures are collected, the Sequencer aggregates them into a valid DACert and posts it to the L1 chain inbox. 
    If the Sequencer fails to collect enough signatures, it falls back to posting the full data to the L1 chain. \n

    A DACert includes a hash of the data block, an expiration time, and proof that the required threshold of Committee members have signed off on the data. 
    The proof consists of a hash of the Keyset used in signing, a bitmap indicating which members signed, and a BLS aggregated signature. 
    L2 nodes reading from the sequencer inbox verify the certificate’s validity by checking the number of signers, the aggregated signature, and that the expiration time is at least two weeks ahead of the L2 timestamp. 
    If the DACert is valid, it provides a proof that the corresponding data is available from honest committee members.

    `,
    },
  },
  bridge: {
    createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
    requiredMembers: requiredSignatures,
    membersCount: membersCount,
    transactionDataType: DacTransactionDataType.TransactionDataCompressed,
    knownMembers: [
      {
        external: true,
        name: 'ConsenSys Software Inc.',
        href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
      },
      {
        external: true,
        name: 'QuickNode, Inc.',
        href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
      },
      {
        external: true,
        name: 'P2P.org',
        href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
      },
      {
        external: true,
        name: 'Google Cloud',
        href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
      },
      {
        external: false,
        name: 'Offchain Labs, Inc.',
        href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
      },
      {
        external: true,
        name: 'Opensea Innovation Labs Private Limited',
        href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
      },
    ],
    technology: {
      description: `
      ## DA Bridge Architecture
      ![Nova bridge architecture](/images/da-bridge-technology/nova/architecture.png#center)

      In Nova architecture, the DA commitments are posted to the L1 through the sequencer inbox, using the inbox as a DA bridge.
      The DA commitment consists of Data Availability Certificate (DACert), including a hash of the data block, an expiration time, and a proof that the required threshold of Committee members have signed off on the data.
      The sequencer distributes the data and collects signatures from Committee members offchain. Only the DACert is posted by the sequencer to the L1 chain inbox (the DA bridge), achieving L2 transaction ordering finality in a single onchain transaction.

      ## DA Bridge Upgradeability
      ![Nova bridge architecture](/images/upgrades-and-governance/nova.png#center)
      The Arbitrum DAO controls Arbitrum Nova through upgrades and modifications to their smart contracts on Layer 1 Ethereum and the Layer 2s. 
      Regular upgrades, Admin- and Owner actions originate from either the Arbitrum DAO or the non-emergency (proposer-) Security Council on Arbitrum One and pass through multiple delays and timelocks before being executed at their destination. Contrarily, the three Emergency Security Council multisigs (one on each chain: Arbitrum One, Ethereum, Arbitrum Nova) can skip delays and directly access all admin- and upgrade functions of all smart contracts. These two general paths have the same destination: the respective UpgradeExecutor smart contract.  

      Regular upgrades are scheduled in the L2 Timelock. The proposer Security Council can do this directly and the Arbitrum DAO (ARB token holders and delegates) must meet a CoreGovernor-enforced 5% threshold of the votable tokens. The L2 Timelock queues the transaction for a 3d delay and then sends it to the Outbox contract on Ethereum. This incurs another delay (the challenge period) of 6d 8h. When that has passed, the L1 Timelock delays for additional 3d. Both timelocks serve as delays during which the transparent transaction contents can be audited, and even cancelled by the Emergency Security Council. Finally, the transaction can be executed, calling Admin- or Owner functions of the respective destination smart contracts through the UpgradeExecutor on Ethereum. If the predefined transaction destination is Arbitrum One or -Nova, this last call is executed on L2 through the canonical bridge and the aliased address of the L1 Timelock.

      Operator roles like the Sequencers and Validators are managed using the same paths. Sequencer changes can be delegated to a Batch Poster Manager.
      `,
    },
    permissions: {
      ethereum: [
        // Members: DAC uses BLS sigs, not EOAs
        {
          name: 'Sequencers',
          accounts: discovery.getPermissionsByRole('sequence'),
          description:
            'Central actors allowed to submit transaction batches to the Sequencer Inbox.',
          chain: discovery.chain,
        },
        ...discovery.getMultisigPermission(
          'BatchPosterManagerMultisig',
          'It can update whether an address is authorized to be a batch poster at the sequencer inbox. The UpgradeExecutor retains the ability to update the batch poster manager (along with any batch posters).',
        ),
        ...discovery.getMultisigPermission(
          'SecurityCouncil',
          'The admin of all contracts in the system, capable of issuing upgrades without notice and delay. This allows it to censor transactions, upgrade bridge implementation potentially gaining access to all funds stored in a bridge and change the sequencer or any other system component (unlimited upgrade power). It is also the admin of the special purpose smart contracts used by validators.',
          [
            {
              text: 'Security Council members - Arbitrum DAO Governance Docs',
              href: 'https://docs.arbitrum.foundation/foundational-documents/transparency-report-initial-foundation-setup',
            },
          ],
        ),
        {
          name: 'UpgradeExecutor',
          accounts: [
            {
              address: EthereumAddress(
                discovery.getContractValue<string>('RollupProxy', 'owner'),
              ),
              type: 'Contract',
            },
          ],
          description:
            'The UpgradeExecutor can change the Committee members by updating the valid keyset.',
        },
      ],
    },
    contracts: {
      addresses: {
        ethereum: [
          discovery.getContractDetails('SequencerInbox', {
            description:
              'The DA bridge of the DAC, the main entry point for the Sequencer submitting transaction batches commitments.',
            ...upgradeExecutorUpgradeability,
          }),
          discovery.getContractDetails('UpgradeExecutor', {
            description:
              "This contract can upgrade the system's contracts. The upgrades can be done either by the Security Council or by the L1Timelock.",
            ...upgradeExecutorUpgradeability,
          }),
          discovery.getContractDetails('L1Timelock', {
            description:
              'Timelock contract for Arbitrum Governance transactions. Scheduled transactions from Arbitrum One L2 (by the DAO or the Security Council) are delayed here and can be canceled by the Security Council or executed to upgrade and change system contracts on Ethereum, Arbitrum One and -Nova.',
            ...upgradeExecutorUpgradeability,
          }),
        ],
      },
      risks: [],
    },
  },
  risks: {
    upgradeability: DaUpgradeabilityRisk.SecurityCouncil(totalDelay),
    economicSecurity: DaEconomicSecurityRisk.OffChainVerifiable,
    relayerFailure: DaRelayerFailureRisk.Governance(totalDelay),
  },
})
