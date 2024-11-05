import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../../../discovery/ProjectDiscovery'
import { DaCommitteeSecurityRisk } from '../../../../types/DaCommitteeSecurityRisk'
import { DaRelayerFailureRisk } from '../../../../types/DaRelayerFailureRisk'
import { DaUpgradeabilityRisk } from '../../../../types/DaUpgradeabilityRisk'
import { CELESTIA_BLOBSTREAM } from './template'

const ethereumDiscovery = new ProjectDiscovery('blobstream')
const arbitrumDiscovery = new ProjectDiscovery('blobstream', 'arbitrum')
const baseDiscovery = new ProjectDiscovery('blobstream', 'base')

const ethereumUpdateInterval = 4 // hours
const arbitrumUpdateInterval = 1 // hours
const baseUpdateInterval = 1 // hours

const maxRangeDataCommitment = ethereumDiscovery.getContractValue<number>(
  'Blobstream',
  'DATA_COMMITMENT_MAX',
)

const baseMaxRangeDataCommitment = baseDiscovery.getContractValue<number>(
  'Blobstream',
  'DATA_COMMITMENT_MAX',
)

const arbitrumMaxRangeDataCommitment =
  arbitrumDiscovery.getContractValue<number>(
    'Blobstream',
    'DATA_COMMITMENT_MAX',
  )

const relayers = ethereumDiscovery.getContractValue<string[]>(
  'Blobstream',
  'relayers',
)

const arbitrumRelayers = arbitrumDiscovery.getContractValue<string[]>(
  'Blobstream',
  'relayers',
)

const baseRelayers = baseDiscovery.getContractValue<string[]>(
  'Blobstream',
  'relayers',
)

const SP1Verifier = ethereumDiscovery.getContractValue<string>(
  'SuccinctGatewaySP1',
  'verifier',
)[0]

const ArbitrumSP1Verifier = arbitrumDiscovery.getContractValue<string>(
  'SuccinctGatewaySP1',
  'verifier',
)[0]

const BaseSP1Verifier = baseDiscovery.getContractValue<string>(
  'SuccinctGatewaySP1',
  'verifier',
)[0]

export const SP1Blobstream = CELESTIA_BLOBSTREAM({
  chain: 'ethereum',
  createdAt: new UnixTime(1729253328), // 2024-10-18T12:08:48Z
  usedIn: [
    // no project integrates it for state validation
  ],
  display: {
    links: {
      websites: [],
      documentation: ['https://docs.celestia.org/developers/blobstream'],
      repositories: ['https://github.com/succinctlabs/sp1-blobstream'],
      apps: [],
      explorers: ['https://etherscan.io/'],
      socialMedia: [],
    },
  },

  technology: {
    description: `

    ## Architecture
      
    ![Celestia blobstream architecture](/images/da-bridge-technology/celestia/blobstream/architecture.png#center)
    
     The Blobstream bridge is a data availability bridge that facilitates data availability commitments to be bridged between Celestia and Ethereum.
     The Blobstream bridge is composed of three main components: the **Blobstream** contract, the **Succinct Gateway** contracts, and the **Verifier** contracts.  <br /> 
     By default, Blobstream operates asynchronously, handling requests in a fulfillment-based manner. First, zero-knowledge proofs of Celestia block ranges are requested for proving. Requests can be submitted either off-chain through the Succinct API, or onchain through the [requestCall()](https://etherscan.io/address/0x6c7a05e0AE641c6559fD76ac56641778B6eCd776#code#F1#L148) method of the Succinct Gateway smart contract.
     Alternatively, it is possible to run an SP1 Blobstream operator with local proving, allowing for self-generating the proofs.
     Once a proving request is received, the off-chain prover generates the proof and [relays it](https://github.com/succinctlabs/sp1-blobstream/blob/b35c92bfcfc9a1711ea014cc871d6dd610dd5392/script/bin/operator.rs#L164) to Blobstream contract. The Blobstream contract verifies the proof with the corresponding verifier contract and, if successful, stores the data commitment in storage. <br /> 

     [Verifying a header range](https://github.com/succinctlabs/sp1-blobstream/blob/b35c92bfcfc9a1711ea014cc871d6dd610dd5392/script/bin/operator.rs#L136) includes verifying tendermint consensus (header signatures are 2/3 of stake) and verifying the data commitment root.
      By default, Blobstream on Ethereum is updated by the Succinct operator at a regular cadence of ${ethereumUpdateInterval} hour.
      For Blobstream on Arbitrum, the update interval is ${arbitrumUpdateInterval} hour, and for Blobstream on Base, the update interval is ${baseUpdateInterval} hour.
    `,
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the DA bridge accepts an incorrect or malicious data commitment provided by 2/3 of Celestia validators.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'the permissioned relayers are unable to submit DA commitments to the Blobstream contract.',
      },
    ],
  },
  contracts: {
    addresses: {
      ethereum: [
        ethereumDiscovery.getContractDetails('Blobstream', {
          description:
            'The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and Ethereum.',
        }),
        {
          name: 'blobstreamVerifier',
          address: EthereumAddress(SP1Verifier),
          description: `Verifier contract for the header range [latestBlock, targetBlock] proof.
        A request for a header range can be at most ${maxRangeDataCommitment} blocks long. The proof is generated by an off-chain prover and submitted by a relayer.`,
        },
        ethereumDiscovery.getContractDetails('SuccinctGatewaySP1', {
          description: `This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the on-chain verifier contract.
        `,
        }),
        ethereumDiscovery.getContractDetails('SuccinctGateway', {
          description: `Users can interact with this contract to request proofs on-chain, emitting a RequestCall event for off-chain provers to consume.`,
        }),
      ],
      arbitrum: [
        arbitrumDiscovery.getContractDetails('Blobstream', {
          description:
            'The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and Ethereum.',
        }),
        {
          name: 'blobstreamVerifier',
          chain: 'arbitrum',
          address: EthereumAddress(ArbitrumSP1Verifier),
          description: `Verifier contract for the header range [latestBlock, targetBlock] proof.
        A request for a header range can be at most ${arbitrumMaxRangeDataCommitment} blocks long. The proof is generated by an off-chain prover and submitted by a relayer.`,
        },
        arbitrumDiscovery.getContractDetails('SuccinctGatewaySP1', {
          description: `This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the on-chain verifier contract.
        `,
        }),
        arbitrumDiscovery.getContractDetails('SuccinctGateway', {
          description: `Users can interact with this contract to request proofs on-chain, emitting a RequestCall event for off-chain provers to consume.`,
        }),
      ],
      base: [
        baseDiscovery.getContractDetails('Blobstream', {
          description:
            'The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and Ethereum.',
        }),
        {
          name: 'blobstreamVerifier',
          chain: 'base',
          address: EthereumAddress(BaseSP1Verifier),
          description: `Verifier contract for the header range [latestBlock, targetBlock] proof.
        A request for a header range can be at most ${baseMaxRangeDataCommitment} blocks long. The proof is generated by an off-chain prover and submitted by a relayer.`,
        },
        baseDiscovery.getContractDetails('SuccinctGatewaySP1', {
          description: `This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the on-chain verifier contract.
        `,
        }),
        baseDiscovery.getContractDetails('SuccinctGateway', {
          description: `Users can interact with this contract to request proofs on-chain, emitting a RequestCall event for off-chain provers to consume.`,
        }),
      ],
    },
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the bridge contract or its dependencies receive a malicious code upgrade. There is no delay on code upgrades.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'the bridge contract is frozen by the Guardian (BlobstreamMultisig).',
      },
    ],
  },
  permissions: {
    ethereum: [
      ...ethereumDiscovery.getMultisigPermission(
        'BlobstreamMultisig',
        'This multisig is the admin of the Blobstream contract. It holds the power to change the contract state and upgrade the bridge.',
      ),
      ...ethereumDiscovery.getMultisigPermission(
        'SuccinctGatewaySP1Multisig',
        'This multisig is the admin of the SuccinctGatewaySP1 contract. As the manager of router for proof verification, it holds the power to affect the liveness and safety of the bridge.',
      ),
      {
        name: 'Relayers',
        description: `List of prover (relayer) addresses that are allowed to call commitHeaderRange() to commit block ranges to the Blobstream contract.`,
        accounts: relayers.map((relayer) => ({
          address: EthereumAddress(relayer),
          type: 'EOA',
        })),
      },
      {
        name: 'Guardians',
        description: `The Blobstream guardians hold the power to freeze the bridge contract, update the SuccinctGateway contract and update the list of authorized relayers.`,
        accounts: ethereumDiscovery.getAccessControlRolePermission(
          'Blobstream',
          'GUARDIAN_ROLE',
        ),
        fromRole: true,
      },
    ],
    arbitrum: [
      ...arbitrumDiscovery.getMultisigPermission(
        'BlobstreamMultisig',
        'This multisig is the admin of the Blobstream contract. It holds the power to change the contract state and upgrade the bridge.',
      ),
      ...arbitrumDiscovery.getMultisigPermission(
        'SuccinctGatewaySP1Multisig',
        'This multisig is the admin of the SuccinctGatewaySP1 contract. As the manager of router for proof verification, it holds the power to affect the liveness and safety of the bridge.',
      ),
      {
        name: 'Relayers',
        chain: 'arbitrum',
        description: `List of prover (relayer) addresses that are allowed to call commitHeaderRange() to commit block ranges to the Blobstream contract.`,
        accounts: arbitrumRelayers.map((relayer) => ({
          address: EthereumAddress(relayer),
          type: 'EOA',
        })),
      },
    ],
    base: [
      ...baseDiscovery.getMultisigPermission(
        'BlobstreamMultisig',
        'This multisig is the admin of the Blobstream contract. It holds the power to change the contract state and upgrade the bridge.',
      ),
      ...baseDiscovery.getMultisigPermission(
        'SuccinctGatewaySP1Multisig',
        'This multisig is the admin of the SuccinctGatewaySP1 contract. As the manager of router for proof verification, it holds the power to affect the liveness and safety of the bridge.',
      ),
      {
        name: 'Relayers',
        chain: 'base',
        description: `List of prover (relayer) addresses that are allowed to call commitHeaderRange() to commit block ranges to the Blobstream contract.`,
        accounts: baseRelayers.map((relayer) => ({
          address: EthereumAddress(relayer),
          type: 'EOA',
        })),
      },
    ],
  },
  risks: {
    committeeSecurity:
      DaCommitteeSecurityRisk.RobustAndDiverseCommittee('Validator set'),
    upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(0), // TIMELOCK_ROLE is 4/6 multisig
    relayerFailure: DaRelayerFailureRisk.NoMechanism,
  },
})
