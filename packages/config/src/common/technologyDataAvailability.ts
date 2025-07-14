import type { ProjectRisk, ProjectTechnologyChoice } from '../types'

const ON_CHAIN_CALLDATA: ProjectTechnologyChoice = {
  name: 'All data required for proofs is published onchain',
  description:
    'All the data that is used to construct the system state is published onchain in the form of cheap calldata. This ensures that it will always be available when needed.',
  risks: [],
  references: [],
}

const ON_CHAIN_BLOB_OR_CALLDATA: ProjectTechnologyChoice = {
  name: 'All data required for proofs is published on chain',
  description:
    'All the data that is used to construct the system state is published on chain in the form of cheap blobs or calldata. This ensures that it will be available for enough time.',
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
    "All the relevant data that is used to recover the balances Merkle Tree is published onchain as calldata. This includes, in addition to the proven new state, the complete list of differences of the users' balances from the previous state.",
  risks: [],
  references: [
    {
      title: 'Data Availability Modes - StarkEx documentation',
      url: 'https://docs.starkware.co/starkex/con_data_availability.html#data_availability_modes',
    },
    {
      title: 'ZK Rollup - StarkEx documentation',
      url: 'https://docs.starkware.co/starkex/con_data_availability.html#zk_rollup',
    },
  ],
}

const STARKNET_ON_CHAIN = (usesBlobs = false): ProjectTechnologyChoice => {
  const blobOr = usesBlobs ? 'blob or ' : ''
  return {
    name: 'All data required to reconstruct rollup state is published on chain',
    description: `State diffs are publish onchain as ${blobOr}calldata on every state update. The state diffs contain information on every contact whose storage was updated, and additional information on contract deployments. From diffs full system state can be recovered. Contracts' code is not published on L1, but can be trustlessly verified if available elsewhere.`,
    risks: [],
    references: [
      {
        title: 'On-Chain Data - Starknet documentation',
        url: 'https://docs.starknet.io/documentation/architecture_and_concepts/Network_Architecture/on-chain-data/',
      },
    ],
  }
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

function ANYTRUST_OFF_CHAIN(DAC: {
  membersCount: number
  requiredSignatures: number
}): ProjectTechnologyChoice {
  return {
    ...GENERIC_OFF_CHAIN,
    description: `Users transactions are not published onchain, but rather sent to external trusted parties, also known as committee members (DAC). Members of the DAC collectively produce a Data Availability Certificate (comprising BLS signatures from a quorum) guaranteeing that the data behind the new transaction batch will be available until the expiry period elapses (currently a minimum of two weeks). This signature is not verified by L1, however external Validators will skip the batch if BLS signature is not valid resulting. This will result in a fraud proof challenge if this batch is included in a consecutive state update. It is assumed that at least one honest DAC member that signed the batch will reveal tx data to the Validators if Sequencer decides to act maliciously and withhold the data. If the Sequencer cannot gather enough signatures from the DAC, it will "fall back to rollup" mode and by posting the full data directly to the L1 chain. The current DAC threshold is ${DAC.requiredSignatures} out of ${DAC.membersCount}.`,
    risks: [
      ...GENERIC_OFF_CHAIN.risks,
      {
        category: 'Users can be censored if',
        text: 'the committee restricts their access to the external data.',
      },
    ],
    references: [
      {
        title: 'Inside AnyTrust - Arbitrum documentation',
        url: 'https://developer.offchainlabs.com/inside-anytrust',
      },
    ],
  }
}

const STARKEX_OFF_CHAIN: ProjectTechnologyChoice = {
  ...GENERIC_OFF_CHAIN,
  description:
    'The balances of the users are not published onchain, but rather sent to external trusted parties, also known as committee members. A state update is valid and accepted onchain only if at least a quorum of the committee members sign a state update.',
  risks: [
    ...GENERIC_OFF_CHAIN.risks,
    {
      category: 'Users can be censored if',
      text: 'the committee restricts their access to the external data.',
    },
  ],
  references: [
    {
      title: 'Data Availability Modes - StarkEx documentation',
      url: 'https://docs.starkware.co/starkex/con_data_availability.html#data_availability_modes',
    },
    {
      title: 'Validium - StarkEx documentation',
      url: 'https://docs.starkware.co/starkex/con_data_availability.html#validium_starkex',
    },
    {
      title: 'Availability Verifiers - StarkEx documentation',
      url: 'https://docs.starkware.co/starkex/spot/shared/contract-management.html#availability_verifiers_spot',
    },
  ],
}
const PLASMA_OFF_CHAIN: ProjectTechnologyChoice = {
  ...GENERIC_OFF_CHAIN,
  description:
    'The transaction data is stored on a plasma chain and is not recorded on the Ethereum main chain.',
}

function CELESTIA_OFF_CHAIN(
  isUsingBlobstream: boolean,
): ProjectTechnologyChoice {
  const additionalDescription = isUsingBlobstream
    ? ' The blobstream bridge is used to verify attestations from the Celestia validator set that the data is indeed available.'
    : ' Since the Blobstream bridge is not used, availability of the data is not verified against Celestia validators, meaning that the Sequencer can single-handedly publish unavailable roots.'
  return {
    name: 'Data is posted to Celestia',
    description:
      'Transactions roots are posted onchain and the full data is posted on Celestia. ' +
      additionalDescription,
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the sequencer posts an unavailable transaction root.',
        isCritical: true,
      },
      {
        category: 'Funds can be lost if',
        text: 'the data is not available on the external provider.',
        isCritical: true,
      },
    ],
    references: [
      {
        title: 'Introducing Blobstream: streaming modular DA to Ethereum',
        url: 'https://blog.celestia.org/introducing-blobstream/',
      },
    ],
  }
}

function AVAIL_OFF_CHAIN(isUsingVector: boolean): ProjectTechnologyChoice {
  const additionalDescription = isUsingVector
    ? ' The vector bridge is used to verify attestations from the Avail validator set that the data is indeed available.'
    : ' Since the Vector bridge is not used, availability of the data is not verified against Avail validators, meaning that the Sequencer can single-handedly publish unavailable commitments.'
  return {
    name: 'Data is posted to Avail',
    description:
      'Transactions roots are posted onchain and the full data is posted on Avail. ' +
      additionalDescription,
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the sequencer posts an unavailable transaction root.',
        isCritical: true,
      },
      {
        category: 'Funds can be lost if',
        text: 'the data is not available on the external provider.',
        isCritical: true,
      },
    ],
    references: [
      {
        title:
          "Avail's Data Attestation Bridge: Enabling Secure Validiums and Optimistic Chains",
        url: 'https://blog.availproject.org/data-attestation-bridge/',
      },
    ],
  }
}

function EIGENDA_OFF_CHAIN(
  isUsingServiceManager: boolean,
): ProjectTechnologyChoice {
  const additionalDescription = isUsingServiceManager
    ? ' The ServiceManager bridge is used to verify attestations from the EigenDA operator set that the data is indeed available.'
    : ' Since the ServiceManager bridge is not used, availability of the data is not verified against EigenDA operators, meaning that the Sequencer can single-handedly publish unavailable commitments.'
  return {
    name: 'Data is posted to EigenDA',
    description:
      'Transactions roots are posted onchain and the full data is posted on EigenDA. ' +
      additionalDescription,
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the sequencer posts an unavailable transaction root.',
        isCritical: true,
      },
      {
        category: 'Funds can be lost if',
        text: 'the data is not available on the external provider.',
        isCritical: true,
      },
    ],
    references: [
      {
        title: 'EigenDA Docs - Overview',
        url: 'https://docs.eigenda.xyz/overview',
      },
    ],
  }
}

function DACHALLENGES_OFF_CHAIN(
  daChallengeWindow: string,
  daResolveWindow: string,
  nodeSourceLink?: string,
): ProjectTechnologyChoice {
  const risks: ProjectRisk[] = [
    {
      category: 'Funds can be stolen if',
      text: 'the sequencer is malicious and is able to economically outspend the altruistic challengers.',
    },
    {
      category: 'Funds can be stolen if',
      text: 'there is no challenger willing to challenge unavailable data commitments.',
    },
  ]
  if (!nodeSourceLink) {
    risks.push({
      category: 'Funds can be stolen if',
      text: 'the source-unavailable L2 node is configured to ignore successful DA challenges.',
    })
  }
  return {
    name: 'Data required to compute fraud proof is published offchain without onchain attestations',
    description: `The project relies on DA challenges for data availability. If a DA challenger finds that the data behind a tx data commitment is not available, 
      they can submit a challenge which requires locking a bond within ${daChallengeWindow}. A challenge can be resolved by publishing the preimage data within an additional ${daResolveWindow}. 
      In such a case, a portion of the challenger bond is burned, with the exact amount estimated as the cost incurred by the resolver to publish the full data, 
      meaning that the resolver and challenger will approximately lose the same amount of funds. The system is not secure if the malicious sequencer is able to outspend the altruistic challengers. 
      If instead, after a challenge, the preimage data is not published, the chain reorgs to the last fully derivable state. This mechanism fully depends on the derivation rule of the L2 node and can only be verified in its source code,${nodeSourceLink ? ` which [can be reviewed here](${nodeSourceLink}).` : ' which in this case is not made available.'}`,
    references: [
      {
        title: 'OP Plasma specification',
        url: 'https://github.com/ethereum-optimism/specs/blob/main/specs/experimental/alt-da.md',
      },
      {
        title: 'Universal Plasma and DA Challenges - Ethresear.ch',
        url: 'https://ethresear.ch/t/universal-plasma-and-da-challenges/18629',
      },
    ],
    risks,
  }
}

export const TECHNOLOGY_DATA_AVAILABILITY = {
  ON_CHAIN_CALLDATA,
  ON_CHAIN_BLOB_OR_CALLDATA,
  ON_CHAIN_CANONICAL,
  STARKEX_ON_CHAIN,
  STARKNET_ON_CHAIN,
  GENERIC_OFF_CHAIN,
  STARKEX_OFF_CHAIN,
  ANYTRUST_OFF_CHAIN,
  PLASMA_OFF_CHAIN,
  CELESTIA_OFF_CHAIN,
  AVAIL_OFF_CHAIN,
  EIGENDA_OFF_CHAIN,
  DACHALLENGES_OFF_CHAIN,
}
