import { ProjectTechnologyChoice } from '../../common'

const ON_CHAIN: ProjectTechnologyChoice = {
  name: 'All data required for proofs is published on chain',
  description:
    'All the data that is used to construct the system state is published on chain in the form of cheap calldata. This ensures that it will always be available when needed.',
  risks: [],
  references: [],
}

const ON_CHAIN_CANONICAL: ProjectTechnologyChoice = {
  name: 'All transaction data is recorded on chain',
  description:
    'All executed transactions are submitted to an on chain smart contract. The execution of the rollup is based entirely on the submitted transactions, so anyone monitoring the contract can know the correct state of the rollup chain.',
  risks: [],
  references: [],
}

const STARKEX_ON_CHAIN: ProjectTechnologyChoice = {
  name: 'All data required for proofs is published on chain',
  description:
    "All the relevant data that is used to recover the L2 balances Merkle Tree is published on-chain as calldata. This includes, in addition to the proven new state, the complete list of differences of the users' balances from the previous state.",
  risks: [],
  references: [
    {
      text: 'Data Availability Modes - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex/con_data_availability.html#data_availability_modes',
    },
    {
      text: 'ZK-Rollup - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex/con_data_availability.html#zk_rollup',
    },
  ],
}

const STARKNET_ON_CHAIN: ProjectTechnologyChoice = {
  name: 'All data required to reconstruct rollup state is published on chain',
  description:
    'State diffs are publish on-chain as calldata on every state update. The state diffs contain information on every contact whose storage was updated, and additional information on contract deployments. From diffs full system state can be recovered.',
  risks: [],
  references: [
    {
      text: 'On-Chain Data - Starknet documentation',
      href: 'https://docs.starknet.io/documentation/architecture_and_concepts/Data_Availability/on-chain-data/',
    },
  ],
}

const GENERIC_OFF_CHAIN: ProjectTechnologyChoice = {
  name: 'Data is not stored on chain',
  description:
    'The transaction data is not recorded on the Ethereum main chain.',
  risks: [
    {
      category: 'Funds can be lost if',
      text: 'the external data becomes unavailable.',
      isCritical: true,
    },
  ],
  references: [],
}

const ANYTRUST_OFF_CHAIN: ProjectTechnologyChoice = {
  ...GENERIC_OFF_CHAIN,
  description:
    'Users transactions are not published on-chain, but rather sent to several well known and trusted parties, also known as committee members (DAC). Members of the DAC collectively produce a Data Availability Certificate (comprising BLS signatures from a quorum) guaranteeing that the data behind the new transaction batch will be available until the expiry period elapses (currently a minimum of two weeks). This signature is not verified by L1, however external Validators will skip the batch if BLS signature is not valid resulting. This will result in a fraud proof challenge if this batch is included in a consecutive state update. It is assumed that at least one honest DAC member that signed the batch will reveal tx data to the Validators if Sequencer decides to act maliciously and withhold the data. If the Sequencer cannot gather enough signatures from the DAC, it will "fall back to rollup" mode and by posting the full data directly to the L1 chain.',
  risks: [
    ...GENERIC_OFF_CHAIN.risks,
    {
      category: 'Users can be censored if',
      text: 'the committee restricts their access to the external data.',
    },
  ],
  references: [
    {
      text: 'Inside AnyTrust - Arbitrum documentation',
      href: 'https://developer.offchainlabs.com/inside-anytrust',
    },
  ],
}

const STARKEX_OFF_CHAIN: ProjectTechnologyChoice = {
  ...GENERIC_OFF_CHAIN,
  description:
    'The balances of the users are not published on-chain, but rather sent to several well known and trusted parties, also known as committee members. A state update is valid and accepted on-chain only if at least a quorum of the committee members sign a state update.',
  risks: [
    ...GENERIC_OFF_CHAIN.risks,
    {
      category: 'Users can be censored if',
      text: 'the committee restricts their access to the external data.',
    },
  ],
  references: [
    {
      text: 'Data Availability Modes - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex/con_data_availability.html#data_availability_modes',
    },
    {
      text: 'Validium - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex/con_data_availability.html#validium_starkex',
    },
    {
      text: 'Availability Verifiers - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex/spot/shared/contract-management.html#availability_verifiers_spot',
    },
  ],
}
const PLASMA_OFF_CHAIN: ProjectTechnologyChoice = {
  ...GENERIC_OFF_CHAIN,
  description:
    'The transaction data is stored on a plasma chain and is not recorded on the Ethereum main chain.',
}

export const DATA_AVAILABILITY = {
  ON_CHAIN,
  ON_CHAIN_CANONICAL,
  STARKEX_ON_CHAIN,
  STARKNET_ON_CHAIN,
  GENERIC_OFF_CHAIN,
  STARKEX_OFF_CHAIN,
  ANYTRUST_OFF_CHAIN,
  PLASMA_OFF_CHAIN,
}
