import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../../../../../discovery/ProjectDiscovery'
import { DaCommitteeSecurityRisk } from '../../../types'
import { DaBridge } from '../../../types/DaBridge'
import { DaRelayerFailureRisk } from '../../../types/DaRelayerFailureRisk'
import { DaUpgradeabilityRisk } from '../../../types/DaUpgradeabilityRisk'

const discovery = new ProjectDiscovery('vector')

const chainName = 'Ethereum'
const updateInterval = 1.5 // hours
const relayers = discovery.getContractValue<string[]>('Vector', 'relayers')

const SP1Verifier = discovery.getContractValue<string>(
  'SuccinctGatewaySP1',
  'verifier',
)[0]

const validation = {
  type: 'zk-proof',
  relayer: 'SuccinctGateway',
}

export const vector = {
  id: 'vector',
  createdAt: new UnixTime(1725372159), // 2024-09-03T14:02:39Z
  type: 'OnChainBridge',
  chain: 'Ethereum',
  display: {
    name: 'Vector',
    slug: 'vector',
    description: `Vector is a data availability bridge using Zero-Knowledge proofs to verify Avail data availability attestations on Ethereum.`,
    links: {
      websites: [],
      documentation: ['https://docs.succinct.xyz/'],
      repositories: ['https://github.com/succinctlabs/sp1-vector'],
      apps: [],
      explorers: [],
      socialMedia: [],
    },
  },
  validation: validation,
  contracts: {
    addresses: {
      ethereum: [
        {
          name: 'Vector',
          address: EthereumAddress(
            '0x02993cdC11213985b9B13224f3aF289F03bf298d',
          ),
          description:
            'The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.',
        },
        {
          name: 'VectorSP1Verifier',
          address: EthereumAddress(SP1Verifier),
          description: `Verifier contract for the header range [latestBlock, targetBlock] proof.`,
        },
        discovery.getContractDetails('SuccinctGatewaySP1', {
          description: `This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
        `,
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
        text: 'the bridge contract is frozen by the Guardian (AvailMultisig).',
      },
    ],
  },
  technology: {
    description: ` 
    ## Architecture
      
    ![Avail vector architecture](/images/da-bridge-technology/avail/vector/architecture.png#center)
    
     The Vector bridge is a data availability bridge that facilitates data availability commitments to be bridged between Avail and ${chainName}.
     The SP1 Vector bridge is composed of three main components: the **Vector** contract, the **Succinct Gateway** contracts, and the **Verifier** contracts.  <br /> 
     By default, Vector operates asynchronously, handling requests in a fulfillment-based manner. First, zero-knowledge proofs of Avail block ranges are requested for proving. Requests can be submitted either off-chain through the Succinct API, or onchain through the requestCall() method of the Succinct Gateway smart contract.
     Alternatively, it is possible to run an SP1 Vector operator with local proving, allowing for self-generating the proofs.
     Once a proving request is received, the off-chain prover generates the proof and relays it to the Vector contract. The Vector contract verifies the proof with the corresponding verifier contract and, if successful, stores the data commitment in storage. <br /> 

    By default, Vector on ${chainName} is updated by the Succinct operator at a cadence of approximately ${updateInterval} hours.
    `,
    references: [
      {
        text: 'SP1 Vector Operator',
        href: 'https://github.com/succinctlabs/sp1-vector/blob/a9689768ff4052e0933cc575b79001d4bcfa0cd5/script/bin/operator.rs',
      },
      {
        text: 'Succinct Gateway - Etherscan',
        href: 'https://etherscan.io/address/0x6c7a05e0AE641c6559fD76ac56641778B6eCd776#code#F1#L148',
      },
    ],
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the DA bridge accepts an incorrect or malicious data commitment provided by 2/3 of Avail validators.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'excluding L2-specific DA fallback - the permissioned relayers are unable to submit DA commitments to the Vector contract.',
      },
    ],
  },
  permissions: {
    ethereum: [
      ...discovery.getMultisigPermission(
        'AvailMultisig',
        'This multisig is the admin and guardian of the Vector contract. It holds the power to change the contract state and upgrade the bridge.',
      ),
      ...discovery.getMultisigPermission(
        'SuccinctGatewaySP1Multisig',
        'This multisig is the admin of the SuccinctGatewaySP1 contract. As the manager of router for proof verification, it holds the power to affect the liveness and safety of the bridge.',
      ),
      {
        name: 'Relayers',
        description: `List of prover (relayer) addresses that are allowed to call commitHeaderRange() to commit block ranges to the Vector contract.`,
        accounts: relayers.map((relayer) => ({
          address: EthereumAddress(relayer),
          type: 'EOA',
        })),
      },
      {
        name: 'Guardians',
        description: `The Vector guardians hold the power to freeze the bridge contract, update the SuccinctGateway contract and update the list of authorized relayers.`,
        accounts: discovery.getAccessControlRolePermission(
          'Vector',
          'GUARDIAN_ROLE',
        ),
      },
    ],
  },
  usedIn: [],
  risks: {
    committeeSecurity:
      DaCommitteeSecurityRisk.RobustAndDiverseCommittee('Validator set'),
    upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(), // 4/7 multisig w/ no delay
    relayerFailure: DaRelayerFailureRisk.NoMechanism,
  },
} satisfies DaBridge
