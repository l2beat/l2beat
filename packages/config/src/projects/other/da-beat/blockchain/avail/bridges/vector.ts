import { EthereumAddress } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../../../../../discovery/ProjectDiscovery'
import { DaAccessibilityRisk } from '../../../types/DaAccessibilityRisk'
import { DaBridge } from '../../../types/DaBridge'
import { DaUpgradeabilityRisk } from '../../../types/DaUpgradeabilityRisk'
import { DaCommitteeSecurityRisk } from '../../../types'

const discovery = new ProjectDiscovery('vector')

const relayers = discovery.getContractValue<string[]>('SP1Vector', 'relayers')

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
    addresses: [
      {
        name: 'Vector',
        address: EthereumAddress('0x02993cdC11213985b9B13224f3aF289F03bf298d'),
        description:
          'The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.',
      },
      {
        name: 'VectorSP1Verifier',
        address: EthereumAddress(SP1Verifier),
        description: `Verifier contract for the header range [latestBlock, targetBlock] proof.`,
      },
      discovery.getContractDetails('SuccinctGatewaySP1', {
        description: `This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the on-chain verifier contract.
        `,
      }),
    ],
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the bridge contract receives a malicious code upgrade. There is no delay on code upgrades.',
      },
      {
        category: 'Funds can be lost if',
        text: 'a dishonest majority of Avail validators post incorrect or malicious data commitments.',
      },
    ],
  },
  technology: {
    description: ` 
   Vector SP1 is an implementation of zero-knowledge proof circuits for Vector, Avail's Data Attestation Bridge.
   The VectorSP1 contract should be used to store the latest data from the Avail chain, including the headers and data commitments.`,
  },
  permissions: [
    ...discovery.getMultisigPermission(
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
  ],
  usedIn: [],
  risks: {
    committeeSecurity:
      DaCommitteeSecurityRisk.RobustAndDiverseCommittee('Avail Validators'),
    accessibility: DaAccessibilityRisk.NotEnshrined,
    upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(), // no delay
  },
} satisfies DaBridge
