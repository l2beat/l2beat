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
      text: 'ZK-Rollup - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex/data-availability-modes.html#zk_rollup',
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
      text: 'On-chain Data',
      href: 'https://docs.starkware.co/starkex/data-availability-modes.html',
    },
    {
      text: 'State Updates (Trades)',
      href: 'https://docs.starkware.co/starkex/trade.html#step_3_state_update',
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
    'Users transactions are not published on-chain, but rather sent to several well known and trusted parties, also known as committee members (DAC). New transaction batch needs a BLS signature with the required DAC quorum, for example 9/10. This signature is not verified by L1, however external Validators will skip the batch if BLS signature is not valid resulting. This will reslt in a fraud proof challenge if this batch is included in a consequitive state update. It is assumed that at least one honest DAC member that signed the batch will reveal tx data to the Validators if Sequencer decides to act maliciously and withhold the data.',
  risks: [
    ...GENERIC_OFF_CHAIN.risks,
    {
      category: 'Users can be censored if',
      text: 'the committee restricts their access to the external data.',
    },
  ],
  references: [
    {
      text: 'AnyTrust Chains - Arbitrum documentation',
      href: 'https://developer.offchainlabs.com/docs/anytrust',
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
      text: 'Validium - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex/data-availability-modes.html#validium_starkex_for_spot_trading',
    },
    {
      text: 'Availability Verifiers - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex/contract-management.html#availability_verifiers',
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
